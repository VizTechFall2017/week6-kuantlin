var width = d3.select('svg').attr('width');
var height = d3.select('svg').attr('height');

var marginLeft = 100;
var marginTop = 100;

var nestedData = [];

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

var scaleX = d3.scaleBand().rangeRound([0, 600]).padding(0.1);
var scaleY = d3.scaleLinear().range([400, 0]);



d3.csv('./Clean Energy.csv', function(dataIn){

    nestedData = d3.nest()
        .key(function(d){return d.year})
        .entries(dataIn);

    var loadData = nestedData.filter(function(d){return d.key == '2010'})[0].values;

    scaleX.domain(loadData.map(function(d){return d.name;}));
    scaleY.domain([0, d3.max(loadData.map(function(d){return +d.total}))]);



    svg.append('text')
        .text('Hawaii Clean Energy Breakdown')
        .attr('transform','translate(300, -50)')
        .style('text-anchor','middle')
        .style("font-size",'28px')
    ;



    svg.append("g")
        .attr('transform','translate(0,400)')
        .call(d3.axisBottom(scaleX));

    svg.append("g")
        .attr('class','yaxis')
        .call(d3.axisLeft(scaleY));


    svg.selectAll('rect')
        .data(loadData)
        .enter()
        .append('rect')
        .attr('class','bars')
        .style("fill", function(d,i) { return 'rgb(20, ' + ((i * 30) + 50) + ', 20)'});




    $('#testRect').tooltip();
    ;


    drawPoints(loadData);

});



function drawPoints(pointData){

    scaleY.domain([0, d3.max(pointData.map(function(d){return +d.total}))]); //change the domain along with the years with data, rescale the data!

    svg.selectAll('.yaxis')
        .call(d3.axisLeft(scaleY));

    svg.selectAll('rect')
        .data(pointData)
        .attr('x',function(d){
            return scaleX(d.name);
        })
        .attr('y',function(d){
            return scaleY(d.total);
        })
        .attr('width',function(d){
            return scaleX.bandwidth();
        })
        .attr('height',function(d){
            return 400 - scaleY(d.total);  //400 is the beginning domain value of the y axis, set above range[400,0]
        })
        .attr('data-toggle', 'tooltip');
}
    $('[data-toggle="tooltip"]').tooltip();

function updateData(selectedYear){
    return nestedData.filter(function(d){return d.key == selectedYear})[0].values;
}


//this function runs when the HTML slider is moved
function sliderMoved(value){

    newData = updateData(value);
    drawPoints(newData);

}