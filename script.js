const EARTH_RADIUS = 6371000 /* meters  */
const DEG_TO_RAD =  Math.PI / 180.0
const THREE_PI = Math.PI*3
const TWO_PI = Math.PI*2
let time = 5
let randomLocationGlobal ={
  lat: 0,
  long: 0
}
let currentLocationGlobal ={
  lat: 0,
  long: 0
}
 
function isFloat(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


$('#get-random').click(()=>{
 time = $('#time').val()
  //position = navigator.geolocation.getCurrentPosition()
 // position is the lat long data
  //getCurrentPosition(position)
  
  //current position of user is 1,1
  navigator.geolocation.getCurrentPosition(positionSucceeded)
  
})

  
function positionSucceeded(position) { //position is 1,1
    /*position: {
        otherKey: pair,
        coords: {
          latitude: somenumber,
          longitude: somenumber
        }
      }*/
    lat = position.coords.latitude
    long = position.coords.longitude
     
    let inputCoords = {latitude: lat, longitude: long}
    
    const distances = figureOutDistances(time)
    
    $('#current-location').html(`current location of user: ${lat}, ${long}`)

    const results = pointAtDistance(inputCoords, distances.medianDistance)
    $('#random-location').html(`${results.latitude}, ${results.longitude}`)
  randomLocationGlobal.lat = results.latitude
  randomLocationGlobal.long = results.longitude
  currentLocationGlobal = {lat, long}
  initMap()
  }



//you need to make sure this is a good way of calculating distance
function figureOutDistances(t){
  const medianDistance = t/25 * 805
  const lowerDistance = (t-1)/25 * 805
  const higherDistance = (t+1)/25 * 805
  const distances ={lowerDistance, medianDistance, higherDistance}
  return distances
}


function pointAtDistance(inputCoords, distance) {
    const result = {}
    const coords = toRadians(inputCoords)
    const sinLat =  Math.sin(coords.latitude)
    const cosLat =  Math.cos(coords.latitude)

    /* go a fixed distance in a random direction*/
    const bearing = Math.random() * TWO_PI
    const theta = distance/EARTH_RADIUS
    const sinBearing = Math.sin(bearing)
    const cosBearing =  Math.cos(bearing)
    const sinTheta = Math.sin(theta)
    const cosTheta =    Math.cos(theta)
    /* results:{
      latitude: some fancy number
    } */
    result.latitude = Math.asin(sinLat*cosTheta+cosLat*sinTheta*cosBearing)
    /* results:{
      latitude: some fancy number,
      longitude: some fancy number
    } */
    result.longitude = coords.longitude + 
        Math.atan2( sinBearing*sinTheta*cosLat, cosTheta-sinLat*Math.sin(result.latitude )
    )
    /* normalize -PI -> +PI radians (-180 - 180 deg)*/
    result.longitude = ((result.longitude+THREE_PI)%TWO_PI)-Math.PI

    return toDegrees(result)
}

function toRadians(input){
	return recursiveConvert(input, (val) => val * DEG_TO_RAD)
}

function toDegrees(input){
	return recursiveConvert(input, (val) => val / DEG_TO_RAD)
}

function recursiveConvert(input, callback){
	if (input instanceof Array) {
		return input.map((el) => recursiveConvert(el, callback))
	}
	if  (input instanceof Object) {
		input = JSON.parse(JSON.stringify(input))
		for (let key in input) {
			if( input.hasOwnProperty(key) ) {
				input[key] = recursiveConvert(input[key], callback) 
			} 
		}
		return input
	}
	if (isFloat(input)) { return callback(input) }
}



// Initialize and add the map
function initMap() {
  // The location of Uluru
  if(randomLocationGlobal. lat !== 0){
    var uluru2 = {lat: randomLocationGlobal.lat, lng: randomLocationGlobal.long};
    
  }
  
  var uluru = {lat: currentLocationGlobal.lat, lng: currentLocationGlobal.long};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 15, center: uluru});
  // The marker, positioned at Uluru
  var marker2 = new google.maps.Marker({position: uluru2, map: map});
  var marker = new google.maps.Marker({position: uluru, map: map, icon: {
        path: google.maps.SymbolPath.CIRCLE, //this is so you can see the difference between both markers
        
        scale: 7,
        strokeWeight: 2,
        fillColor: "white",
        strokeColor: "black",
        fillOpacity: 0.9,
    
    }})
}

//copy input and button
function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}