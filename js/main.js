// 1 - Rappresenting data table in Js

// Selection of all svg of the page
const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const margin = { top: 20, right: 20, bottom: 20, left: 100, };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const g = svg.append('g')
    .attr('transform', `translate(${margin.left} , ${margin.top})`);

let xScale;
let yScale;

const circleRadius = 10;

let datasets = [];

const setDomainAndAxis = data => {

    // Decide the max of the domain
    let maxOfX = d3.max(data, d => d.x);
    let maxOfY = d3.max(data, d => d.y);
    let maxOfDomain = maxOfX > maxOfY ? maxOfX : maxOfY;

    // Creating linear scale: mapping del dominio (Data Space) -> Range (Pixel Scale)
    xScale = d3.scaleLinear()
        .domain([0, maxOfDomain])
        .range([0, innerWidth]);

    // Test domain
    console.log("Domain for x: " + xScale.domain() + "\n Range for x:" + xScale.range());

    yScale = d3.scaleLinear()
        .domain([0, maxOfDomain])
        .range([innerHeight, 0])
    // Test domain
    console.log("Domain for y: " + yScale.domain() + "\n Range for y:" + yScale.range());

    g.append('g')
        .attr("class", "x")
        .attr('transform', `translate(0 , ${innerHeight})`)
        .call(d3.axisBottom(xScale));

    g.append('g')
        .attr("class", "y")
        .call(d3.axisLeft(yScale));

}

// 2 - Creating a rectangle for each row
const render = data => {

    console.log("Data rendering");

    // D3 data JOIN
    g.selectAll('circle')
        .data(data)
        .join(
            enter => enter.append('circle')
                .attr('id', (d, i) => "cir_" + i)
                .attr('r', circleRadius)
                .attr('cx', d => xScale(d.x))
                .attr('cy', d => yScale(d.y))
                .on('click', function (d, i) { updateDatasetsExceptPosition(i); }),
            update => update.transition()
                .attr('cx', d => xScale(d.x))
                .attr('cy', d => yScale(d.y))
                .attr("fill", "green")
                .duration(1500),
            exit => exit.remove()
        )

    // OLD
    // .join('circle')
    // .attr('id', (d, i) => "cir_" + i)
    // .attr('r', circleRadius)
    // .attr('cx', d => xScale(d.x))
    // .attr('cy', d => yScale(d.y))
    // .on('click', function (d, i) { updateDatasetsExceptPosition(i); });


}

function updateDatasetsExceptPosition(position) {

    datasets.forEach((d, i) => {
        if (i != position) {
            temp = d.x;
            d.x = d.y;
            d.y = temp;
        }
    });

    // Update Datasets Values
    console.log(datasets);
    render(datasets);
}

d3.json('data.json').then(data => {

    datasets = data;
    setDomainAndAxis(datasets);
    render(datasets);
});