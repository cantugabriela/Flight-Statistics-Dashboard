function buildMetadata(sample) {
    // var airlineplot = d3.select("#graph1")
    d3.json("/top_airports").then(successHandle).catch(errorHandle)
    function successHandle(data){
      console.log(data)
      var trace = [{
        x :data.airport_name,
        y :data.arr_flights,
        type :'bar'
      }]
      Plotly.newPlot("graph1",trace) 
    }     
    function errorHandle(error){
      console.log(error)
    } 
  }
buildMetadata()