(function(){

  DataService = function(){
    data = [];
    _randFromRange = function(min, max){
      return Math.floor(Math.random() * max) + min;
    };

    _generateData = function() {
      data = []
      var dataLen = _randFromRange(5,100);
      var i = 0;
      var date = new Date();
      while(i < dataLen){
        var day = new Date(date.getTime());
        day.setDate(date.getDate() - (dataLen - i));
        var y = _randFromRange(1,100);
        var x = day;
        data.push({'x':x, 'y':y})
        i++;
      }
      return data;
    };

    this.get = function(){ return data};

    this.set = function(){ data = _generateData()}
  }


  dataService = new DataService();
  dataService.set();

  // Line Chart
  var createLine = function(){
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);
    var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(6);
    var yAxis = d3.svg.axis().scale(y).orient("left");
    var data = dataService.get();

    var chart = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var line = d3.svg.line()
    .x(function(d) { return x(d.x)})
    .y(function(d) { return y(d.y)});


    x.domain(d3.extent(data, function(d) { return d.x; }));
    y.domain(d3.extent(data, function(d) { return d.y; }));

    chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Date");

    chart.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);
  }

  createLine();

})()
