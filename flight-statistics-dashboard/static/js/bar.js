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
            x1 = value[0],
            y1 = value[1],
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
      height: 300,
      title: 'USA Domestic Airlines Yearwise Performance ',
      showlegend: false,
      xaxis: {
        //title: "carrier_list",
        //tickangle: -45,
        automargin: true,
        linecolor: 'black',
        linewidth: 2,
        mirror: true,
      },
      yaxis: {
        title: "Average Delay",
        automargin: true,
        linecolor: 'black',
        linewidth: 2,
        mirror: true,
      },

    };
    Plotly.newPlot("bar1",trace,layout, {responsive: true}) 
  }     
  function errorHandle(error){
    console.log(error)
  } 
} 


function buildChartsNew(Airport) {
  carrier_list1 = []
  avg_delay_list1 = []
  var Inputyear = 2018;
  // console.log(Inputyear)
  var selector1 = d3.select("#selAirport");
  var Airport = selector1.property("value");
  console.log(Airport)
  d3.json(`/topflightsName/${Airport}/${Inputyear}`).then(successHandle).catch(errorHandle)
  function successHandle(data){
    //console.log(data)
    Object.entries(data).forEach(
          function([key1,value1]){
            console.log(`key is ${key1},value is ${value1}`)
            x2 = value1[0],
            y2 = value1[1],
            carrier_list1.push(x2)
            avg_delay_list1.push(y2)
          })          
    var trace1 = [{
      x :carrier_list1,      
      y :avg_delay_list1,
      type :'bar',
      marker:{
      color: 'red'
    }
    }]

    var layout = {
      //width: 500,
      height: 300,
      title: 'USA Domestic Airlines year 2018 Performance for Top Ten Airports',
      showlegend: false,
      xaxis: {
        //title: "carrier_list",
        //tickangle: -45,
        automargin: true,
        linecolor: 'black',
        linewidth: 2,
        mirror: true,
      },
      yaxis: {
        title: "Average Delay",
        automargin: true,
        linecolor: 'black',
        linewidth: 2,
        mirror: true,
      },

    };
    Plotly.newPlot("bar2",trace1,layout, {responsive: true})     

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

// Grab a reference to the dropdown select element
    var selector1 = d3.select("#selAirport");
    name_list = []
    d3.json("/top_airports").then(successHandle)
      function successHandle(data){
        //console.log(data)
        Object.entries(data).forEach(function(data){
          //console.log(Object.entries(data))
          x= data[0],
          y= data[1],
          //console.log(x),
          //console.log(y),
          name_list.push(x);
          selector1
          .append("option")
          .text(x)
          .property("value", x); 
        }); 
      


    // Use the first flight from the list to build the initial plots
    const firstflight = flightYears[0];
    var Airport = name_list[0];
    //const Airport = "Chicago, IL: Chicago O'Hare International";
    // var selector1 = d3.select("#selAirport");
    // var Airport = selector1.property("value");
    buildCharts(firstflight);
    buildChartsNew(Airport);
      }
  });
}

function optionChanged(year){

  buildCharts(year);

}
function optionChanged1(airport){
    console.log(airport)
    //console.log(year)

  buildChartsNew(airport);

}



// Initialize the dashboard
init();