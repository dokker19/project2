document.addEventListener("DOMContentLoaded", function() {
    // Code for manipulating the first SVG element (svg1)
    var svg = document.getElementById("line");
    // Your SVG manipulation code here
    //------------------------1. PREPARATION------------------------//
//-----------------------------SVG------------------------------//
const width = window.innerWidth * 0.8;  // Adjust the width based on the window size
const height = window.innerHeight * 0.8;  // Adjust the height based on the window size
const margin = { top: 50, right: 50, bottom: 50, left: 80 };  // Adjust margins for better spacing
const padding = 30;  // Adjust padding for better spacing
const adj = 30;

// Append SVG to the body or a specific container
svg = d3.select("body").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-" + adj + " -" + adj + " " + (width + margin.left + margin.right + adj * 3) + " " + (height + margin.top + margin.bottom + adj * 3))
    .style("padding", padding)
    .style("margin", margin)
    .classed("svg-content", true);

//-----------------------------DATA-----------------------------//
const timeConv = d3.timeParse("%Y");
const dataset = d3.csv("household_income.csv");
dataset.then(function(data) {
    var slices = data.columns.slice(1).map(function(id) {
        return {
            id: id,
            values: data.map(function(d){
                return {
                    date: timeConv(d.date),
                    measurement: +d[id]
                };
            })
        };
    });

//----------------------------SCALES----------------------------//
const xScale = d3.scaleTime().range([0,width]);
const yScale = d3.scaleLinear().rangeRound([height, 0]);
xScale.domain(d3.extent(data, function(d){
    return timeConv(d.date)}));

yScale.domain([(0), d3.max(slices, function(c) {
    return d3.max(c.values, function(d) {
        return d.measurement + 4; });
        })
    ]);
//-----------------------------AXES-----------------------------//
const yaxis = d3.axisLeft()
    .ticks((slices[0].values).length)
    .scale(yScale);

const xaxis = d3.axisBottom()
    .ticks(d3.timeYear.every(1)) // Adjust the tick frequency to show only years
    .tickFormat(d3.timeFormat('%Y')) // Format ticks to display only the year
    .scale(xScale);

//----------------------------LINES-----------------------------//
const line = d3.line()
    .curve(d3.curveLinear)
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.measurement); });

//-------------------------2. DRAWING---------------------------//
//-----------------------------AXES-----------------------------//
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

svg.append("g")
    .attr("class", "axis")
    .call(yaxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("dy", ".75em")
    .attr("y", 6)
    .style("text-anchor", "end")
    .text("Household Income (USD)");

//----------------------------LINES-----------------------------//
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
const lines = svg.selectAll("lines")
    .data(slices)
    .enter()
    .append("g");

    lines.append("path")
    .attr("class", "line")
    .attr("d", function(d) { return line(d.values); })
    .style("stroke", function(d, i) {
        return colorScale(i);
    })
    .attr("data-color", function(d, i) {
        return colorScale(i);
    });

    lines.append("text")
    .attr("class","serie_label")
    .datum(function(d) {
        return {
            id: d.id,
            value: d.values[d.values.length - 1]}; })
    .attr("transform", function(d) {
            return "translate(" + (xScale(d.value.date) + 960)  
            + "," + (yScale(d.value.measurement) + 5 )+ ")"; })
    .attr("x", 5)
    .text(function(d) { return ""; });


const ghost_lines = lines.append("path")
    .attr("class", "ghost-line")
    .attr("d", function(d) { return line(d.values); });    

const verticalLine = svg.append("line").attr("class", "vertical-line").style("stroke", "#ddd").style("stroke-dasharray", "5,5").attr("x1", 0).attr("x2", 0).attr("y1", 0).attr("y2", height);

    // Add text elements to display values
const valuesText = svg.append("g").attr("class", "values-text");
//---------------------------EVENTS-----------------------------//
svg.on("mousemove", function (event) {
    const mouseX = d3.pointer(event)[0];
    const invertedX = xScale.invert(mouseX);

    // Move the vertical line to the mouse position
    verticalLine.attr("x1", mouseX).attr("x2", mouseX);

    // Display values at the mouse position
    valuesText.selectAll("*").remove(); // Clear previous values

    slices.forEach(function (slice, i) {
        const index = 2022 - d3.timeFormat('%Y')(invertedX);

        if (index > 0 && index <= 2022) {
            const d0 = slice.values[index - 1];
            const d1 = slice.values[index];
            const d = invertedX - d0.date > d1.date - invertedX ? d1 : d0;

            valuesText
                .append("text")
                .attr("x", mouseX + 10)
                .attr("y", yScale(d.measurement))
                .text(slice.id + ": $" + d.measurement)
                .style("fill", colorScale(i))
                .style("font-family", "Georgia");
        }
    });

    // Update the vertical line with dates
    verticalLineDates.attr("transform", "translate(" + mouseX + ",0)")
        .select("text")
        .text(d3.timeFormat('%Y')(invertedX))
        .style("font-family", "Georgia");
});

// Create the vertical line with dates
const verticalLineDates = svg.append("g").attr("class", "vertical-line-dates");

verticalLineDates.append("line")
    .style("stroke", "#dd0000")
    .style("stroke-dasharray", "5,5")
    .attr("y1", 0)
    .attr("y2", height);

verticalLineDates.append("text")
    .attr("y", -10)
    .attr("dy", ".71em")
    .style("text-anchor", "middle")
    .style("font-family", "Georgia");



svg.selectAll(".ghost-line")
    .on('mouseover', function(d, i) {
        const selection = d3.select(this).raise();

        const lineColor = selection.attr("data-color");
        console.log("Line color:", lineColor);

        selection
            .transition()
            .delay("100").duration("10")
            .style("stroke", colorScale(i))
            .style("opacity", "1")
            .style("stroke-width", "3");

        // add the legend action
        const legend = d3.select(this.parentNode)
            .select(".serie_label");

        legend
            .transition()
            .delay("100")
            .duration("10")
            .style("fill", "#000000");
    })
    .on('mouseout', function(d, i) {
        const selection = d3.select(this);

        selection
            .transition()
            .delay("100")
            .duration("10")
            .style("stroke", "#000000")
            .style("opacity", "0")
            .style("stroke-width", "1");

        // add the legend action
        const legend = d3.select(this.parentNode)
            .select(".serie_label");

        legend
            .transition()
            .delay("100")
            .duration("10")
            .style("fill", "#000000");
    });

});
});

