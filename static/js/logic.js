d3.selectAll(".month").on("click", function(){
    console.log('selected value')
    console.log(this.value)
    someClick(this.value)
})


function buildMaps(month_value) {
    console.log(`calling buildCharts :`,month_value)
    d3.json(`/monthly_count/${month_value}`).then(successHandle).catch(errorHandle)
    
    function successHandle(response){
        console.log(`calling successhandler`)
        console.log(response) 
        var total_flight_markers = []
        var delay_pct_markers = []           
              
        for (var resp in response){ 
            var lat_lng = []  
            lat_lng.push(response[resp].Latitude)
            lat_lng.push(-response[resp].Longitude)
            total_flights = response[resp].sum_arr_flights
            del_pct_airport = response[resp].del_pct
            airport_name = resp
            split_text = airport_name.split(":")
            place = split_text[0]
            name = split_text[1]
            total_flight_markers.push(
                L.circle(lat_lng, {
            stroke: false,
            fillOpacity: 0.75,
            color: "grey",
            fillColor: "purple",
            radius: (total_flights)*1.5
            }).bindTooltip("Name:" + name + "<hr> Location: " + place +" <hr> Total flights: " + total_flights )
            )
            console.log(`total:`,total_flight_markers) 
            delay_pct_markers.push(
                L.circle(lat_lng,{
            stroke: false,
            fillOpacity: 0.75,
            color: "white",
            fillColor: "white",
            radius: ((del_pct_airport*total_flights)/100)*1.5
            }).bindTooltip("Name:" + name + "<hr> Location: " + place +" <hr> Delay %: " + del_pct_airport )
            )          
        }
        console.log(`finished parsing response`)
        console.log(`Lat Long `)
        console.log(lat_lng)
        console.log(`Flight Markers`)
        console.log(total_flight_markers)    
        console.log(`Delay markers `)
        console.log(delay_pct_markers)
        var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 8,
        id: "mapbox.streets",
        accessToken: API_KEY
        })

        var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 8,
        id: "mapbox.dark",
        accessToken: API_KEY
        })
        
        var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
        };

        var flights = L.layerGroup(total_flight_markers)
        var delay = L.layerGroup(delay_pct_markers)

        //create an overlay object
        var overlayMaps = {
            "Total Arrivals": flights,
            "Total Delays":delay
        }
        
        var container = L.DomUtil.get('map')
        if(container != null){
            container._leaflet_id = null; 
        }

        var myMap = L.map("map",{
            center: [37.0902, -95.7129],
            zoom:5,
            layers:[darkmap,flights,delay]
        })

        L.control.layers(baseMaps,overlayMaps,{
            collapsed:false
        }).addTo(myMap)

    }
    function errorHandle(error){
        console.log(`error is :`,{error})
    }   
}

function init(){
    buildMaps(1)
}
init()

function clearCircles(){
    d3.selectAll('g').html("")
  }
  
function someClick(month){
    clearCircles()
    buildMaps(month)
}