(function(document) {
	'use strict';

	var Helper_User = class Helper_User {
		constructor() { }

		BaasBox_fetchCurrentUser() {
			BaasBox.fetchCurrentUser().done(function(res) {
				app.elop_username = res['data'].user.name;
				if (app.route == 'signon' || app.route == 'loading') {
					if (!app.elop_events_loaded) {
						app.helper_event.events_load();
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

	}

	app.helper_user = new Helper_User();

})(document);

var helper_userJS = true; // Used for util to check if file has been loaded, place at end