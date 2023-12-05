const margin = {top: 10, right: 20, bottom: 30, left: 50};


// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("most_recent_gini.csv").then( function(data) {

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 90000])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 90])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  const z = d3.scaleSqrt() // Use scaleSqrt for a square root scale for area
  .domain([200000, 1310000000])
  .range([4, 40]);

  // Add a scale for bubble color
  const myColor = d3.scaleOrdinal()
    .domain(["East Asia and the Pacific", "Europe and Central Asia", "South Asia", "Sub-Saharan Africa", "Middle East and North Africa", "Latin America and the Caribbean","North America"])
    .range(d3.schemeSet2);

// X axis label
svg.append("text")
  .attr("class", "axis-title")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height + margin.top + 20)
  .text("GDP");

// Y axis label
svg.append("text")
  .attr("class", "axis-title")
  .attr("text-anchor", "end")
  .attr("transform", "rotate(-90)")
  .attr("y", -margin.left + 20)
  .attr("x", -margin.top)
  .text("GINI Index (Standardized)");

        // Create a legend
const legend = svg.append("g")
.attr("class", "legend")
.attr("transform", `translate(${width - 9*margin.right}, ${margin.top})`);

// Add legend items
const legendItems = legend.selectAll(".legend-item")
  .data(["East Asia and the Pacific", "Europe and Central Asia", "South Asia", "Sub-Saharan Africa", "Middle East and North Africa", "Latin America and the Caribbean", "North America"])
  .enter().append("g")
  .attr("class", "legend-item")
  .attr("transform", (d, i) => `translate(0, ${i * 20})`);

// Add colored squares to represent regions in the legend
legendItems.append("rect")
  .attr("width", 15)
  .attr("height", 15)
  .style("fill", d => {
    const color = myColor(d);
    if (color) {
      return color;
    } else {
      console.error(`No color found for legend item: ${d}`);
      return "gray"; // or any fallback color
    }
  });

// Add text labels to the legend items
legendItems.append("text")
  .attr("x", 20)
  .attr("y", 10)
  .text(d => d)
  .style("font-size", "12px")
  .style("fill", "black");

  // -1- Create a tooltip div that is hidden by default:
  const tooltip = d3.select("#my_dataviz")
  .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")

 // -2- Create 3 functions to show / update (when mouse move but stay on the same circle) / hide the tooltip
 const showTooltip = function(event, d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Country: " + d.country)
      .style("left", (event.x)/2 + "px")
      .style("top", (event.y)/2+30 + "px")
    labels.filter(label => label === d)
      .style("opacity", 1);
  }
  const moveTooltip = function(event, d) {
    tooltip
      .style("left", (event.x)/2 + "px")
      .style("top", (event.y)/2+30 + "px")
  }
  const hideTooltip = function(event, d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
    labels.filter(label => label === d)
      .style("opacity", 0);
  }
  
  

  // Add dots
const dots = svg.append('g')
.selectAll("dot")
.data(data)
.join("circle")
  .attr("class", "bubbles")
  .attr("cx", d => x(d.gdp))
  .attr("cy", d => y(d.gini_std))
  .attr("r", d => z(d.population))
  .style("fill", d => myColor(d.region_wb))
  .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip );

    const labels = svg.append('g')
  .selectAll("label")
  .data(data)
  .join("text")
    .attr("class", "country-label")
    .style("font-size", "20px")
    .style("font-family", "Georgia")
    .text(d => d.country)
    .style("opacity", 0)
    .attr("text-anchor", "start") // Align text to the end (right)
    .attr("transform", "translate(10, 10)");
  })

  