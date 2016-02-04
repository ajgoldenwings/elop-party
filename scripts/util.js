
(function(document) {
	'use strict';

	var Utility = class Utility {
		constructor() {console.log("!Creating Utility"); }
		loadPages() {
			alert("Just testing here");
		}
	};

	var util = new Utility();
	util.loadPages();

	// util.loadPages();

})(document);
