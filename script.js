// Read the CSV file
d3.csv("movies.csv").then(function(data) {
    //console.log(data)
    // Append an SVG container to the body of the HTML page
    var svg = d3.select("body").append("svg")
      .attr("width", 1200)
      .attr("height", 1400)
      .attr("id", "canvas");
      
  
    // Define the scales for the circle sizes and colors
    var rateScale = d3.scaleLinear()
      .domain([0, 10])  // Assuming movie rates range from 0 to 10
      .range([0, 10]);  // Adjust the range as needed for circle sizes

    // Define the scales for the circle opacity
    var opacityScale = d3.scaleLinear()
      .domain([0, 10])  // Assuming movie rates range from 0 to 10
      .range([0, 1]);  // Adjust the range as needed for circle sizes
    
    var customColors = ["#E05F5F", "#2A74EA", "#A978EF", "#F792C8", "#9898EA", "#53C2F2", "#EDDFC8", "#E0351E", "#F4770F", "#CEED4F","#C2EFE3","#3683B2","#AD8989","#EFDC56","#3AB5A6","#CF7FE2","#28A8B2","#FFA81D","#F7C87C","#69699E"];

    var colorScale = d3.scaleOrdinal()
      .domain(["Action", "Drama", "Comedy", "Romance", "Horror", "Sci-Fi", "Adventure","War","Crime","Fantasy","Documentary","Thriller","Short","Mystery","Music","Animation","Biography","Family","History"])
      .range(customColors);  // Include all 19 genres here
  
    // Iterate over the movie data to draw circles
data.forEach(function(movie, index) {
    var cx = (index % 20) * 50 + 40;  // Adjust the spacing between circles
  var cy = Math.floor(index / 20) * 50 + 250;  // Adjust the spacing between circles
  
    // Draw the main grey circle representing the movie
    var movieCircle = svg.append("circle")
    .attr("cx", cx)
    .attr("cy", cy)
    .attr("r", rateScale(+movie.movie_rate))
    .attr("stroke-opacity",opacityScale(+movie.movie_rate))
    .attr("stroke","black")
    .attr("fill-opacity","0")
    .attr("fill","white");
    
    
  
    // Get the genres array for the movie
    var genres = Object.values(movie).slice(2); // Slice from the 3rd property onwards
  
    // Calculate the angle for each genre circle
    var angleStep = 360 / genres.length;
  
    // Create a group for each movie
    var movieGroup = svg.append("g");
  
    // Draw small circles for each non-empty genre surrounding the main circle
    var genreCircles = movieGroup.selectAll(".genre-circle")
      .data(genres)
      .enter()
      .filter(function(d) {
        return d.trim() !== ""; // Filter out empty genres
      })
      .append("circle")
      .attr("class", "genre-circle")
      .attr("r", 4)
      .attr("fill", function(d) {
        return colorScale(d);
      });
  
    genreCircles.attr("cx", function(_, i) {
        var angle = (angleStep * i - 90) * Math.PI / 180;
        return cx + Math.cos(angle) * (rateScale(+movie.movie_rate) + 5);
      })
      .attr("cy", function(_, i) {
        var angle = (angleStep * i - 90) * Math.PI / 180;
        return cy + Math.sin(angle) * (rateScale(+movie.movie_rate) + 5);
      });

     // Create a popbox for displaying movie names
        var popbox = d3.select("body").append("div")
        .attr("class", "popbox")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("background-color", "rgba(0, 0, 0, 0.3)") // Set the background color with transparency
        .style("padding", "5px") // Adjust the padding as desired
        .style("color", "#fff") // Set the text color
        .style("font-size","9pt")
        .style("font-family","Poppins");

    // Show movie name popbox on mouseover
    movieCircle.on("mouseover", function(event) {
        var [x, y] = d3.pointer(event);

        popbox.transition()
        .duration(200)
        .style("opacity", 1)
        .style("left", (x + 10) + "px") // Use the x position from d3.pointer()
        .style("top", (y + 10) + "px"); // Use the y position from d3.pointer()

        popbox.html(movie.movie_name+" "+movie.movie_rate);
    })
    .on("mouseout", function() {
        popbox.transition()
        .duration(500)
        .style("opacity", 0);
    });
    
  });

//Create a title
var title = svg.append("text")
.attr("x", 30) // Adjust the horizontal position of the title
.attr("y", 70) // Adjust the vertical position of the title
.attr("text-anchor", "left")
.style("font-size", "20pt")
.style("font-family","Poppins")
.style("font-weight","bold")
.style("padding","100px")
.text("Everything Everywhere All At Homebody‘s Movie List 🎬 !");

//Create a text box
var textBox = svg.append("foreignObject")
  .attr("x", 30) // Adjust the horizontal position of the text box
  .attr("y", 90) // Adjust the vertical position of the text box
  .style("font-size", "9pt")
  .style("font-family","Poppins")
  .attr("width", 500) // Adjust the width of the text box
  .attr("height", 110); // Adjust the height of the text box

var textContent = "As an absolute homebody, I spend thousands of hours watching movies/dramas. Whenever I watch a movie/drama, I record it on Douban. So when I realised I had seen 400+ movies/dramas, I wanted to make a visualisation of the ones I had seen.<br>Each circle represents a film/drama I have seen and the size of the circle represents the rating it has received on Douban. I have likewise shown the genre of these movies/dramas.";

textBox.html(textContent);



  // Create a legend
var legend = svg.append("g")
.attr("class", "legend")
.attr("transform", "translate(1100, 230)"); // Adjust the position of the legend

// Create a color scale legend
var colorLegend = legend.selectAll(".color-legend")
.data(colorScale.domain())
.enter()
.append("g")
.attr("class", "color-legend")
.attr("transform", function(d, i) {
  var legendX = 0; // Adjust the horizontal position of the legend
  var legendY = i * 20; // Adjust the vertical position of the legend
  return "translate(" + legendX + "," + legendY + ")";
});

// Append colored rectangles to represent the genres in the legend
colorLegend.append("circle")
.attr("cx", 0)
.attr("cy", 0)
.attr("r", 4) // Adjust the width of the colored rectangles
.attr("fill", function(d) {
  return colorScale(d);
});

// Append text labels to represent the genre names in the legend
var legendText=colorLegend.append("text")
.attr("x", 10) // Adjust the horizontal position of the genre labels
.attr("y", 1) // Adjust the vertical position of the genre labels
//.attr("fill","white")
.text(function(d) {
  return d;
})
.attr("alignment-baseline", "middle");

// Adjust the width and height of the SVG container to fit the legend
var legendBBox = legend.node().getBBox();
svg.attr("width", Math.max(svg.attr("width"), legendBBox.width + 120)) // Adjust the padding on the right side of the legend
 .attr("height", Math.max(svg.attr("height"), legendBBox.height + 120)); // Adjust the padding on the bottom of the legend

  
  });
  
  