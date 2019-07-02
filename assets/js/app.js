var svgWidth = 800;
var svgHeight = 400;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

//xScaler
function xScale(stateData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
        d3.max(stateData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

  };
//yScaler
function yScale(stateData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.max(stateData, d => d[chosenYAxis]) * 1.2,
        d3.min(stateData, d => d[chosenYAxis]) * 0.8
      ])
      .range([0, height]);
  
    return yLinearScale;
  
  };

function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
    return yAxis;
  };
  
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    return xAxis;
  };

function renderXChange(chosenXAxis, circleGroup, abbrGroup, newXScale) {
    circleGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
    abbrGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));
    };
function renderYChange(chosenYAxis, circleGroup, abbrGroup, newYScale) {
      circleGroup.transition()
        .duration(1000)
        .attr("cy", d => newYScale(d[chosenYAxis]));
      abbrGroup.transition()
        .duration(1000)
        .attr("y", d => newYScale(d[chosenYAxis])+3);
      };

function updateToolTip(chosenXAxis, chosenYAxis, circleGroup, abbrGroup) {
        if (chosenXAxis === "age") {
          var xlabel = "Age (Median):";
        }
        if (chosenXAxis === "poverty") {
          var xlabel = "Poverty Rate (%):";
        }
        if (chosenXAxis === "income") {
          var xlabel = "Household Income (Median):";
        }
        if (chosenYAxis === "obesity") {
          var ylabel = "Obesity (%):";
        }
        if (chosenYAxis === "smokes") {
          var ylabel = "Tobacco Use (%):";
        }
        if (chosenYAxis === "healthcare") {
          var ylabel = "Lacks Healthcare (%):";
        }
      
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .html(function(d) {
            return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
          });
      
        circleGroup.call(toolTip);
        abbrGroup.call(toolTip);
        
        circleGroup.on("mouseover", function(data) {
          toolTip.show(data, this);
        })
          // onmouseout event
          .on("mouseout", function(data) {
            toolTip.hide(data);
          });
        
        abbrGroup.on("mouseover", function(data) {
          toolTip.show(data, this);
        })
          // onmouseout event
          .on("mouseout", function(data) {
            toolTip.hide(data);
          });
      }

d3.csv("/assets/data/data.csv") 
    .then(function(stateData) {
    // parse data
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
    });

    var xLinearScale = xScale(stateData, chosenXAxis);
    var yLinearScale = yScale(stateData, chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(0, ${height}*-1)`)
        .call(leftAxis);

    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", `translate( -40 , ${height / 2})`);

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .attr("id", "x-active")
        .text("Poverty Rate (%)");
    
    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .attr("id", "x-inactive")
        .text("Age (Median)");
    
    var incomeLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .attr("id", "x-inactive")
        .text("Household Income (Median)");
    
    var obesityLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0)
        .attr("value", "obesity")
        .attr("id", "y-active")
        .text("Obesity (%)");
    
    var smokesLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -20)
        .attr("x", 0)
        .attr("value", "smokes")
        .attr("id", "y-inactive")
        .text("Tobacco Use (%)");
    
    var healthcareLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", 0)
        .attr("value", "healthcare")
        .attr("id", "y-inactive")
        .text("Lacks Healthcare (%)");

    var circleGroup = chartGroup.append("g")
        .selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("fill", "lightblue");

    var abbrGroup = chartGroup.append("g")
        .selectAll("text")
        .data(stateData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "white")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis])+3);
    
    updateToolTip(chosenXAxis, chosenYAxis, circleGroup, abbrGroup);

    xlabelsGroup.selectAll("text")
        .on("click", function() {
          var value = d3.select(this).attr("value");
          chosenXAxis = value;
          var chosenYAxis = d3.select("#y-active").attr("value")
          xLinearScale = xScale(stateData, chosenXAxis);
          xAxis = renderXAxes(xLinearScale, xAxis);
          renderXChange(chosenXAxis, circleGroup, abbrGroup, xLinearScale);
          updateToolTip(chosenXAxis, chosenYAxis, circleGroup, abbrGroup)

          if (chosenXAxis === "poverty") {
            povertyLabel
              .attr("id", "x-active");
            ageLabel
              .attr("id", "x-inactive");
            incomeLabel
              .attr("id", "x-inactive");
          }
          if (chosenXAxis === "age") {
            povertyLabel
              .attr("id", "x-inactive");
            ageLabel
              .attr("id", "x-active");
            incomeLabel
              .attr("id", "x-inactive");
          }
          if (chosenXAxis === "income"){
            povertyLabel
              .attr("id", "x-inactive");
            ageLabel
              .attr("id", "x-inactive");
            incomeLabel
              .attr("id", "x-active");
          }
        });

    ylabelsGroup.selectAll("text")
        .on("click", function() {
          var value = d3.select(this).attr("value");
          chosenYAxis = value;
          var chosenXAxis = d3.select("#x-active").attr("value");
          yLinearScale = yScale(stateData, chosenYAxis);
          yAxis = renderYAxes(yLinearScale, yAxis);
          renderYChange(chosenYAxis, circleGroup, abbrGroup, yLinearScale);          
          updateToolTip(chosenXAxis, chosenYAxis, circleGroup, abbrGroup);

          if (chosenYAxis === "obesity") {
            obesityLabel
              .attr("id", "y-active");
            smokesLabel
              .attr("id", "y-inactive");
            healthcareLabel
              .attr("id", "y-inactive");
          }
          if (chosenYAxis === "smokes") {
            obesityLabel
              .attr("id", "y-inactive");
            smokesLabel
              .attr("id", "y-active");
            healthcareLabel
              .attr("id", "y-inactive");
          }
          if (chosenYAxis === "healthcare"){
            obesityLabel
              .attr("id", "y-inactive");
            smokesLabel
              .attr("id", "y-inactive");
            healthcareLabel
              .attr("id", "y-active");
          }
        });
})
  .catch(function(error) {
    console.log(error);
  });
