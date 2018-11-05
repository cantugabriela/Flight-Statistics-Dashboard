function buildMetadata(sample) {

}

function buildCharts(sample) {

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

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selYear");

  // Use the list of sample names to populate the select options
  d3.json("/years").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
        conosle.log(sampleNames)
    
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();