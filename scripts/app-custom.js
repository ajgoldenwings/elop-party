(function(document) {
	'use strict';

	// Initialize App
	// if(typeof app.route==='undefined'){app.route='loading';}// if(typeof app.isNotLoggedIn==='undefined'){app.isNotLoggedIn=true;}// if(typeof app.isNotLoggedInWithUser==='undefined'){app.isNotLoggedInWithUser=true;}// if(typeof app.isEventSubmittable==='undefined'){app.isEventSubmittable=false;}// if(typeof app.aboutHidden==='undefined'){app.aboutHidden=true;}// if(typeof app.contactHidden==='undefined'){app.contactHidden=true;}// if(typeof app.contentRightsHidden==='undefined'){app.contentRightsHidden=true;}// if(typeof app.hideSettingsChangePassword==='undefined'){app.hideSettingsChangePassword=true;}// if(typeof app.hideSignUp==='undefined'){app.hideSignUp=true;}// if(typeof app.elop_events_loaded==='undefined'){app.elop_events_loaded=false;}// if(typeof app.elop_username==='undefined'){app.elop_username='';}// if(typeof app.permissionStatus_geolocation==='undefined'){app.permissionStatus_geolocation='';}
	// Current Event
	// if(typeof app.event_current_title==='undefined'){app.event_current_title='';}// if(typeof app.event_current_latitude==='undefined'){app.event_current_latitude='';}// if(typeof app.event_current_length==='undefined'){app.event_current_length='';}// if(typeof app.event_current_longitude==='undefined'){app.event_current_longitude='';}// if(typeof app.event_current_promoter==='undefined'){app.event_current_promoter='loading...';}// if(typeof app.event_current_time==='undefined'){app.event_current_time='loading...';}// if(typeof app.event_current_timeto==='undefined'){app.event_current_timeto='loading...';}

	// if ("geolocation" in navigator) console.log('geolocation is available'); else console.log('geolocation IS NOT available');

	navigator.permissions.query({name:'geolocation'}).then(function(permissionStatus) {
		app.permissionStatus_geolocation = permissionStatus.state;
		permissionStatus.onchange = function() {app.permissionStatus_geolocation = this.state;};
	}); // "granted", "denied", "prompt"

	var month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

	// Event Add Variables
	app.event_length = 0; // Minutes
	app.location_latitude = 0;
	app.location_longitude = 0;
	app.location_status = -1; // -1: not set, 0: unknown error, 1: permission denied, 2: position unavailable (error response from location provider), 3: timed out, 4: nominal

	BaasBox.pagelength = 5;

	app.BaasBox_fetchCurrentUser = function() {
		BaasBox.fetchCurrentUser().done(function(res) {
			app.elop_username = res['data'].user.name;
			if (app.route == 'signon' || app.route == 'loading') {
				if (!app.elop_events_loaded) {
					app.events_load();
				}
				app.route = 'events';
			}
			app.isNotLoggedIn = false;
			app.isNotLoggedInWithUser = false;
		}).fail(function(error) {
			app.route = 'signon';
			app.isNotLoggedIn = true;
			app.isNotLoggedInWithUser = true;
		});
	}
	app.BaasBox_fetchCurrentUser();

	app.event_add = function() {
		if (!document.getElementById('event-title-paper-input').validate() || app.location_status != 4) {
			return;
		}
		var event = new Object();
		event.title = app.event_title_paper_input;
		event.latitude = app.location_latitude;
		event.longitude = app.location_longitude;
		event.length = app.event_length;
		app.event_date = new Date(app.event_date);
		event.date = app.event_date.getTime();

		app.date_end = new Date(app.event_date);
		app.date_end.setMinutes(app.date_end.getMinutes() + app.event_length);
		event.date_end = app.date_end.getTime();

		app.event_title_paper_input = '';

		BaasBox.save(event, "elop_events").done(function(res) {
			BaasBox.grantRoleAccessToObject("elop_events", res.id, BaasBox.READ_PERMISSION, BaasBox.REGISTERED_ROLE).done(function(res) {
				app.events_load();
			}).fail(function(error) {console.log("error ", error)});
		}).fail(function(error) {console.log("error ", error)});
	};

	app.event_load = function() {
		var date,hours,time,timeto,length_in_hours,length_text, eventID = app.params.eventid, map_object;
		document.getElementById("event_map").innerHTML = 'Loading Map...';
		BaasBox.loadObject("elop_events", eventID).done(function(res) {
			app.event_current_title = res['data'].title;
			app.event_current_latitude = res['data'].latitude;
			app.event_current_longitude = res['data'].longitude;
			app.event_current_promoter = res['data']._author;
			app.event_current_length = res['data'].length;

			date = new Date(res['data'].date);
			hours = date.getHours();
			app.event_current_time = (hours%12==0?12:hours%12)+':'+('0'+date.getMinutes()).slice(-2)+(hours<12?'am':'pm');

			date.setTime(date.getTime() + (res['data'].length*60*1000));
			hours = date.getHours();
			app.event_current_timeto = (hours%12==0?12:hours%12)+':'+('0'+date.getMinutes()).slice(-2)+(hours<12?'am':'pm');

			var startPos;
			app.location_latitude = '';
			app.location_longitude = '';
			var geoSuccess = function(position) {
				startPos = position;
				app.location_latitude = startPos.coords.latitude;
				app.location_longitude = startPos.coords.longitude;
				app.location_status = 4;
				map_object = { width: "100%", height: "400px", center: app.event_current_latitude + "_" + app.event_current_longitude, pins: app.event_current_latitude + "_" + app.event_current_longitude + "~" + app.location_latitude + "_" + app.location_longitude };

				/*Add map to page*/
				document.getElementById("event_map").innerHTML = app.generator.generateHtml("map", map_object);
			};
			var geoError = function(error) {
				app.location_status = error.code;
				document.getElementById("event_map").innerHTML = 'Failed Loading Map.';
			};
			navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

		}).fail(function(error) {
			document.getElementById("event_map").innerHTML = 'Failed Loading Map.';
		});
	}

	app.events_load = function() {
		var event_list_length, eventsHTML = '', date = '', hours = 0, time = '', timeto = '', length_in_hours = 0, length_text = '', currentdate = new Date();
		currentdate = currentdate.getTime();
		var startPos;
		var geoSuccess = function(position) {
			startPos = position;
			app.location_latitude = startPos.coords.latitude;
			app.location_longitude = startPos.coords.longitude;

			BaasBox.loadCollectionWithParams("elop_events", {page: 0, recordsPerPage: BaasBox.pagelength, where: "date_end >= " + currentdate + " AND distance(latitude,longitude,"+app.location_latitude+","+app.location_longitude+") < .5", orderBy: "_creation_date DESC"}).done(function(res) {
				app.eventList = res;

				$( "#event_list_area" ).empty();

				event_list_length = app.eventList.length;
				for (var i = 0; i < event_list_length; i++){
					date = new Date(app.eventList[i].date);
					hours = date.getHours();
					time = (hours%12==0?12:hours%12)+':'+('0'+date.getMinutes()).slice(-2)+(hours<12?'am':'pm');

					date.setTime(date.getTime() + (app.eventList[i].length*60*1000));
					hours = date.getHours();
					timeto = (hours%12==0?12:hours%12)+':'+('0'+date.getMinutes()).slice(-2)+(hours<12?'am':'pm');

					length_in_hours = app.eventList[i].length/60;
					length_text = length_in_hours==1?' hour':' hours';

					var event_object = {id:app.eventList[i].id, title:app.eventList[i].title, year:date.getFullYear(), month:month[date.getMonth()], date:date.getDate(), time:time, timeto:timeto, length_in_hours:length_in_hours, length_text:length_text, author:app.eventList[i]._author};
					eventsHTML += app.generator.generateHtml("event_list_event", event_object);
					length_in_hours = 0;
					length_text = '';
				}

				if (event_list_length == 0) {
					$("#events_load_more_card").remove();
				}
				eventsHTML += app.generator.generateHtml("event_list_end", event_list_length);
				document.getElementById("event_list_area").innerHTML = eventsHTML;
				app.elop_events_loaded = true;
			}).fail(function(error) {
				$("#event_list_area").empty();
				eventsHTML += app.generator.generateHtml("event_list_no_connection");
				document.getElementById("event_list_area").innerHTML = eventsHTML;
			});
		};
		var geoError = function(error) {
			$( "#event_list_area" ).empty();
			$( "#event_list_area_more" ).empty();

			eventsHTML += app.generator.generateHtml("event_list_gps_error", error.code);
			document.getElementById("event_list_area").innerHTML = eventsHTML;
			return error;
		};
		navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
	}

	app.events_load_more = function() {
		var event_list_length,eventsHTML = '',date = '',hours = 0,time = '',timeto = '',length_in_hours = 0, length_text = '',currentdate = new Date();
		currentdate = currentdate.getTime();

		var page = Number(document.getElementById("event_list_area_more").getAttribute("value"))+1;
		document.getElementById("event_list_area_more").setAttribute("value",page);

		BaasBox.loadCollectionWithParams("elop_events", {page: page, recordsPerPage: BaasBox.pagelength, where: "date_end >= " + currentdate + " AND distance(latitude,longitude,"+app.location_latitude+","+app.location_longitude+") < .5", orderBy: "_creation_date DESC"}).done(function(res) {
			app.eventList = res;

			event_list_length = app.eventList.length;
			for (var i = 0; i < event_list_length; i++){
				date = new Date(app.eventList[i].date);
				hours = date.getHours();
				time = (hours%12==0?12:hours%12)+':'+('0'+date.getMinutes()).slice(-2)+(hours<12?'am':'pm');

				date.setTime(date.getTime() + (app.eventList[i].length*60*1000));
				hours = date.getHours();
				timeto = (hours%12==0?12:hours%12)+':'+('0'+date.getMinutes()).slice(-2)+(hours<12?'am':'pm');

				length_in_hours = app.eventList[i].length/60;
				length_text = length_in_hours==1?' hour':' hours';

				var event_object = {id:app.eventList[i].id, title:app.eventList[i].title, year:date.getFullYear(), month:month[date.getMonth()], date:date.getDate(), time:time, timeto:timeto, length_in_hours:length_in_hours, length_text:length_text, author:app.eventList[i]._author};
				eventsHTML += app.generator.generateHtml("event_list_event", event_object);

				length_in_hours = 0;
				length_text = '';
			}

			if (event_list_length == 0) {
				$("#events_load_more_card").remove();
			}

			eventsHTML += app.generator.generateHtml("event_list_end", event_list_length);

			$("#event_list_area_more").append(eventsHTML);

			app.elop_events_loaded = true;
		}).fail(function(error) {
			eventsHTML += app.generator.generateHtml("event_list_no_connection");
			document.getElementById("event_list_area_more").innerHTML = eventsHTML;
		});
	}

	app.events_load_more_past = function() {
		var event_list_length,eventElement, eventElement_content,eventsHTML = '',date = '',hours = 0,time = '',timeto = '',length_in_hours = 0, length_text = '',currentdate = new Date();
		currentdate = currentdate.getTime();

		var page = Number(document.getElementById("event_list_area_more_past").getAttribute("value"));

		BaasBox.loadCollectionWithParams("elop_events", {page: page, recordsPerPage: BaasBox.pagelength, where: "date_end < " + currentdate + " AND distance(latitude,longitude,"+app.location_latitude+","+app.location_longitude+") < 200.5", orderBy: "_creation_date DESC"}).done(function(res) {
			app.eventList = res;

			event_list_length = app.eventList.length;
			for (var i = 0; i < event_list_length; i++){
				date = new Date(app.eventList[i].date);
				hours = date.getHours();
				time = (hours%12==0?12:hours%12)+':'+('0'+date.getMinutes()).slice(-2)+(hours<12?'am':'pm');

				date.setTime(date.getTime() + (app.eventList[i].length*60*1000));
				hours = date.getHours();
				timeto = (hours%12==0?12:hours%12)+':'+('0'+date.getMinutes()).slice(-2)+(hours<12?'am':'pm');

				length_in_hours = app.eventList[i].length/60;
				length_text = length_in_hours==1?' hour':' hours';

				var event_object = {id:app.eventList[i].id, title:app.eventList[i].title, year:date.getFullYear(), month:month[date.getMonth()], date:date.getDate(), time:time, timeto:timeto, length_in_hours:length_in_hours, length_text:length_text, author:app.eventList[i]._author};
				eventsHTML += app.generator.generateHtml("event_list_event", event_object);

				length_in_hours = 0;
				length_text = '';
			}

			if (event_list_length == 0){
				$( "#events_load_more_past_card" ).remove();

				eventsHTML +=
					'<paper-card heading="No more past events found">';
				if (!app.isNotLoggedInWithUser) {
					eventsHTML +=
					'<div class="card-content style-scope elop-events">'+
					'Can&#39;t find the event you want, go ahead and add an event.<br><br>'+
					// 'Look at the Release Map <a href=http://1drv.ms/1JaOI5N" target="_blank" style="color:red;">here</a> to view where Elop Party is going.'+
					'</div>';
				} if (app.isNotLoggedInWithUser) {
					eventsHTML +=
					'<div class="card-content style-scope elop-events">' +
					'You may view and add events if you sign up.' +
					'</div>';
				} if (!app.isNotLoggedInWithUser) {
					eventsHTML +=
					'<div class="card-actions style-scope elop-events">' +
					'<a data-route="event_add" href="/event_add">' +
					'<paper-button>Add Event</paper-button>' +
					'</a>' +
					'</div>';
				}
				eventsHTML +=
					'</paper-card>';
			}

			$("#event_list_area_more_past").append(eventsHTML);

			app.elop_events_loaded = true;
		}).fail(function(error) {
			/*Create main element*/
			eventElement = document.createElement("paper-card");

			/*Add heading*/
			eventElement.setAttribute("heading", "Events Not Found");

			eventElement_content = document.createElement("div");
			eventElement_content.setAttribute("class", "card-content style-scope elop-events");
			eventElement_content.appendChild(document.createTextNode("Was not able to get the events from the connection."));
			eventElement.appendChild(eventElement_content);
			eventElement.getElementsByTagName("paper-material")[0].appendChild(eventElement_content);

			/*Add event to page*/
			document.getElementById("event_list_area_more_past").appendChild(eventElement);
		});

		document.getElementById("event_list_area_more_past").setAttribute("value",page+1);
	}

	app.event_title_validate = function() {
		if(document.getElementById('event-title-paper-input').value.length==0) {
			jQuery(function($) {$('#event-title-paper-input').find('*').removeAttr('invalid');});
		}
	}

	app.getCurrentPosition = function() {
		var startPos;
		var geoSuccess = function(position) {
			startPos = position;
			app.location_latitude = startPos.coords.latitude;
			app.location_longitude = startPos.coords.longitude;
		};
		var geoError = function(error) {
			console.log('Error occurred. Error code: ' + error.code + '. Message: ' + error.message);
			// error.code can be: // 0: unknown error // 1: permission denied // 2: position unavailable (error response from location provider) //	3: timed out
			return error;
		};
		navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
	}

	app.getCurrentPositionForEvent = function() {
		var startPos, mapElement, map_object;
		var geoSuccess = function(position) {
			startPos = position;
			$('#event_location_progress').removeAttr('indeterminate');
			document.getElementById('event_location_progress').value = '100';
			document.getElementById('event_location_progress_label').innerHTML = 'Location Found, Using current location for event';
			app.location_latitude = startPos.coords.latitude;
			app.location_longitude = startPos.coords.longitude;
			app.location_status = 4;

			map_object = { width: "100%", height: "350px", center: app.location_latitude+"_"+app.location_longitude, pins: app.location_latitude+"_"+app.location_longitude };
			document.getElementById("event_add_location").innerHTML = app.generator.generateHtml("map", map_object);
		};
		var geoError = function(error) {
			app.location_status = error.code;
			if (error.code == 0) {
				document.getElementById('event_location_progress_label').innerHTML = 'Location Not Found (unknown error)';
			} else if (error.code == 1) {
				document.getElementById('event_location_progress_label').innerHTML = '<a href="https://www.google.com/#q=how+to+allow+access+to+current+location" target="_blank">Location Not Found (permission denied), You must allow access to location</a>';
			} else if (error.code == 2) {
				document.getElementById('event_location_progress_label').innerHTML = 'Location Not Found (position unavailable (error response from location provider))';
			} else if (error.code == 3) {
				document.getElementById('event_location_progress_label').innerHTML = 'Location Not Found (timed out)';
			} else {
				document.getElementById('event_location_progress_label').innerHTML = 'Location Not Found (other error:'+error.code+')';
			}
			$('#event_location_progress').removeAttr('indeterminate');
			document.getElementById('event_location_progress').value = '100';
			$('#event_location_progress #activeProgress').css("background-color", "#f44336");
		};
		navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
	}

	app.generateTimes = function() {
		var currentdate = new Date(), eventTimesHTML = '', hours = 0,time = '';
		document.getElementById('eventTimes').innerHTML = '';

		var nowMinutes = Math.floor(currentdate.getMinutes()/30)*30;
		// Remove Minutes and Seconds
		currentdate.setTime(currentdate.getTime() - (currentdate.getSeconds()*1000));
		currentdate.setTime(currentdate.getTime() - (currentdate.getMinutes()*60*1000));

		// Add nowMinutes
		currentdate.setTime(currentdate.getTime() + (nowMinutes*60*1000));

		hours = currentdate.getHours();
		time = (hours%12==0?12:hours%12)+':'+('0'+currentdate.getMinutes()).slice(-2)+(hours<12?'am':'pm');
		eventTimesHTML +=
			'<paper-button class="now" onclick="setTime(&#39;'+currentdate+'&#39;,&#39;now&#39;)" dialog-confirm>'+
				'Now'+
			'</paper-button>';
		for (var i = 0; i < 23; i++){
			currentdate.setTime(currentdate.getTime() + (30*60*1000));
			hours = currentdate.getHours();
			time = (hours%12==0?12:hours%12)+':'+('0'+currentdate.getMinutes()).slice(-2)+(hours<12?'am':'pm');
			eventTimesHTML +=
				'<paper-button onclick="setTime(&#39;'+currentdate+'&#39;,&#39;'+time+'&#39;)" dialog-confirm>'+
				time+
				'</paper-button>';
		}
		document.getElementById('eventTimes').innerHTML = eventTimesHTML;
	}

	app.getTimeLength = function(length) {
		var length_in_hours = length/60;
		var length_text = length_in_hours==1?'hour':'hours';
		return length_in_hours+' '+length_text;
	}

	app.resetCurrentPositionReset = function() {
		app.location_status = -1;
		document.getElementById('event_location_progress_label').innerHTML = 'Finding Location Coordinates';
		$('#event_location_progress #activeProgress').css("background-color", "#0f9d58");
		$('#event_location_progress').prop('indeterminate', true);
	}

	app.resetEventAdd = function() {
		app.event_length = 0;
		app.event_date = '';
	}

	app.resetEventLoad = function() {
		app.event_current_title = '';
		app.event_current_length = '';
		app.event_current_promoter = 'loading...';
		app.event_current_time = 'loading...';
		app.event_current_timeto = 'loading...';
	}

	app.show_map = function() {
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

	app.show_map();

/*if ('serviceWorker' in navigator) {navigator.serviceWorker.register('../bower_components/cache-polyfill-master/index.js').then(function(registration) {}).catch(function(err) {console.log('ServiceWorker registration failed: ', err);});}const OFFLINE_CACHE = 'offline';const OFFLINE_URL = '../index.html';self.addEventListener('install', function(event) {const offlineRequest = new Request(OFFLINE_URL);event.waitUntil(fetch(offlineRequest).then(function(response) {return caches.open(OFFLINE_CACHE).then(function(cache) {return cache.put(offlineRequest, response);});}));});self.addEventListener('fetch', function(event) {if (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')) {console.log('Handling fetch event for', event.request.url);event.respondWith(fetch(event.request).catch(function(e) {console.error('Fetch failed; returning offline page instead.', e);return caches.open(OFFLINE_CACHE).then(function(cache) {return cache.match(OFFLINE_URL);});}));}});*/

})(document);

var appCustomJS = true;
