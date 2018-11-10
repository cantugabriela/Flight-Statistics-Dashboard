d3.selectAll(".month").on("click", function(){
    console.log(this.value)
    someClick(this.value)
})

function markerSize(total_flights) {
    return total_flights/2;
}

var maxBounds = [
[5.499550, -167.276413], //Southwest
[83.162102, -52.233040]  //Northeast
]
var myMap = L.map("map", {
    // center: [0, 0],
    center: [37.0902, -95.7129],
    'maxBounds':maxBounds,
    zoom:5
})

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    // maxZoom: 18,
    bounds:maxBounds,
    id: "mapbox.streets",
    // id:"mapbox.pirates",
    accessToken: API_KEY
}).addTo(myMap)

let circles

function buildCharts(month_value) {
    console.log(`in 2 :`,month_value)
    d3.json(`/monthly_count/${month_value}`).then(successHandle).catch(errorHandle)

    function successHandle(response){
        //console.log(response)

        for (var resp in response){
            lat_lng = []
            lat_lng.push(response[resp].Latitude)
            lat_lng.push(-response[resp].Longitude)
            total_flights = response[resp].sum_arr_flights
            airport_name = resp
            //console.log(lat_lng)
            console.log(total_flights)
            //console.log(airport_name)
            circles = L.circle(lat_lng, {
                stroke: false,
                fillOpacity: 0.75,
                color: "white",
                fillColor: "purple",
                radius: markerSize(total_flights)
                })
                .bindPopup("<h6>" + airport_name + "</h6> <hr> <h6>city: " + airport_name + "</h6>" +"</h4> <hr> <h6>Total flights: " + total_flights + "</h6>")
                .addTo(myMap);
            }
    }
    function errorHandle(error){
        console.log(`error is :`,{error})
    }

}
// buildCharts()
function clearCircles(){
    d3.selectAll('g').html("")
  }
  
function someClick(month){
    console.log(circles)
    clearCircles()
    buildCharts(month)
    // $(this).addClass('active')
}

