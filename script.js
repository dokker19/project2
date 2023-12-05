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
//BARGRAHPH1
const data0 = [
    { idx: 1, country: 'South Africa', giniIndex: 63.00, year: 2014 },
    { idx: 2, country: 'Namibia', giniIndex: 59.10, year: 2015 },
    { idx: 3, country: 'Zambia', giniIndex: 57.10, year: 2015 },
    { idx: 4, country: 'Central African Republic', giniIndex: 56.20, year: 2008 },
    { idx: 5, country: 'Eswatini', giniIndex: 54.60, year: 2016 },
    { idx: 6, country: 'Colombia', giniIndex: 54.20, year: 2020 },
    { idx: 7, country: 'Botswana', giniIndex: 53.30, year: 2015 },
    { idx: 8, country: 'Angola', giniIndex: 51.30, year: 2018 },
    { idx: 9, country: 'St. Lucia', giniIndex: 51.20, year: 2016 },
    { idx: 10, country: 'Zimbabwe', giniIndex: 50.30, year: 2019 },
    { idx: 11, country: 'Panama', giniIndex: 49.80, year: 2019 },
    { idx: 12, country: 'Costa Rica', giniIndex: 49.30, year: 2020 },
    { idx: 13, country: 'Brazil', giniIndex: 48.90, year: 2020 },
    { idx: 14, country: 'Honduras', giniIndex: 48.20, year: 2019 },
    { idx: 15, country: 'Burkina Faso', giniIndex: 47.30, year: 2018 },
    { idx: 16, country: 'Ecuador', giniIndex: 47.30, year: 2020 },
    { idx: 17, country: 'Mexico', giniIndex: 45.40, year: 2020 },
    { idx: 18, country: 'Chile', giniIndex: 44.90, year: 2020 },
    { idx: 19, country: 'Lesotho', giniIndex: 44.90, year: 2017 },
    { idx: 20, country: 'Peru', giniIndex: 43.80, year: 2020 },
    { idx: 21, country: 'Rwanda', giniIndex: 43.70, year: 2016 },
    { idx: 22, country: 'Bolivia', giniIndex: 43.60, year: 2020 },
    { idx: 23, country: 'Paraguay', giniIndex: 43.50, year: 2020 },
    { idx: 24, country: 'Ghana', giniIndex: 43.50, year: 2016 },
    { idx: 25, country: 'Uganda', giniIndex: 42.70, year: 2019 },
    { idx: 26, country: 'Togo', giniIndex: 42.40, year: 2018 },
    { idx: 27, country: 'Cabo Verde', giniIndex: 42.40, year: 2015 },
    { idx: 28, country: 'Philippines', giniIndex: 42.30, year: 2018 },
    { idx: 29, country: 'Argentina', giniIndex: 42.30, year: 2020 },
    // { idx: 30, country: 'Turkey', giniIndex: 41.90, year: 2019 },
    // { idx: 31, country: 'Djibouti', giniIndex: 41.60, year: 2017 },
    { idx: 32, country: 'United States', giniIndex: 41.50, year: 2019 },
  ];



// Extract Gini index values and country names
const giniValues = data0.map(d => d.giniIndex);
const countryNames = data0.map(d => d.country);


let data = giniValues;
let color = [];
for (let i = 0; i < data0.length; i++) {
  color.push(['red', 'blue', 'yellow', 'green'][i % 4]);
}

const barHeight = 15; // Adjust the height of the bars to make them thinner
const verticalSpacing = 10; // Adjust the vertical spacing between bars

const svg2 = d3.select('svg.bargraph1');

// Adding rectangles for bars
svg2.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr('rx', 10)
  .attr('height', barHeight)
  .attr('y', (d, i) => i * (barHeight + verticalSpacing))
  .attr('class', (d, i) => 'bar1 ' + color[i]) // Add 'bar1' class
  .attr('width', 10)
  .attr('data-gini', (d, i) => d) // Store Gini index as data attribute
  .on('mouseover', handleMouseOver)
  .transition().duration(1500)
  .attr('width', d => (d * 200) / 100);

