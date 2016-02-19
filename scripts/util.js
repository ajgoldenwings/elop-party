
(function(document) {
	'use strict';

	var Utility = class Utility {
		constructor() {console.log("!Creating Utility"); }
		loadPages() {
			console.log("Just testing here");
		}
	};

	var util = new Utility();
	util.loadPages();

	// util.loadPages();

})(document);
