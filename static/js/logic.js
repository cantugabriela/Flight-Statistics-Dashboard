function markerSize(total_flights) {
  return total_flights/10;
}

var maxBounds = [
  [5.499550, -167.276413], //Southwest
  [83.162102, -52.233040]  //Northeast
];
var myMap = L.map("map", {
    // center: [0, 0],
    center: [37.0902, -95.7129],
    'maxBounds':maxBounds,
    zoom:5
  });

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  // id:"mapbox.pirates",
  accessToken: API_KEY
}).addTo(myMap);

// var url = "http://127.0.0.1:5000/monthly_count/<month>"

function buildCharts(month_value) {
  var month_button = d3.select("#months")
  var month_value = month_button.property("value")
  console.log(month_value)
  d3.json(`/monthly_count/${month_value}`).then(successHandle).catch(errorHandle)
  function successHandle(response){
    console.log("response")
  }
  function errorHandle(error){
    console.log(`error is :`,{error})
  }


}
buildCharts()

// An array containing each airport's name, location, and total number of flights
var cities = [{
  location: [33.6407, -84.4277],
  city_name:"Atlanta, GA",
  airport_name: "Hartsfield-Jackson Atlanta International",
  total_flights: "2124645.0"
},
// {
//   location: [41.9773 -87.8369],
//   city_name:"Chicago, IL",
//   airport_name: "Chicago O'Hare International",
//   total_flights: "1607393.0"
// },
{
  location: [32.8998, -97.0403],
  city_name:"Dallas/Fort Worth, TX",
  airport_name: "Dallas/Fort Worth International",
  total_flights: "1364793.0"
},
{
  location: [39.8561, 104.6737],
  city_name:"Denver, CO",
  airport_name: "Denver International",
  total_flights: "1249885.0"
},
{
  location: [40.7128, -74.0059],
  city_name:"Houston, TX",
  airport_name: "George Bush Intercontinental/Houston",
  total_flights: "881561.0"
},
{
  location: [36.0840, -115.1537],
  city_name:"Las Vegas, NV",
  airport_name: "McCarran International",
  total_flights: "818114.0"
},
{
  location: [40.7128, -74.0059],
  city_name:"Houston, TX",
  airport_name: "George Bush Intercontinental/Houston",
  total_flights: "881561.0"
},
{
  location: [33.9416, -118.4085],
  city_name:"Los Angeles, CA",
  airport_name: "Los Angeles International",
  total_flights: "1215697.0"
},
{
  location: [40.7128, -74.0059],
  city_name:"Houston, TX",
  airport_name: "George Bush Intercontinental/Houston",
  total_flights: "881561.0"
},
{
  location: [44.8848, -93.2223],
  city_name:"Minneapolis, MN",
  airport_name: "Minneapolis-St Paul International",
  total_flights: "731826.0"
},
{
  location: [33.4373, -112.0078],
  city_name:"Phoenix, AZ",
  airport_name: "Phoenix Sky Harbor International",
  total_flights: "913972.0"
},
{
  location: [37.6213, -122.3790],
  city_name:"San Francisco, C",
  airport_name: "San Francisco International",
  total_flights: "946224.0"
}
];

// Loop through the cities array and create one marker for each airport, bind a popup containing its city name ,airport name and total flights add it to the map
for (var i = 0; i < cities.length; i++) {
  var city = cities[i];
  L.circle(city.location, {
    stroke: false,
    fillOpacity: 0.75,
    color: "white",
    fillColor: "purple",
    radius: markerSize(city.total_flights)
  })
    .bindPopup("<h6>" + city.airport_name + "</h6> <hr> <h6>city: " + city.city_name + "</h6>" +"</h4> <hr> <h6>Total flights: " + city.total_flights + "</h6>")
    .addTo(myMap);
}

