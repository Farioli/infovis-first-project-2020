/**
 * Created by vdidonato on 3/24/14.
 * Updated to v5 by titto on 4/22/20.
 */

var delayTime = 1000, // time between the picture of one year and the next
    updateTime = 500; // time for transitions

var margin = {top: 20, right: 20, bottom: 30, left: 40};

// screen is 800 x 300
// actual drawing leaves a margin around
// width and height are the size of the actual drawing
//
var width = 800 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;

// x is the scale for x-axis
// domain is not given here but it is updated by updateXScaleDomain()
// 
var x = d3.scaleBand()         // ordinal scale
    .rangeRound([10, width])   // leaves 10 pixels for the y-axis
	.padding(.1);              // between the bands
                               // x.bandwidth() will give the width of each band

// y is the scale for y-axis
// domain is not given here but it is updated by updateYScaleDomain()
//
var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x);  			// Bottom = ticks below
var yAxis = d3.axisLeft(y).ticks(10);   // Left = ticks on the left 

var svg = d3.select(".graph").append("svg")
    .attr("width", width + margin.left + margin.right)     // i.e., 800 again 
    .attr("height", height + margin.top + margin.bottom)   // i.e., 300 again
    .append("g")                                           // g is a group
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");                                                    

// Parameter data is the object containing the values for a specific year
// it has two fields: data.year (a number) and data.ageGroups (an array).
// Each element d of data.ageGroups[] has d.ageGroup (for example "0-4") and  
// d.population (a number)
//
function updateXScaleDomain(data) {
    x.domain(data.map(function(d) { return d.x}));
    // for example x.domain is initialized with ["0-4", "5-9", "10-14", ... ] 
}

function updateYScaleDomain(data){
    y.domain([0, d3.max(data, function(d) { return d.y; })]);
}

function updateAxes(){
    // ".y.axis" selects elements that have both classes "y" and "axis", that is: class="y axis"
    svg.select(".y.axis").transition().duration(updateTime).call(yAxis);
    svg.select(".x.axis").transition().duration(updateTime).call(xAxis);
}

function drawAxes(){

    // draw the x-axis
    //
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // draw the y-axis
    //
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

}

// Parameter data is the object containing the values for a specific year
// it has two fields: data.year (a number) and data.ageGroups (an array).
// Each element d of data.ageGroups[] has d.ageGroup (for example "0-4") and  
// d.population (a number)
//
function updateDrawing(data){

    let x = data.x;
    let y = data.y;

    // Data join: function(d) is the key to recognize the right bar
    
    let circles = svg.selectAll(".circle").data(data, function(d){return d.x});

    // Exit clause: Remove elements
    //circles.exit().remove();

    // Enter clause: add new elements
    //
    circles.enter().append("circle")
        .attr("class", "circle")
        .attr("x", function(d) { return x(d.x); })
        .attr("y", function(d) { return y(d.y); })
        .attr("fill", "none")
        .attr("stroke", "black");

}

function redraw(data) {
    updateXScaleDomain(data);
    updateYScaleDomain(data);
    updateAxes();
    updateDrawing(data);
}

d3.json("data.json")
	.then(function(data) {

    	// Drawing axes and initial drawing
        updateYScaleDomain(data);
        updateXScaleDomain(data);
        drawAxes();
    	updateDrawing(data);

    	// var counter = 0;
    	// setInterval(function(){
       	// 	if (data[counter+1]){
        //    		counter++;
        //    		redraw(data[counter]);
       	// 	}
    	// }, delayTime)
   	})
	.catch(function(error) {
		console.log(error); // Some error handling here
  	});