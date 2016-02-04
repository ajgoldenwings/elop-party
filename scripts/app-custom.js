(function(document) {
	'use strict';

	// Initialize App
	if(typeof app.route==='undefined'){app.route='loading';}
	if(typeof app.isNotLoggedIn==='undefined'){app.isNotLoggedIn=true;}
	if(typeof app.isNotLoggedInWithUser==='undefined'){app.isNotLoggedInWithUser=true;}
	if(typeof app.isEventSubmittable==='undefined'){app.isEventSubmittable=false;}
	if(typeof app.aboutHidden==='undefined'){app.aboutHidden=true;}
	if(typeof app.contactHidden==='undefined'){app.contactHidden=true;}
	if(typeof app.contentRightsHidden==='undefined'){app.contentRightsHidden=true;}
	if(typeof app.hideSettingsChangePassword==='undefined'){app.hideSettingsChangePassword=true;}
	if(typeof app.hideSignUp==='undefined'){app.hideSignUp=true;}
	if(typeof app.elop_events_loaded==='undefined'){app.elop_events_loaded=false;}
	if(typeof app.elop_username==='undefined'){app.elop_username='';}
	if(typeof app.permissionStatus_geolocation==='undefined'){app.permissionStatus_geolocation='';}

	// alert('Bro do you have access to the gps?');
	// console.log(navigator);
	// if ("geolocation" in navigator) {
	// 	/* geolocation is available */
	// 	// alert('gps available');
	// } else {
	// 	/* geolocation IS NOT available */
	// 	// alert('gps not available');
	// }

	navigator.permissions.query({name:'geolocation'}).then(function(permissionStatus) {
		app.permissionStatus_geolocation = permissionStatus.state;
		permissionStatus.onchange = function() {app.permissionStatus_geolocation = this.state;};
	}); // "granted", "denied", "prompt"

	var month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

	// Event Add Variables
	app.event_length = 0; // Minutes
	app.location_latitude = 0;
	app.location_longitude = 0;
	app.location_status = -1;
		//	-1: not set
		//	0: unknown error
		//	1: permission denied
		//	2: position unavailable (error response from location provider)
		//	3: timed out
		//	4: nominal

	// Current Event
	if(typeof app.event_current_title==='undefined'){app.event_current_title='';}
	if(typeof app.event_current_latitude==='undefined'){app.event_current_latitude='';}
	if(typeof app.event_current_length==='undefined'){app.event_current_length='';}
	if(typeof app.event_current_longitude==='undefined'){app.event_current_longitude='';}
	if(typeof app.event_current_promoter==='undefined'){app.event_current_promoter='loading...';}
	if(typeof app.event_current_time==='undefined'){app.event_current_time='loading...';}
	if(typeof app.event_current_timeto==='undefined'){app.event_current_timeto='loading...';}

	BaasBox.pagelength = 5;

	/*if (navigator.geolocation) {
		console.log('Geolocation is supported!');
	} else {
		console.log('Geolocation is not supported for this Browser/OS version yet.');
	}*/

	window.onload = function() {};
	window.scroll = function() {};

	app.BaasBox_fetchCurrentUser = function() {
		BaasBox.fetchCurrentUser().done(function(res) {
			/*console.log("res ", res['data']);*/
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
			console.log("No User Signed On.");
			// console.log("error (low risk) ", error);

			/*Debugging*/
			/*app.isNotLoggedIn = false;
			app.isNotLoggedInWithUser = false;
			app.route = 'home';*/
		});
	}
	app.BaasBox_fetchCurrentUser();

	app.event_add = function() {
		if (!document.getElementById('event-title-paper-input').validate() || app.location_status != 4) {
			return;
		}
		var mapElement, date_end;
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
			}).fail(function(error) {
				console.log("error ", error);
			});
		}).fail(function(error) {
			console.log("error ", error);
		});
	};

	app.event_load = function() {
		var mapElement,date,hours,time,timeto,length_in_hours,length_text;
		var eventID = app.params.eventid;
		console.log(app.params);
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

				/*Generate Map*/
				mapElement = document.createElement("iframe");
				mapElement.setAttribute("style", "height:400px;width:100%;");
				mapElement.setAttribute("scrolling", "no");
				mapElement.setAttribute("src","http://dev.virtualearth.net/embeddedMap/v1/ajax/road?zoomLevel=16&center="+app.event_current_latitude+"_"+app.event_current_longitude+"&pushpins="+app.event_current_latitude+"_"+app.event_current_longitude+"~"+app.location_latitude+"_"+app.location_longitude);

				/*Add map to page*/
				document.getElementById("event_map").innerHTML = '';
				document.getElementById("event_map").appendChild(mapElement);
			};
			var geoError = function(error) {
				app.location_status = error.code;
				mapElement.setAttribute("src","http://dev.virtualearth.net/embeddedMap/v1/ajax/road?zoomLevel=16&center="+app.event_current_latitude+"_"+app.event_current_longitude+"&pushpins="+app.event_current_latitude+"_"+app.event_current_longitude);

				/*Add map to page*/
				document.getElementById("event_map").innerHTML = '';
				document.getElementById("event_map").appendChild(mapElement);
			};
			navigator.geolocation.getCurrentPosition(geoSuccess, geoError);

		}).fail(function(error) {
			document.getElementById("event_map").innerHTML = 'Failed Loading Map.';
			console.log("error ", error);
		});
	}

	app.events_load = function() {
		var event_list_length;
		var eventElement, eventElement_content;
		var eventsHTML = '';
		var date = '';
		var hours = 0;
		var time = '';
		var timeto = '';
		var length_in_hours = 0, length_text = '';
		var currentdate = new Date();
		currentdate = currentdate.getTime();

		var map_event_list_length, mapElement;
		var map_event_list_coordinate_string = '';
		var startPos;
		var geoSuccess = function(position) {
			startPos = position;
			app.location_latitude = startPos.coords.latitude;
			app.location_longitude = startPos.coords.longitude;

			BaasBox.loadCollectionWithParams("elop_events", {page: 0, recordsPerPage: BaasBox.pagelength, where: "date_end >= " + currentdate + " AND distance(latitude,longitude,"+app.location_latitude+","+app.location_longitude+") < .5", orderBy: "_creation_date DESC"}).done(function(res) {
				console.log("res ", res);
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

					eventsHTML +=
						'<paper-card heading="'+app.eventList[i].title+'">'+
						'<div class="card-content style-scope elop-events">'+
						'<div class="left" onclick="alert('+date.getFullYear()+')">'+month[date.getMonth()]+' '+date.getDate()+'</div><div class="right"><b>'+time+' to '+timeto+'</b> <small>('+length_in_hours+length_text+')</small></div>'+
						'<div style="clear: both;"></div>'+
						'<small>Promoter: '+app.eventList[i]._author+'</small>'+
						'</div>'+
						'<div class="card-actions style-scope elop-events">'+
						'<a data-route="event" href="/event/'+app.eventList[i].id+'">'+
						'<paper-button>View</paper-button>'+
						'</a>'+
						'</div>'+
						'</paper-card>';
					length_in_hours = 0;
					length_text = '';
				}

				if (event_list_length == 0){
					$("#events_load_more_card").remove();

					if (app.isNotLoggedInWithUser) {
						eventsHTML +=
						'<paper-card heading="Event Listing Area">';
					}
					if (!app.isNotLoggedInWithUser) {
						eventsHTML +=
						'<paper-card heading="No more events found">'+
						'<div class="card-content style-scope elop-events">' +
						'Can&#39;t find the event you want, go ahead and add an event.<br><br>' +
						// 'Look at the Release Map <a href=http://1drv.ms/1JaOI5N" target="_blank" style="color:red;">here</a> to view where Elop Party is going.'+
						'</div>';
					} if (app.isNotLoggedInWithUser) {
						eventsHTML +=
						'<div class="card-content style-scope elop-events">' +
						'This is where you would view events. You may view and add events if you sign up.<br><br>' +
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
					if (!app.isNotLoggedInWithUser) {
						eventsHTML +=
						'<div id="event_list_area_more_past" value="0"></div>' +
						'<paper-card id="events_load_more_past_card">' +
						'<div class="card-content style-scope elop-events aligncenter">' +
						'<a onclick="app.events_load_more_past()">' +
						'<paper-button>View Past Events</paper-button>' +
						'</a>' +
						'</div>' +
						'</paper-card>';
					}
				} else {
					eventsHTML +=
						'<div id="event_list_area_more" value="0"></div>'+
						'<paper-card id="events_load_more_card">'+
						'<div class="card-content style-scope elop-events aligncenter">'+
						'<a onclick="app.events_load_more()">'+
						'<paper-button>Load More</paper-button>'+
						'</a>'+
						'</div>'+
						'</paper-card>';
				}

				document.getElementById("event_list_area").innerHTML = eventsHTML;

				app.elop_events_loaded = true;
			}).fail(function(error) {
				$( "#event_list_area" ).empty();

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
				document.getElementById("event_list_area").appendChild(eventElement);
			});
		};
		var geoError = function(error) {
			console.log('Error occurred. Error code: ' + error.code + '. Message: ' + error.message);

			$( "#event_list_area" ).empty();
			$( "#event_list_area_more" ).empty();

			if (error.code == 1)
			{
				eventsHTML +=
					'<paper-card heading="Error using GPS.">'+
					'<div class="card-content style-scope elop-events">'+
					'You, the current user, disabled access to the GPS. Please enable it. <a href="https://www.google.com/#q=how+to+allow+access+to+current+location" target="_blank" style="color:red;">Help here</a>.'+
					'</div>'+
					'</paper-card>';
			}
			else
			{
				eventsHTML +=
					'<paper-card heading="Error using GPS.">'+
					'<div class="card-content style-scope elop-events">'+
					'Something went wrong getting your current location.'+
					'</div>'+
					'</paper-card>';
			}
			document.getElementById("event_list_area").innerHTML = eventsHTML;
			return error;
		};
		navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
	}

	app.events_load_more = function() {
		var event_list_length;
		var eventElement, eventElement_content;
		var eventsHTML = '';
		var date = '';
		var hours = 0;
		var time = '';
		var timeto = '';
		var length_in_hours = 0, length_text = '';
		var currentdate = new Date();
		currentdate = currentdate.getTime();

		var page = Number(document.getElementById("event_list_area_more").getAttribute("value"))+1;
		document.getElementById("event_list_area_more").setAttribute("value",page);

		BaasBox.loadCollectionWithParams("elop_events", {page: page, recordsPerPage: BaasBox.pagelength, where: "date_end >= " + currentdate + " AND distance(latitude,longitude,"+app.location_latitude+","+app.location_longitude+") < .5", orderBy: "_creation_date DESC"}).done(function(res) {
			/*console.log("res ", res);*/
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

				eventsHTML +=
					'<paper-card heading="'+app.eventList[i].title+'">'+
					'<div class="card-content style-scope elop-events">'+
					'<div class="left" onclick="alert('+date.getFullYear()+')">'+month[date.getMonth()]+' '+date.getDate()+'</div><div class="right"><b>'+time+' to '+timeto+'</b> <small>('+length_in_hours+length_text+')</small></div>'+
					'<div style="clear: both;"></div>'+
					'<small>Promoter: '+app.eventList[i]._author+'</small>'+
					'</div>'+
					'<div class="card-actions style-scope elop-events">'+
					'<a data-route="event" href="/event/'+app.eventList[i].id+'">'+
					'<paper-button>View</paper-button>'+
					'</a>'+
					'</div>'+
					'</paper-card>';
				length_in_hours = 0;
				length_text = '';
			}

			if (event_list_length == 0){
				$( "#events_load_more_card" ).remove();

				eventsHTML +=
					'<paper-card heading="No more events found">';
				if (!app.isNotLoggedInWithUser) {
					eventsHTML +=
					'<div class="card-content style-scope elop-events">' +
					'Can&#39;t find the event you want, go ahead and add an event.<br><br>' +
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
					'</paper-card>'+
					'<div id="event_list_area_more_past" value="0"></div>'+
					'<paper-card id="events_load_more_past_card">'+
					'<div class="card-content style-scope elop-events aligncenter">'+
					'<a onclick="app.events_load_more_past()">'+
					'<paper-button>View Past Events</paper-button>'+
					'</a>'+
					'</div>'+
					'</paper-card>';
			} else {
				eventsHTML +=
					'<div id="event_list_area_more" value="0"></div>'+
					'<paper-card id="events_load_more_card">'+
					'<div class="card-content style-scope elop-events aligncenter">'+
					'<a onclick="app.events_load_more()">'+
					'<paper-button>Load More</paper-button>'+
					'</a>'+
					'</div>'+
					'</paper-card>';
			}

			$("#event_list_area_more").append(eventsHTML);

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
			document.getElementById("event_list_area_more").appendChild(eventElement);
		});
	}

	app.events_load_more_past = function() {
		var event_list_length;
		var eventElement, eventElement_content;
		var eventsHTML = '';
		var date = '';
		var hours = 0;
		var time = '';
		var timeto = '';
		var length_in_hours = 0, length_text = '';
		var currentdate = new Date();
		currentdate = currentdate.getTime();

		var page = Number(document.getElementById("event_list_area_more_past").getAttribute("value"));

		BaasBox.loadCollectionWithParams("elop_events", {page: page, recordsPerPage: BaasBox.pagelength, where: "date_end < " + currentdate + " AND distance(latitude,longitude,"+app.location_latitude+","+app.location_longitude+") < 200.5", orderBy: "_creation_date DESC"}).done(function(res) {
			console.log("res ", res);
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

				eventsHTML +=
					'<paper-card heading="'+app.eventList[i].title+'">'+
					'<div class="card-content style-scope elop-events">'+
					'<div class="left" onclick="alert('+date.getFullYear()+')">'+month[date.getMonth()]+' '+date.getDate()+'</div><div class="right"><b>'+time+' to '+timeto+'</b> <small>('+length_in_hours+length_text+')</small></div>'+
					'<div style="clear: both;"></div>'+
					'<small>Promoter: '+app.eventList[i]._author+'</small>'+
					'</div>'+
					'<div class="card-actions style-scope elop-events">'+
					'<a data-route="event" href="/event/'+app.eventList[i].id+'">'+
					'<paper-button>View</paper-button>'+
					'</a>'+
					'</div>'+
					'</paper-card>';
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
			/*document.getElementById('startLat').innerHTML = startPos.coords.latitude;document.getElementById('startLon').innerHTML = startPos.coords.longitude;*/
			app.location_latitude = startPos.coords.latitude;
			console.log(startPos.coords.latitude);
			app.location_longitude = startPos.coords.longitude;
			console.log(startPos.coords.longitude);
		};
		var geoError = function(error) {
			console.log('Error occurred. Error code: ' + error.code + '. Message: ' + error.message);
			// error.code can be: //	0: unknown error //	1: permission denied //	2: position unavailable (error response from location provider) //	3: timed out
			return error;
		};
		navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
	}

	app.getCurrentPositionForEvent = function() {
		var startPos, mapElement;
		var geoSuccess = function(position) {
			startPos = position;
			$('#event_location_progress').removeAttr('indeterminate');
			document.getElementById('event_location_progress').value = '100';
			document.getElementById('event_location_progress_label').innerHTML = 'Location Found, Using current location for event';
			app.location_latitude = startPos.coords.latitude;
			/*console.log("latitude: " + startPos.coords.latitude);*/
			app.location_longitude = startPos.coords.longitude;
			/*console.log("longitude: " + startPos.coords.longitude);*/
			app.location_status = 4;

			// Show map in event_add
			mapElement = document.createElement("iframe");
			mapElement.setAttribute("style", "height:350px;width:100%;");
			mapElement.setAttribute("scrolling", "no");
			mapElement.setAttribute("src","http://dev.virtualearth.net/embeddedMap/v1/ajax/road?zoomLevel=16&center="+app.location_latitude+"_"+app.location_longitude+"&pushpins="+app.location_latitude+"_"+app.location_longitude);
			document.getElementById("event_add_location").innerHTML = '';
			document.getElementById("event_add_location").appendChild(mapElement);

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
		var currentdate = new Date();
		var eventTimesHTML = '';
		var hours = 0;
		var time = '';
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
			/*console.log(i+': '+currentdate);*/
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
		var map_event_list_length, mapElement;
		var map_event_list_coordinate_string = '';
		var startPos;
		var eventsHTML;
		var geoSuccess = function(position) {
			startPos = position;
			app.location_latitude = startPos.coords.latitude;
			app.location_longitude = startPos.coords.longitude;
			console.log(app.location_latitude + ' ' + app.location_longitude )
			BaasBox.loadCollectionWithParams("elop_events", {where:"distance(latitude,longitude,"+app.location_latitude+","+app.location_longitude+") < .5"}).done(function(res) {
				/*console.log("res ", res);*/
				app.mapEventList = res;

				map_event_list_length = app.mapEventList.length;
				map_event_list_coordinate_string += app.location_latitude + '_' + app.location_longitude
				for (var i = 0; i < map_event_list_length; i++){
					map_event_list_coordinate_string += '~' + app.mapEventList[i].latitude + '_' + app.mapEventList[i].longitude;
				}
				/*console.log(map_event_list_coordinate_string)*/
				/*Generate Map*/
				mapElement = document.createElement("iframe");
				mapElement.setAttribute("style", "height:400px;width:100%;");
				mapElement.setAttribute("scrolling", "no");
				mapElement.setAttribute("src","http://dev.virtualearth.net/embeddedMap/v1/ajax/road?zoomLevel=16&center="+app.location_latitude+"_"+app.location_longitude+"&pushpins="+map_event_list_coordinate_string);

				/*Add map to page*/
				document.getElementById("map_event_list").innerHTML = '';
				document.getElementById("map_event_list").appendChild(mapElement);
			}).fail(function(error) {
				console.log("error ", error);
			});
		};
		var geoError = function(error) {
			console.log('Error occurred. Error code: ' + error.code + '. Message: ' + error.message);
			// error.code can be: //	0: unknown error //	1: permission denied //	2: position unavailable (error response from location provider) //	3: timed out

			$( "#map_event_list" ).empty();

			if (error.code == 1) {
				eventsHTML +=
					'<paper-card heading="Error using GPS.">'+
					'<div class="card-content style-scope elop-events">'+
					'You, the current user, disabled access to the GPS. Please enable it. <a href="https://www.google.com/#q=how+to+allow+access+to+current+location" target="_blank" style="color:red;">Help here</a>.'+
					'</div>'+
					'</paper-card>';
			} else {
				eventsHTML +=
					'<paper-card heading="Error using GPS.">'+
					'<div class="card-content style-scope elop-events">'+
					'Something went wrong getting your current location.'+
					'</div>'+
					'</paper-card>';
			}
			document.getElementById("map_event_list").innerHTML = eventsHTML;

			return error;
		};
		navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
	}

	app.show_map();

	/*if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('../bower_components/cache-polyfill-master/index.js').then(function(registration) {
		}).catch(function(err) {
			console.log('ServiceWorker registration failed: ', err);
		});
	}
	const OFFLINE_CACHE = 'offline';
	const OFFLINE_URL = '../index.html';
	self.addEventListener('install', function(event) {
		const offlineRequest = new Request(OFFLINE_URL);
		event.waitUntil(
			fetch(offlineRequest).then(function(response) {
				return caches.open(OFFLINE_CACHE).then(function(cache) {
					return cache.put(offlineRequest, response);
				});
			})
		);
	});
	self.addEventListener('fetch', function(event) {
		if (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')) {
			console.log('Handling fetch event for', event.request.url);
			event.respondWith(
				fetch(event.request).catch(function(e) {
					console.error('Fetch failed; returning offline page instead.', e);
						return caches.open(OFFLINE_CACHE).then(function(cache) {
						return cache.match(OFFLINE_URL);
					});
				})
			);
		}
	});*/

})(document);

