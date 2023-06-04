// Load the CSV file
d3.csv("movies.csv").then(function(data) {
  // Convert string values to numbers
  data.forEach(function(d) {
    d.estimatedRate = +d.estimatedRate;
    d.realRate = +d.realRate;
  });

  // Set up dimensions and margins
  var margin = { top: 20, right: 20, bottom: 30, left: 40 };
  var width = 1000 - margin.left - margin.right;
  var height = 800 - margin.top - margin.bottom;

  // Create the SVG element
  var svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Set up scales for x and y axes
  var xScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.realRate; })])
    .range([0, width]);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.estimatedRate; })])
    .range([height, 0]);

  // Create x and y axes
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Append axes to the SVG
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  // Create circles for each movie
  var circles = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return xScale(d.realRate); })
    .attr("cy", function(d) { return yScale(d.estimatedRate); })
    .attr("r", 3)
    .attr("fill", "steelblue");

  // Add movie name as a data attribute to the circles
  circles.attr("data-movie", function(d) { return d.movieName; });

  // Create text labels for movie names
  var labels = svg.selectAll(".movie-label")
    .data(data)
    .enter()
    .append("text")
    .attr("x", function(d) { return xScale(d.realRate) + 8; })
    .attr("y", function(d) { return yScale(d.estimatedRate) - 8; })
    .text(function(d) { return d.movieName; })
    .attr("class", "movie-label")
    .style("display", "none"); // Hide movie labels initially

  // Add event listeners to show/hide labels on mouseover/mouseout
  circles.on("mouseover", function(d) {
    var movieName = d3.select(this).attr("data-movie");
    d3.select(this).attr("r", 8); // Increase circle size on mouseover
    labels.style("display", function(e) {
      return e.movieName === movieName ? "block" : "none";
    }); // Show movie label of the corresponding circle
  })
  .on("mouseout", function() {
    d3.select(this).attr("r", 3); // Reset circle size on mouseout
    labels.style("display", "none"); // Hide all movie labels
  });
});
