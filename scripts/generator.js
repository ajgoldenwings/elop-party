(function(document) {
	'use strict';

	var Generator = class Generator {
		constructor() { }
		generateHtml(type, object) {
			var htmlString = "";
			if     (type=="event_list_end"          ){htmlString+=this.event_list_end(object)          }
			else if(type=="event_list_event"        ){htmlString+=this.event_list_event(object)        }
			else if(type=="event_list_gps_error"    ){htmlString+=this.event_list_gps_error(object)    }
			else if(type=="event_list_no_connection"){htmlString+=this.event_list_no_connection(object)}
			else if(type=="map"                     ){htmlString+=this.map(object)                     }
			return htmlString;
		}

		event_list_end(object) {
			var htmlString = ""
			if (object == 0) htmlString += '<paper-card heading="No more events found"><div class="card-content style-scope elop-events">Can&#39;t find the event you want, go ahead and add an event.<br><br></div><div class="card-actions style-scope elop-events"><a data-route="event_add" href="/event_add"><paper-button>Add Event</paper-button></a></div></paper-card><div id="event_list_area_more_past" value="0"></div><paper-card id="events_load_more_past_card">';
			else htmlString += '<div id="event_list_area_more" value="0"></div><paper-card id="events_load_more_card">';
			htmlString += '<div class="card-content style-scope elop-events aligncenter">';
			if (object == 0) htmlString += '<a onclick="app.helper_event.events_load_more_past()"><paper-button>View Past Events</paper-button>';
			else htmlString += '<a onclick="app.helper_event.events_load_more()"><paper-button>Load More</paper-button>';
			htmlString += '</a></div></paper-card>';
			return htmlString;
		}
		event_list_event(object) {
			return '<paper-card heading="'+object.title+'"><div class="card-content style-scope elop-events"><div class="left" onclick="alert('+object.date+')">'+object.month+' '+object.date+'</div><div class="right"><b>'+object.time+' to '+object.timeto+'</b> <small>('+object.length_in_hours+object.length_text+')</small></div><div style="clear: both;"></div><small>Promoter: '+object.author+'</small></div><div class="card-actions style-scope elop-events"><a data-route="event" href="/event/'+object.id+'"><paper-button>View</paper-button></a></div></paper-card>';
		}
		event_list_gps_error(object) {
			var htmlString = '<paper-card heading="Error using GPS."><div class="card-content style-scope elop-events">';
			if (object == 1) htmlString += 'You, the current user, disabled access to the GPS. Please enable it. <a href="https://www.google.com/#q=how+to+allow+access+to+current+location" target="_blank" style="color:red;">Help here</a>.';
			else htmlString += 'Something went wrong getting your current location.';
			htmlString += '</div></paper-card>';
			return htmlString;
		}
		event_list_no_connection(object) {
			return '<paper-card heading="Events Not Found"><div class="card-content style-scope elop-events">Was not able to get the events from the connection.</div></paper-card>';
		}
		map(object) {
			return '<iframe style="width:'+object.width+';height:'+object.height+'" scrolling="no" src="http://dev.virtualearth.net/embeddedMap/v1/ajax/road?zoomLevel=16&amp;center='+object.center+'&amp;pushpins='+object.pins+'"></iframe>';
		}
	}

	app.generator = new Generator();

})(document);

var generatorJS = true; // Used for util to check if file has been loaded, place at end