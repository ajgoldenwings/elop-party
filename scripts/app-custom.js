var appCustomJS = true;

(function(document) {
	'use strict';

	// Initialize App
	// if(typeof app.route==='undefined'){app.route='loading';}// if(typeof app.isNotLoggedIn==='undefined'){app.isNotLoggedIn=true;}// if(typeof app.isEventSubmittable==='undefined'){app.isEventSubmittable=false;}// if(typeof app.aboutHidden==='undefined'){app.aboutHidden=true;}// if(typeof app.contactHidden==='undefined'){app.contactHidden=true;}// if(typeof app.contentRightsHidden==='undefined'){app.contentRightsHidden=true;}// if(typeof app.hideSettingsChangePassword==='undefined'){app.hideSettingsChangePassword=true;}// if(typeof app.hideSignUp==='undefined'){app.hideSignUp=true;}// if(typeof app.elop_events_loaded==='undefined'){app.elop_events_loaded=false;}// if(typeof app.elop_username==='undefined'){app.elop_username='';}// if(typeof app.permissionStatus_geolocation==='undefined'){app.permissionStatus_geolocation='';}

	// navigator.permissions.query({name:'geolocation'}).then(function(permissionStatus) {
	// 	app.permissionStatus_geolocation = permissionStatus.state;
	// 	permissionStatus.onchange = function() {app.permissionStatus_geolocation = this.state;};
	// }); // "granted", "denied", "prompt"

	// Event Add Variables
	app.event_length = 0; // Minutes
	app.location_latitude = 0;
	app.location_longitude = 0;
	app.location_status = -1; // -1: not set, 0: unknown error, 1: permission denied, 2: position unavailable (error response from location provider), 3: timed out, 4: nominal

	BaasBox.pagelength = 5;

	app.helper_user.BaasBox_fetchCurrentUser();

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

	app.helper_map.show_map();

/*if ('serviceWorker' in navigator) {navigator.serviceWorker.register('../bower_components/cache-polyfill-master/index.js').then(function(registration) {}).catch(function(err) {console.log('ServiceWorker registration failed: ', err);});}const OFFLINE_CACHE = 'offline';const OFFLINE_URL = '../index.html';self.addEventListener('install', function(event) {const offlineRequest = new Request(OFFLINE_URL);event.waitUntil(fetch(offlineRequest).then(function(response) {return caches.open(OFFLINE_CACHE).then(function(cache) {return cache.put(offlineRequest, response);});}));});self.addEventListener('fetch', function(event) {if (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')) {console.log('Handling fetch event for', event.request.url);event.respondWith(fetch(event.request).catch(function(e) {console.error('Fetch failed; returning offline page instead.', e);return caches.open(OFFLINE_CACHE).then(function(cache) {return cache.match(OFFLINE_URL);});}));}});*/

})(document);
