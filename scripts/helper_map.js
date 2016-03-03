(function(document) {
	'use strict';

	var Helper_Map = class Helper_Map {
		constructor() { }

		show_map() {
			var map_event_list_length, map_object,map_event_list_coordinate_string = '',startPos,eventsHTML;
			var geoSuccess = function(position) {
				startPos = position;
				app.location_latitude = startPos.coords.latitude;
				app.location_longitude = startPos.coords.longitude;
				BaasBox.loadCollectionWithParams("elop_events", {where:"distance(latitude,longitude,"+app.location_latitude+","+app.location_longitude+") < .5"}).done(function(res) {
					app.mapEventList = res;

					map_event_list_length = app.mapEventList.length;
					map_event_list_coordinate_string += app.location_latitude + '_' + app.location_longitude
					for (var i = 0; i < map_event_list_length; i++){
						map_event_list_coordinate_string += '~' + app.mapEventList[i].latitude + '_' + app.mapEventList[i].longitude;
					}

					/*Add map to page*/
					map_object = { width: "100%", height: "400px", center: app.location_latitude+"_"+app.location_longitude, pins: map_event_list_coordinate_string};
					document.getElementById("map_event_list").innerHTML = app.generator.generateHtml("map",map_object)
				}).fail(function(error) {console.log("error ", error)});
			};
			var geoError = function(error) {
				console.log('Error occurred. Error code: ' + error.code + '. Message: ' + error.message);
				// error.code can be: // 0: unknown error //	1: permission denied //	2: position unavailable (error response from location provider) //	3: timed out

				$( "#map_event_list" ).empty();

				eventsHTML += app.generator.generateHtml("event_list_gps_error", error.code);
				document.getElementById("map_event_list").innerHTML = eventsHTML;

				return error;
			};
			navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
		}

	}

	app.helper_map = new Helper_Map();

})(document);

var helper_mapJS = true; // Used for util to check if file has been loaded, place at end