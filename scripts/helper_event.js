(function(document) { 'use strict';
	var Helper_Event = class Helper_Event {
		constructor() { }
		event_add() {
			var event = new Object();
			if (!document.getElementById('event-title-paper-input').validate() || app.location_status != 4)
				return;
			event.title = app.event_title_paper_input;
			console.log(event.title);
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
				app.location_latitude = '';
				app.location_longitude = '';
				var geoSuccess = function(position) {
					app.location_latitude = position.coords.latitude;
					app.location_longitude = position.coords.longitude;
					app.location_status = 4;
					map_object = { width: "100%", height: "400px", center: app.event_current_latitude + "_" + app.event_current_longitude, pins: app.event_current_latitude + "_" + app.event_current_longitude + "~" + app.location_latitude + "_" + app.location_longitude };
					document.getElementById("event_map").innerHTML = app.generator.generateHtml("map", map_object);
				}, geoError = function(error) {
					app.location_status = error.code;
					document.getElementById("event_map").innerHTML = 'Failed Loading Map.';
				};
				navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
			}).fail(function(error) {document.getElementById("event_map").innerHTML = 'Failed Loading Map.';});
		}

		events_load() {
			var eventsHTML = "";
			var geoSuccess = function(position) {
				app.location_latitude = position.coords.latitude;
				app.location_longitude = position.coords.longitude;
				BaasBox.loadCollectionWithParams("elop_events", {page: 0, recordsPerPage: BaasBox.pagelength, where: "date_end >= " + (new Date()).getTime() + " AND distance(latitude,longitude,"+app.location_latitude+","+app.location_longitude+") < .5", orderBy: "_creation_date DESC"}).done(function(res) {
					$( "#event_list_area" ).empty();
					eventsHTML = app.helper_event.generate_event_list_HTML(res);
					if (res.length == 0)
						$("#events_load_more_card").remove();
					eventsHTML += app.generator.generateHtml("event_list_end", res.length);
					document.getElementById("event_list_area").innerHTML = eventsHTML;
					app.elop_events_loaded = true;
				}).fail(function(error) {
					$("#event_list_area").empty();
					eventsHTML += app.generator.generateHtml("event_list_no_connection");
					document.getElementById("event_list_area").innerHTML = eventsHTML;
				});
			}, geoError = function(error) {
				$( "#event_list_area" ).empty();
				$( "#event_list_area_more" ).empty();
				document.getElementById("event_list_area").innerHTML = eventsHTML + app.generator.generateHtml("event_list_gps_error", error.code);
				return error;
			};
			navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
		}

		events_load_more() {
			var eventsHTML = "",page = Number(document.getElementById("event_list_area_more").getAttribute("value"))+1;
			document.getElementById("event_list_area_more").setAttribute("value",page);
			BaasBox.loadCollectionWithParams("elop_events", {page: page, recordsPerPage: BaasBox.pagelength, where: "date_end >= " + (new Date()).getTime() + " AND distance(latitude,longitude,"+app.location_latitude+","+app.location_longitude+") < .5", orderBy: "_creation_date DESC"}).done(function(res) {
				eventsHTML = app.helper_event.generate_event_list_HTML(res);
				if (res.length == 0)
					$("#events_load_more_card").remove();
				eventsHTML += app.generator.generateHtml("event_list_end", res.length);
				$("#event_list_area_more").append(eventsHTML);
				app.elop_events_loaded = true;
			}).fail(function(error) {document.getElementById("event_list_area_more").innerHTML = eventsHTML + app.generator.generateHtml("event_list_no_connection");});
		}

		events_load_more_past() {
			var eventsHTML = "",page = Number(document.getElementById("event_list_area_more_past").getAttribute("value"));
			BaasBox.loadCollectionWithParams("elop_events", {page: page, recordsPerPage: BaasBox.pagelength, where: "date_end < " + (new Date()).getTime() + " AND distance(latitude,longitude,"+app.location_latitude+","+app.location_longitude+") < 200.5", orderBy: "_creation_date DESC"}).done(function(res) {
				eventsHTML = app.helper_event.generate_event_list_HTML(res);
				if (res.length == 0){
					$( "#events_load_more_past_card" ).remove();
					eventsHTML += '<paper-card heading="No more past events found">';
					if (!app.isNotLoggedIn) {
						eventsHTML += '<div class="card-content style-scope elop-events">Can&#39;t find the event you want, go ahead and add an event.<br><br></div>';
					} if (app.isNotLoggedIn) {
						eventsHTML += '<div class="card-content style-scope elop-events">You may view and add events if you sign up.</div>';
					} if (!app.isNotLoggedIn) {
						eventsHTML += '<div class="card-actions style-scope elop-events">' +
						'<a data-route="event_add" href="/event_add"><paper-button>Add Event</paper-button></a></div>';
					}
					eventsHTML += '</paper-card>';
				}
				$("#event_list_area_more_past").append(eventsHTML);
				app.elop_events_loaded = true;
			}).fail(function(error) {
				eventElement = document.createElement("paper-card");
				eventElement.setAttribute("heading", "Events Not Found");
				eventElement_content = document.createElement("div");
				eventElement_content.setAttribute("class", "card-content style-scope elop-events");
				eventElement_content.appendChild(document.createTextNode("Was not able to get the events from the connection."));
				eventElement.appendChild(eventElement_content);
				eventElement.getElementsByTagName("paper-material")[0].appendChild(eventElement_content);
				document.getElementById("event_list_area_more_past").appendChild(eventElement);
			});
			document.getElementById("event_list_area_more_past").setAttribute("value",page+1);
		}

		generate_event_list_HTML(eventList) {
			var eventsHTML = "", date = '', date, hours = 0, time = '', timeto = '', length_in_hours = 0, length_text = '';
			for (var i = 0; i < eventList.length; i++){
				date = new Date(eventList[i].date);
				hours = date.getHours();
				time = (hours%12==0?12:hours%12)+':'+('0'+date.getMinutes()).slice(-2)+(hours<12?'am':'pm');
				date.setTime(date.getTime() + (eventList[i].length*60*1000));
				hours = date.getHours();
				timeto = (hours%12==0?12:hours%12)+':'+('0'+date.getMinutes()).slice(-2)+(hours<12?'am':'pm');
				length_in_hours = eventList[i].length/60;
				length_text = length_in_hours == 1 ? ' hour' : ' hours';
				var event_object = {id:eventList[i].id, title:eventList[i].title, year:date.getFullYear(), month:app.util.months[date.getMonth()], date:date.getDate(), time:time, timeto:timeto, length_in_hours:length_in_hours, length_text:length_text, author:eventList[i]._author};
				eventsHTML += app.generator.generateHtml("event_list_event", event_object);
			}
			return eventsHTML;
		}
	}

	app.helper_event = new Helper_Event();
})(document);

var helper_eventJS = true; // Used for util to check if file has been loaded, place at end