// Adding text labels for countries
svg2.selectAll('text')
  .data(countryNames)
  .enter()
  .append('text')
  .attr('x', 15) // Adjust the horizontal position of the text
  .attr('y', (d, i) => i * (barHeight + verticalSpacing) + barHeight / 2)
  .attr('dy', '.35em') // Center the text vertically within the bar
  .attr('class', 'label')
  .text(d => d);

// Function to handle the intersection observer changes
function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // If the SVG is in view, trigger the animation to expand
      expandBars();
    } else {
      // If the SVG is out of view, trigger the animation to shrink
      shrinkBars();
    }
  });
}

// Create an intersection observer
const observer = new IntersectionObserver(handleIntersection);

// Target the SVG element
const svgElement = document.querySelector('svg.bargraph1');

// Observe the SVG element
observer.observe(svgElement);

// Your data and color arrays remain the same

// Function to expand bars
function expandBars() {
  d3.selectAll('rect')
    .transition().duration(1500)
    .attr('width', d => (d * 400) / 100);
}

// Function to shrink bars
// Function to shrink bars in bargraph1
function shrinkBars() {
  d3.selectAll('.bar1') // Select only the rectangles in the first bar graph
    .transition().duration(1500)
    .attr('width', 10);
}


// Function to handle mouseover event
function handleMouseOver(d, i) {
    // Display Gini index in a tooltip
    const giniIndex = d3.select(this).attr('data-gini');
    const tooltip = d3.select('#bargraph1-tooltip');
    const idx = data0.find(country => country.giniIndex === i).idx;
    console.log(idx, i)
    tooltip
      .html(`${countryNames[idx-1]}: ${giniIndex}`)
      .style('visibility', 'visible');
}


// Function to handle mouseout event
function handleMouseOut() {
  // Hide the tooltip on mouseout
  d3.select('#bargraph1-tooltip').style('visibility', 'hidden');
}

