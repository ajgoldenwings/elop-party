(function(document) {
	'use strict';

	var Utility = class Utility {
		constructor() { this.pageLoadChecks();}
		pageLoadChecks() {
			var files = 0;
			typeof appJS           === 'undefined'?console.error("Undefined<-appJS"          ):files++;
			typeof appCustomJS     === 'undefined'?console.error("Undefined<-appCustomJS"    ):files++;
			typeof baasboxCustomJS === 'undefined'?console.error("Undefined<-baasboxCustomJS"):files++;
			typeof generatorJS     === 'undefined'?console.error("Undefined<-generatorJS"    ):files++;
			console.log(files + ' files loaded')
		}
	};

	var util = new Utility();

})(document);
