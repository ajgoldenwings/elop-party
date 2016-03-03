(function(document) {
	'use strict';

	var Helper_Event = class Helper_Event {
		constructor() { }

		event_add() {
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
					app.helper_event.events_load();
				}).fail(function(error) {console.log("error ", error)});
			}).fail(function(error) {console.log("error ", error)});
		};

		event_load() {
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

		events_load() {
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

						var event_object = {id:app.eventList[i].id, title:app.eventList[i].title, year:date.getFullYear(), month:app.util.months[date.getMonth()], date:date.getDate(), time:time, timeto:timeto, length_in_hours:length_in_hours, length_text:length_text, author:app.eventList[i]._author};
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

		events_load_more() {
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

		events_load_more_past() {
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

					var event_object = {id:app.eventList[i].id, title:app.eventList[i].title, year:date.getFullYear(), month:app.util.months[date.getMonth()], date:date.getDate(), time:time, timeto:timeto, length_in_hours:length_in_hours, length_text:length_text, author:app.eventList[i]._author};
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
	}

	app.helper_event = new Helper_Event();

})(document);

var helper_eventJS = true; // Used for util to check if file has been loaded, place at end