//-------------------------------------------------------------------------------
// Wage Gap
// Set dimensions and margins for the chart
const margin_wage = { top: 05, right: 40, bottom: 20, left: 55 };
const width_wage = 600 - margin_wage.left - margin_wage.right;
const height_wage = 280 - margin_wage.top - margin_wage.bottom;

// Set up the x and y scales
const x_wage = d3.scaleLinear()
  .range([0, width_wage]);

const y_wage = d3.scaleLinear()
  .range([height_wage, 0]);

// Define the x and y domains
x_wage.domain([1965, 2020]);
y_wage.domain([15000, 50000]);

    const male_dataset_wage = [
        { date: 1965, value: 29791 },
        { date: 1970, value: 34642 },
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
        { date: 1970, value: 20567},
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
    .attr("fill-opacity", 0)
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line_wage);

sgv_wage.append("path")
    .datum(female_dataset_wage)
    .attr("class", "line_f")
    .attr("fill", "#F4C2C2")
    .attr("fill-opacity", 0)
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
const width_wage_race = 800 - margin_wage_race.left - margin_wage_race.right;
const height_wage_race = 350 - margin_wage_race.top - margin_wage_race.bottom;

const dataset_wage_race = [
    {source:"White Men", x: Math.random() * width_wage_race - 25, y:  Math.random() * height_wage_race, val: (100-40), color: "#C9D6DF"},
    {source:"Black Men", x: Math.random() * width_wage_race - 25, y:  Math.random() * height_wage_race, val: (74-40), color: "#FF7779"},
    {source:"Asian Men", x: Math.random() * width_wage_race - 25, y:  Math.random() * height_wage_race, val: (120-40), color: "#329932"},
    {source:"Hispanic Men", x: Math.random() * width_wage_race - 25, y:  Math.random() * height_wage_race, val:( 63-40), color: "#963939"},
    {source:"White Women", x: Math.random() * width_wage_race - 25, y:  Math.random() * height_wage_race, val: (80-40), color: "#89cff0"},
    {source:"Black Women", x: Math.random() * width_wage_race - 25, y:  Math.random() * height_wage_race, val: (67-40), color: "#F7EECF"},
    {source:"Asian Women", x: Math.random() * width_wage_race - 25, y:  Math.random() * height_wage_race, val: (92-40), color: "#99cc99"},
    {source:"Hispanic Women", x: Math.random() * width_wage_race - 25, y:  Math.random() * height_wage_race, val: (57-40), color: "#F4C2C2"},
  ];

  // Set up the SVG container
const sgv_wage_race = d3.select("#race-gap-container")
    .append("svg")
    .attr("width", width_wage_race + margin_wage_race.left + margin_wage_race.right)
    .attr("height", height_wage_race + margin_wage_race.top + margin_wage_race.bottom)
    .append("g")
    .attr("transform", `translate(${margin_wage_race.left},${margin_wage_race.top})`);

  // Create circles for each data point
  const circles = sgv_wage_race.selectAll('circle')
    .data(dataset_wage_race)
    .enter().append('circle')
    .attr('cx', d => d.x) // Random X position for demonstration
    .attr('cy',  d => d.y)
    .attr('r', d => d.val)
    .attr('fill', d => d.color)

    .on('mouseover', handleMouseOver)
    .on('mouseout', handleMouseOut);

  // Add labels
  const labels = sgv_wage_race.selectAll('text')
    .data(dataset_wage_race).enter().append('text')
    .attr('id', 'label')
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .text(d => d.source+": "+d.val)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('font-size', '12px')
    .attr('fill', 'black');
    // .attr("fill-opacity", 0)

     // Add labels
  const value = sgv_wage_race.selectAll('text')
    .data(dataset_wage_race).enter().append('text')
    .attr('id', 'label')
    .attr("x", d => d.x)
    .attr("y", d => d.y -25)
    .text(d => d.val)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('font-size', '12px')
    .attr('fill', 'black');

    function handleMouseOver(d, i) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('cx', d.x - 1.2); // Increase size on hover
      }
    

