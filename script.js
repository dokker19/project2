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


// wage gap
const width = 960;
const height = 600;

// Set up the x and y scales

const x = d3.scaleTime()
  .range([0, width]);

const y = d3.scaleLinear()
  .range([height, 0]);

// Create the SVG element and append it to the chart container

const svg_wg = d3.selectAll("pay-gap-svg")

// Create a fake dataset
const dataset = [
  { date: new Date("2022-01-01"), value: 200 },
  { date: new Date("2022-02-01"), value: 250 },
  { date: new Date("2022-03-01"), value: 180 },
  { date: new Date("2022-04-01"), value: 300 },
  { date: new Date("2022-05-01"), value: 280 },
  { date: new Date("2022-06-01"), value: 220 },
  { date: new Date("2022-07-01"), value: 300 },
  { date: new Date("2022-08-01"), value: 450 },
  { date: new Date("2022-09-01"), value: 280 },
  { date: new Date("2022-10-01"), value: 600 },
  { date: new Date("2022-11-01"), value: 780 },
  { date: new Date("2022-12-01"), value: 320 }
];

// Define the x and y domains
x.domain(d3.extent(dataset, d => d.date));
y.domain([0, d3.max(dataset, d => d.value)]);

// Add the x-axis

svg_wg.append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x)
    .ticks(d3.timeMonth.every(1)) 
    .tickFormat(d3.timeFormat("%b %Y"))); 


// Add the y-axis

svg_wg.append("g")
  .call(d3.axisLeft(y))

// Create the line generator

const line = d3.line()
  .x(d => x(d.date))
  .y(d => y(d.value));

// Add the line path to the SVG element

svg_wg.append("path")
  .datum(dataset)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1)
  .attr("d", line);