///BARGRAPH 2
const data2 = [
    { idx: 0, country: 'United States', giniIndex: 41.50, year: 2019 },
    { idx: 1, country: 'Slovak Republic', giniIndex: 23.20, year: 2019 },
    { idx: 2, country: 'Slovenia', giniIndex: 24.40, year: 2019 },
    { idx: 3, country: 'Belarus', giniIndex: 24.40, year: 2020 },
    { idx: 4, country: 'Armenia', giniIndex: 25.20, year: 2020 },
    { idx: 5, country: 'Czech Republic', giniIndex: 25.30, year: 2019 },
    { idx: 6, country: 'Ukraine', giniIndex: 25.60, year: 2020 },
    { idx: 7, country: 'United Arab Emirates', giniIndex: 26.00, year: 2018 },
    { idx: 8, country: 'Moldova', giniIndex: 26.00, year: 2019 },
    { idx: 9, country: 'Iceland', giniIndex: 26.10, year: 2017 },
    { idx: 10, country: 'Azerbaijan', giniIndex: 26.60, year: 2005 },
    { idx: 11, country: 'Belgium', giniIndex: 27.20, year: 2019 },
    { idx: 12, country: 'Algeria', giniIndex: 27.60, year: 2011 },
    { idx: 13, country: 'Denmark', giniIndex: 27.70, year: 2019 },
    { idx: 14, country: 'Finland', giniIndex: 27.70, year: 2019 },
    { idx: 15, country: 'Norway', giniIndex: 27.70, year: 2019 },
    { idx: 16, country: 'Kiribati', giniIndex: 27.80, year: 2019 },
    { idx: 17, country: 'Kazakhstan', giniIndex: 27.80, year: 2018 },
    { idx: 18, country: 'Timor-Leste', giniIndex: 28.70, year: 2014 },
    { idx: 19, country: 'Croatia', giniIndex: 28.90, year: 2019 },
    { idx: 20, country: 'Kyrgyz Republic', giniIndex: 29.00, year: 2020 },
    { idx: 21, country: 'Netherlands', giniIndex: 29.20, year: 2019 },
    { idx: 22, country: 'Sweden', giniIndex: 29.30, year: 2019 },
    { idx: 23, country: 'Iraq', giniIndex: 29.50, year: 2012 },
    { idx: 24, country: 'Pakistan', giniIndex: 29.60, year: 2018 },
    { idx: 25, country: 'Guinea', giniIndex: 29.60, year: 2018 },
    { idx: 26, country: 'Hungary', giniIndex: 30.00, year: 2019 },
    { idx: 27, country: 'Austria', giniIndex: 30.20, year: 2019 },
    { idx: 28, country: 'Poland', giniIndex: 30.20, year: 2018 },
    { idx: 29, country: 'Ireland', giniIndex: 30.60, year: 2018 },
    // { idx: 30, country: 'Myanmar', giniIndex: 30.70, year: 2017 },
    // { idx: 31, country: 'Fiji', giniIndex: 30.70, year: 2019 },
    // { idx: 32, country: 'Albania', giniIndex: 30.80, year: 2019 },
    // { idx: 33, country: 'Estonia', giniIndex: 30.80, year: 2019 },
    // { idx: 34, country: 'Malta', giniIndex: 31.00, year: 2019 },
    // { idx: 35, country: 'Cyprus', giniIndex: 31.20, year: 2019 },
    // { idx: 36, country: 'Korea', giniIndex: 31.40, year: 2016 },
    // { idx: 37, country: 'Egypt', giniIndex: 31.50, year: 2017 },
    // { idx: 38, country: 'Germany', giniIndex: 31.70, year: 2018 },
    // { idx: 39, country: 'Lebanon', giniIndex: 31.80, year: 2011 },
    // { idx: 40, country: 'Seychelles', giniIndex: 32.10, year: 2018 },
    // { idx: 41, country: 'Vanuatu', giniIndex: 32.30, year: 2019 },
    // { idx: 42, country: 'Bangladesh', giniIndex: 32.40, year: 2016 },
    // { idx: 43, country: 'France', giniIndex: 32.40, year: 2018 },
    // { idx: 44, country: 'Mauritania', giniIndex: 32.60, year: 2014 },
    // { idx: 45, country: 'Mongolia', giniIndex: 32.70, year: 2018 },
    // { idx: 46, country: 'Nepal', giniIndex: 32.80, year: 2010 },
    // { idx: 47, country: 'Portugal', giniIndex: 32.80, year: 2019 },
    // { idx: 48, country: 'Tunisia', giniIndex: 32.80, year: 2015 },
    // { idx: 49, country: 'Japan', giniIndex: 32.90, year: 2013 },
    // { idx: 50, country: 'North Macedonia', giniIndex: 33.00, year: 2018 },
    // { idx: 51, country: 'Bosnia and Herzegovina', giniIndex: 33.00, year: 2011 },
    // { idx: 52, country: 'Greece', giniIndex: 33.10, year: 2019 },
    // { idx: 53, country: 'Switzerland', giniIndex: 33.10, year: 2018 },
    // { idx: 54, country: 'Canada', giniIndex: 33.30, year: 2017 }
];


// Extract Gini index values and country names
const giniValues2 = data2.map(d => d.giniIndex);
const countryNames2 = data2.map(d => d.country);

let color2 = [];
for (let i = 0; i < data2.length; i++) {
    color2.push(['red', 'blue', 'yellow', 'green'][i % 4]);
}

const barHeight2 = 15; // Adjust the height of the bars to make them thinner
const verticalSpacing2 = 10; // Adjust the vertical spacing between bars

// Create a new SVG container for the second bar graph
const svg3 = d3.select('svg.bargraph2');

// Define the width of the bars in the second bar graph
const barWidth2 = 40; // Adjust the width of the bars


// BARGRAPH 2
// ... (previous code remains unchanged)

// Adding rectangles for bars
svg3.selectAll('rect')
  .data(giniValues2)
  .enter()
  .append('rect')
  .attr('rx', 10)
  .attr('height', barHeight2)
  .attr('y', (d, i) => i * (barHeight2 + verticalSpacing2))
  .attr('class', (d, i) => 'bar2 ' + color2[i]) // Add 'bar2' class
  .attr('width', d => (d * 700) / 100); // Set the initial width without transition

// Adding text labels for countries
svg3.selectAll('text')
    .data(countryNames2)
    .enter()
    .append('text')
    .attr('x', 15) // Adjust the horizontal position of the text
    .attr('y', (d, i) => i * (barHeight2 + verticalSpacing2) + barHeight2 / 2)
    .attr('dy', '.35em') // Center the text vertically within the bar
    .attr('class', 'label')
    .text(d => d);

