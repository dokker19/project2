var width = 960, height = 600;

var projection = d3.geoMercator()
    .translate([width / 2, height / 2])
    .scale(150);

var path = d3.geoPath().projection(projection);

var svg = d3.select("svg");

// Define a tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load in GeoJSON data for countries and wealth inequality JSON data
Promise.all([
    d3.json("https://enjalot.github.io/wwsd/data/world/world-110m.geojson"),
    d3.json("wealth_inequality.json")
]).then(function([json, inequalityData]) {
    var giniData = {};
    inequalityData.forEach(function(d) {
        giniData[d.cca3] = {
            gini: d.WealthInequalityGiniIndex,
            year: d.WealthInequalityGiniIndexYear
        };
    });

    // Bind data and create one path per GeoJSON feature
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("class", "country")
        .style("fill", function(d) {
            var countryData = giniData[d.id];
            if (countryData && countryData.gini) {
                // Normalize the Gini value to a 0-1 range for the color scale.
                // Assuming Gini values typically range from 20 to 70.
                var normalizedGini = (countryData.gini - 20) / (55 - 20);
                return d3.scaleSequential(d3.interpolateYlOrRd)(normalizedGini); // 1 - normalizedGini to flip the color scale
            } else {
                return "#ccc"; // Default color for countries without data
            }
        })
        .on("mouseover", function(event, d) {
            var countryData = giniData[d.id]; // Changed from d.properties.iso_a3 to d.id
            if (countryData) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Country: ${d.properties.name}<br>Gini Index: ${countryData.gini} (${countryData.year})`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            } else {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Country: ${d.properties.name}<br>No Gini Index Data Available`)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            }
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });
}).catch(function(error) {
    console.error('Error loading the data: ', error);
});


// Data representing pay gap percentages
var payGapData = [
    { category: 'Men', percentage: 85 },
    { category: 'Women', percentage: 15 }
  ];

  var svg = d3.selectAll("pay-gap-svg");

  // Draw the dollar bill
  var dollarBill = svg.append("g")
    .attr("transform", "translate(50, 50)");

  dollarBill.append("rect")
    .attr("width", 20)
    .attr("height", 100)
    .attr("class", "pay-gap");

  dollarBill.append("rect")
    .attr("width", 20)
    .attr("height", 100)
    .attr("transform", "translate(30, 0)");

  // Draw pay gap bars
  var bars = svg.selectAll(".bar")
    .data(payGapData)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return d.category === 'Men' ? 50 : 80;
    })
    .attr("y", function (d) {
      return 100 - d.percentage;
    })
    .attr("width", 20)
    .attr("height", function (d) {
      return d.percentage;
    });

