var width = 1000, height = 550;

var projection = d3.geoMercator()
    .translate([width / 2, height / 2])
    .scale(150);

var path = d3.geoPath().projection(projection);


var svg_mapworld = d3.select("svg.world_map");

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
    svg_mapworld.selectAll("path")
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

//-------------------------------------------------------------------------------
// Wage Gap
// Set dimensions and margins for the chart

const margin_wage = { top: 30, right: 30, bottom: 30, left: 50 };
const width_wage = 600 - margin_wage.left - margin_wage.right;
const height_wage = 350 - margin_wage.top - margin_wage.bottom;

// Set up the x and y scales

const x_wage = d3.scaleLinear()
  .range([0, width_wage]);

const y_wage = d3.scaleLinear()
  .range([height_wage, 0]);

// var svg_wagegap = d3.select("svg.pay-gap-svg");


const sgv_wage = d3.select("#wage-container")
  .append("svg")
    .attr("width", width_wage + margin_wage.left + margin_wage.right)
    .attr("height", height_wage + margin_wage.top + margin_wage.bottom)
  .append("g")
    .attr("transform", `translate(${margin_wage.left},${margin_wage.top})`);

    // / Create a fake dataset

    const male_dataset_wage = [
      { date: 1965, value: 100 },
      { date: 1970, value: 90 },
      { date: 1975, value: 80 },
      { date: 1980, value: 70 },
      { date: 1985, value: 65 },
      { date: 1990, value: 60 },
      { date: 1995, value: 65 },
      { date: 2000, value: 50 },
      { date: 2005, value: 60 },
      { date: 2010, value: 70 },
      { date: 2015, value: 80 },
      { date: 2020, value: 90 }
    ];
    const female_dataset_wage = [
        { date: 1965, value: 0 },
        { date: 1970, value: 10},
        { date: 1975, value: 20},
        { date: 1980, value: 30 },
        { date: 1985, value: 35 },
        { date: 1990, value: 40 },
        { date: 1995, value: 41 },
        { date: 2000, value: 42 },
        { date: 2005, value: 43 },
        { date: 2010, value: 44 },
        { date: 2015, value: 45 },
        { date: 2020, value: 50 }
      ];
    
    // Define the x and y domains
    x_wage.domain([1960, 2022]);
    y_wage.domain([0, 100]);
    
    // Add the x-axis
    
    sgv_wage.append("g")
      .attr("transform", `translate(0,${height_wage})`)
      .call(d3.axisBottom(x_wage))
        // .ticks(d3.timeMonth.every(1)) 
        // .tickFormat(d3.timeFormat(" %Y"))); 
    
    
    // Add the y-axis
    
    sgv_wage.append("g")
      .call(d3.axisLeft(y_wage))
    
    // Create the line generator
    
    const line_wage = d3.line()
      .x(d => x_wage(d.date))
      .y(d => y_wage(d.value));
    
    // Add the line path to the SVG element
    
    sgv_wage.append("path")
      .datum(male_dataset_wage)
      .attr("fill", "lightblue")
      .attr("fill-opacity", 0.5).attr("fill-opacity", 0.5)
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line_wage);

      sgv_wage.append("path")
      .datum(female_dataset_wage)
      .attr("fill", "#F4C2C2")
      .attr("fill-opacity", 0.5)
      .attr("stroke", "#fe019a")
      .attr("stroke-width", 2)
      .attr("d", line_wage);
    
//-------------------------------------------------------------------------------
// Wage Gap and Race
// Set dimensions and margins for the chart

const margin_wage_race = { top: 30, right: 30, bottom: 30, left: 50 };
const width_wage_race = 600 - margin_wage_race.left - margin_wage_race.right;
const height_wage_race = 350 - margin_wage_race.top - margin_wage_race.bottom;

// Set up the x and y scales

const x_wage_race = d3.scaleLinear()
  .range([0, width_wage_race]);

const y_wage_race = d3.scaleLinear()
  .range([height_wage_race, 0]);


const sgv_wage_race = d3.select("#race-gap-container")
  .append("svg")
    .attr("width", width_wage_race + margin_wage_race.left + margin_wage_race.right)
    .attr("height", height_wage_race + margin_wage_race.top + margin_wage_race.bottom)
  .append("g")
    .attr("transform", `translate(${margin_wage_race.left},${margin_wage_race.top})`);

    // / Create a fake dataset

    const male_dataset_wage_race = [
      { date: 1965, value: 100 },
      { date: 1970, value: 90 },
      { date: 1975, value: 80 },
      { date: 1980, value: 70 },
      { date: 1985, value: 65 },
      { date: 1990, value: 60 },
      { date: 1995, value: 65 },
      { date: 2000, value: 50 },
      { date: 2005, value: 60 },
      { date: 2010, value: 70 },
      { date: 2015, value: 80 },
      { date: 2020, value: 90 }
    ];
    const female_dataset_wage_race = [
        { date: 1965, value: 0 },
        { date: 1970, value: 10},
        { date: 1975, value: 20},
        { date: 1980, value: 30 },
        { date: 1985, value: 35 },
        { date: 1990, value: 70 },
        { date: 1995, value: 41 },
        { date: 2000, value: 42 },
        { date: 2005, value: 43 },
        { date: 2010, value: 44 },
        { date: 2015, value: 45 },
        { date: 2020, value: 50 }
      ];
    
    // Define the x and y domains
    x_wage_race.domain([1960, 2022]);
    y_wage_race.domain([0, 100]);
    
    // Add the x-axis
    
    sgv_wage_race.append("g")
      .attr("transform", `translate(0,${height_wage_race})`)
      .call(d3.axisBottom(x_wage_race))
        // .ticks(d3.timeMonth.every(1)) 
        // .tickFormat(d3.timeFormat(" %Y"))); 
    
    
    // Add the y-axis
    
    sgv_wage_race.append("g")
      .call(d3.axisLeft(y_wage_race))
    
    // Create the line generator
    
    const line_wage_race = d3.line()
      .x(d => x_wage_race(d.date))
      .y(d => y_wage_race(d.value));
    
    // Add the line path to the SVG element
    
    sgv_wage_race.append("path")
      .datum(male_dataset_wage_race)
      .attr("fill", "lightblue")
      .attr("fill-opacity", 0.5).attr("fill-opacity", 0.5)
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line_wage_race);

      sgv_wage_race.append("path")
      .datum(female_dataset_wage_race)
      .attr("fill", "#F4C2C2")
      .attr("fill-opacity", 0.5)
      .attr("stroke", "#fe019a")
      .attr("stroke-width", 2)
      .attr("d", line_wage_race);
    