// Function to shrink bars in bargraph2
function shrinkBars2() {
  svg3.selectAll('.bar2') // Select only the rectangles in the second bar graph
    .transition().duration(1500)
    .attr('width', d => (d * 700) / 100);
}

// Create an intersection observer for the second SVG element
const svgElement2 = document.querySelector('svg.bargraph2');
const observer2 = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // If the second SVG is in view, trigger the animation to expand
      expandBars2();
    } else {
      // If the second SVG is out of view, trigger the animation to shrink
      shrinkBars2();
    }
  });
});

// Observe the second SVG element
observer2.observe(svgElement2);

// Function to expand bars in bargraph2
function expandBars2() {
  svg3.selectAll('.bar2') // Select only the rectangles in the second bar graph
    .transition().duration(1500)
    .attr('width', d => (d * 700) / 100);
}


//-------------------------------------------------------------------------------
// Wage Gap
// Set dimensions and margins for the chart
const margin_wage = { top: 6, right: 10, bottom: 20, left: 40 };
const width_wage = 600 - margin_wage.left - margin_wage.right;
const height_wage = 320 - margin_wage.top - margin_wage.bottom;

// Set up the x and y scales
const x_wage = d3.scaleLinear()
  .range([0, width_wage]);

const y_wage = d3.scaleLinear()
  .range([height_wage, 0]);

// Define the x and y domains
x_wage.domain([1965, 2020]);
y_wage.domain([20000, 50000]);

    const male_dataset_wage = [
        { date: 1965, value: 29791 },
        { date: 1970, value: 20567 },
        { date: 1975, value: 36207 },
        { date: 1980, value: 37033 },
        { date: 1985, value: 37131 },
        { date: 1990, value: 35538 },
        { date: 1995, value: 35365 },
        { date: 2000, value: 37339 },
        { date: 2005, value: 41386 },
        { date: 2010, value: 47715 },
        { date: 2015, value: 51212 },
        { date: 2020, value: 57456 }
    ];
    const female_dataset_wage = [
        { date: 1965, value: 17852 },
        { date: 1970, value: 34642},
        { date: 1975, value: 21297},
        { date: 1980, value: 22279 },
        { date: 1985, value: 23978 },
        { date: 1990, value: 25451 },
        { date: 1995, value: 25260 },
        { date: 2000, value: 27355 },
        { date: 2005, value: 31858 },
        { date: 2010, value: 36931 },
        { date: 2015, value: 40742 },
        { date: 2020, value: 47299 }
      ];
    

const sgv_wage = d3.select("#wage-container")
  .append("svg")
    .attr("width", width_wage + margin_wage.left + margin_wage.right)
    .attr("height", height_wage + margin_wage.top + margin_wage.bottom)
  .append("g")
    .attr("transform", `translate(${margin_wage.left},${margin_wage.top})`);

// Add the x-axis
sgv_wage.append("g")
    .attr("class", "x-axis")
    .style("font-size", "14px")
    .attr("transform", `translate(0,${height_wage})`)
    .call(d3.axisBottom(x_wage)
    .tickFormat(d3.format('d')))
    .selectAll(".tick line")
    .style("stroke-opacity", 1)

// Add the y-axis
sgv_wage.append("g")
    .attr("class", "x-axis")
    .style("font-size", "14px")
    .call(d3.axisLeft(y_wage))
    .selectAll(".tick line")
    .style("stroke-opacity", 1)

// Create the line generator
const line_wage = d3.line()
    .x(d => x_wage(d.date))
    .y(d => y_wage(d.value));

// Add the line path to the SVG element
sgv_wage.append("path")
    .datum(male_dataset_wage)
    .attr("class", "line_m")
    .attr("fill", "lightblue")
    .attr("fill-opacity", 0.5).attr("fill-opacity", 0.5)
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line_wage);

sgv_wage.append("path")
    .datum(female_dataset_wage)
    .attr("class", "line_f")
    .attr("fill", "#F4C2C2")
    .attr("fill-opacity", 0.5)
    .attr("stroke", "#fe019a")
    .attr("stroke-width", 2)
    .attr("d", line_wage);

// Define the slider
const sliderRange = d3
    .sliderBottom()
    .min(1965)
    .max(2020)
    .width(300)
    .tickFormat(d3.format('d'))
    .ticks(6)
    .default([1965, 2020])
    .fill('#9370db');


