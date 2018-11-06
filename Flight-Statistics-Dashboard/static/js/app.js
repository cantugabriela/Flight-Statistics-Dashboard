function buildMetadata(flight) {

}

function buildCharts(flight) {

  //Summary Chart

  // Map
  
//    // var airlineplot = d3.select("#graph1")
//    d3.json("/top_airports").then(successHandle).catch(errorHandle)
//    function successHandle(data){
//      console.log(data)
//      var trace = [{
//        x :data.airport_name,
//        y :data.arr_flights,
//        type :'bar'
//      }]
//      Plotly.newPlot("graph1",trace) 
//    }     
//    function errorHandle(error){
//      console.log(error)
//    } 
//  }

  // Pie Chart 

  // Bar 



}
console.log()
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selYear");

  // Use the list of flight names to populate the select options
  d3.json("/years").then((flightYears) => {
    flightYears.forEach((year) => {
      selector
        .append("option")
        .text(year)
        .property("value", year);
    });

    // Use the first flight from the list to build the initial plots
    const firstflight = flightYears[0];
    buildCharts(firstflight);
    buildMetadata(firstflight);
  });
}


// Initialize the dashboard
init();