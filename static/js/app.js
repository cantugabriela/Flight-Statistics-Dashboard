
// function buildMetadata(sample) {
//     // var airlineplot = d3.select("#graph1")
//     name_list = []
//     flight_count = []
//     d3.json("/top_airports").then(successHandle).catch(errorHandle)
//     function successHandle(data){
//       console.log(data)
//       Object.entries(data).forEach(function(data){
//         console.log(Object.entries(data))
//         x= data[0],
//         y= data[1],
//         console.log(x),
//         console.log(y),
//         name_list.push(x),
//         flight_count.push(y)
//       })          
//       var trace = [{
//         x :name_list,
//         y :flight_count,
//         type :'bar'
//       }]
//       Plotly.plot("graph1",trace) 
//     }     
//     function errorHandle(error){
//       console.log(error)
//     } 
//   } 
  
// buildMetadata()