sliderRange.on('onchange', val => {
   x_wage.domain(val);
  // Filter data based on slider values
  const filteredData_wage_f = female_dataset_wage.filter(d => d.date >= val[0] && d.date <= val[1]);
  const filteredData_wage_m = male_dataset_wage.filter(d => d.date >= val[0] && d.date <= val[1]);
  
 // Update the line and area to new domain
  sgv_wage.select(".line_f").attr("d", line_wage(filteredData_wage_f));
  sgv_wage.select(".line_m").attr("d", line_wage(filteredData_wage_m));

 // Update the x-axis with new domain
 sgv_wage.select(".x-axis")
    .transition()
    .duration(300) // transition duration in ms
    .call(d3.axisBottom(x_wage)
    .tickFormat(d3.format('d')))

});

/// Add the slider to the DOM
const gRange = d3
  .select('#slider-range')
  .append('svg')
  .attr('width', 500)
  .attr('height', 75)
  .append('g')
  .attr('transform', 'translate(90,30)');

gRange.call(sliderRange);
    
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

const dataset_wage_race = [
    {source:"White Men", x: 100, y: 60, val: 10000, color: "#C9D6DF"},
    {source:"Black Men", x: 30, y: 80, val: 9000, color: "#F7EECF"},
    {source:"Asian Men", x: 50, y: 40, val: 9000, color: "#E3E1B2"},
    {source:"Hispanic Men", x: 190, y: 100, val: 9000, color: "#F9CAC8"},
    {source:"White Women", x: 80, y: 170, val: 8300, color: "#C9D6DF"},
    {source:"Black Women", x: 60, y: 80, val: 7000, color: "#F7EECF"},
    {source:"Asian Women", x: 80, y: 40, val: 9300, color: "#E3E1B2"},
    {source:"Hispanic Women", x: 190, y: 100, val: 6500, color: "#F9CAC8"},
];

// Step 4
sgv_wage_race.selectAll("circle")
    .data(dataset_wage_race).enter()
    .append("circle")
    .attr("cx", function(d) {return d.x})
    .attr("cy", function(d) {return d.y})
    .attr("r", function(d) {
    return Math.sqrt(d.val)/Math.PI 
    })
    .attr("fill", function(d) {
    return d.color;
    });

    sgv_wage_race.selectAll("text")
    .data(dataset_wage_race).enter()
    .append("text")
    .attr("x", function(d) {return d.x+(Math.sqrt(d.val)/Math.PI)})
    .attr("y", function(d) {return d.y+4})
    .text(function(d) {return d.source})
    .style("font-family", "arial")
    .style("font-size", "12px")
    
    // // Define the x and y domains
    // x_wage_race.domain([1960, 2022]);
    // y_wage_race.domain([0, 100]);
    
    // // Add the x-axis
    
    // sgv_wage_race.append("g")
    //   .attr("transform", `translate(0,${height_wage_race})`)
    //   .call(d3.axisBottom(x_wage_race))
    //     // .ticks(d3.timeMonth.every(1)) 
    //     // .tickFormat(d3.timeFormat(" %Y"))); 
    
    
    // // Add the y-axis
    
    // sgv_wage_race.append("g")
    //   .call(d3.axisLeft(y_wage_race))
    
    // // Create the line generator
    
    // const line_wage_race = d3.line()
    //   .x(d => x_wage_race(d.date))
    //   .y(d => y_wage_race(d.value));
    
    // // Add the line path to the SVG element
    
    // sgv_wage_race.append("path")
    //   .datum(male_dataset_wage_race)
    //   .attr("fill", "lightblue")
    //   .attr("fill-opacity", 0.5).attr("fill-opacity", 0.5)
    //   .attr("stroke", "steelblue")
    //   .attr("stroke-width", 2)
    //   .attr("d", line_wage_race);

    //   sgv_wage_race.append("path")
    //   .datum(female_dataset_wage_race)
    //   .attr("fill", "#F4C2C2")
    //   .attr("fill-opacity", 0.5)
    //   .attr("stroke", "#fe019a")
    //   .attr("stroke-width", 2)
    //   .attr("d", line_wage_race);
    
