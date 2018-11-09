function buildMetadata(flight) {

}

function buildCharts(Inputyear) {
  // var airlineplot = d3.select("#graph1")

  
  // Clear any existing metadata
  carrier_list = []
  avg_delay_list = []
 
  //d3.json("/topflights2018").then(successHandle).catch(errorHandle)
  var selector = d3.select("#selYear");
  var Inputyear = selector.property("value");
  console.log(Inputyear)
  d3.json("/topflights/"+Inputyear).then(successHandle).catch(errorHandle)
  function successHandle(data){
    //console.log(data)
    Object.entries(data).forEach(
          function([key,value]){
            console.log(`key is ${key},value is ${value}`)
            x1 = key,
            y1 = value,
            carrier_list.push(x1)
            avg_delay_list.push(y1)
          })          
    var trace = [{
      x :carrier_list,      
      y :avg_delay_list,
      type :'bar',
    }]

    var layout = {
      //width: 500,
      //height: 500,
      title: 'USA Airlines',
      showlegend: false,
      xaxis: {
        //title: "carrier_list",
        //tickangle: -45,
      },
      yaxis: {
        title: "Average Delay",
      },

    };
    Plotly.newPlot("bar1",trace,layout) 
  }     
  function errorHandle(error){
    console.log(error)
  } 
} 

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

function optionChanged(year){

  buildCharts(year);

}


// Initialize the dashboard
init();