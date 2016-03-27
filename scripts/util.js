(function(document) {
	'use strict';

	var Utility = class Utility {
		constructor() {
			this.pageLoadChecks();
			this.months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
		}

		pageLoadChecks() {
			var files = 0;
			typeof appJS           === 'undefined'?console.error("Undefined: appJS"          ):files++;
			typeof appCustomJS     === 'undefined'?console.error("Undefined: appCustomJS"    ):files++;
			typeof baasboxCustomJS === 'undefined'?console.error("Undefined: baasboxCustomJS"):files++;
			typeof helper_eventJS  === 'undefined'?console.error("Undefined: helper_eventJS" ):files++;
			typeof helper_userJS   === 'undefined'?console.error("Undefined: helper_userJS"  ):files++;
			typeof helper_mapJS    === 'undefined'?console.error("Undefined: helper_mapJS"   ):files++;
			typeof generatorJS     === 'undefined'?console.error("Undefined: generatorJS"    ):files++;
		}

		startApp() {
			console.log("Starting app");
		}
	};

	app.util = new Utility();
	app.util.startApp();

})(document);
