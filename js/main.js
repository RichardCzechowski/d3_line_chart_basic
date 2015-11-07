(function(){

  DataService = function(){
    var _data = [];
    // Get a random number between a min and max
    _randFromRange = function(min, max){
      return Math.floor(Math.random() * max) + min;
    };

    // Generates a simple time data set
    _generateData = function() {
      _data.length = 0;
      var dataLen = _randFromRange(5,100);
      var i = 0;
      var date = new Date();
      while(i < dataLen){
        var day = new Date(date.getTime());
        day.setDate(date.getDate() - (dataLen - i));
        var y = _randFromRange(1,100);
        var x = day;
        _data.push({'x':x, 'y':y})
        i++;
      }
      return _data;
    };

    this.get = function(){ return _data};

    this.set = function(){ data = _generateData()}
  }


  dataService = new DataService();
  dataService.set();

  // Line Chart
  var createLine = function(data){
    // Set size of chart
    var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // You must define the type of graph you are creating
    // by setting the scales by which the data will be interpreted.
    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    // Here we assign our scales to an axis and set their orientation.
    var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(6);
    var yAxis = d3.svg.axis().scale(y).orient("left");

    // Let's setup our initial data
    var data = dataService.get();

    // We need to tell d3 what data is the x axis and what is the y for each point
    var line = d3.svg.line()
    .x(function(d) { return x(d.x)})
    .y(function(d) { return y(d.y)});

    // D3 will determin the extents of your data for you
    x.domain(d3.extent(data, function(d) { return d.x; }));
    y.domain(d3.extent(data, function(d) { return d.y; }));

    // Grap our starting 'chart' element from the DOM
    // and append an svg to it with a width and height
    // Then we will append our other elements
    var chart = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Append our x axis and a text element for a title
    chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Date");

    // Append our y axis and a text element for a title
    chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -70)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number of McGuffins");

    // Finally we append our line and set it's path based on the line defined above.
    chart.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

    // Here we update the chart on button press
    update = function(){
      // Scale the range of the data again
      x.domain(d3.extent(data, function(d) { return d.x; }));
      y.domain([0, d3.max(data, function(d) { return d.y; })]);

      // Select the section we want to apply our changes to
      var svg = d3.select("body").transition();

      // Make the changes
      svg.select(".line")   // change the line
      .duration(750)
      .attr("d", line(data));
      svg.select(".x.axis") // change the x axis
      .duration(750)
      .call(xAxis);
      svg.select(".y.axis") // change the y axis
      .duration(750)
      .call(yAxis);
    }
    // Update data then update chart on button click
    $("#setData").on("click", function(){
      dataService.set();
      data = dataService.get();
      update();
    });

  }

  // Init
  createLine();

})()
