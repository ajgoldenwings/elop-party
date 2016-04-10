(function(document) {
	'use strict';

	var Helper_User = class Helper_User {
		constructor() { }

		BaasBox_fetchCurrentUser() {
			app.isNotLoggedIn = false;
			BaasBox.fetchCurrentUser().done(function(res) {
				app.elop_username = res['data'].user.name;
				if (app.route == 'signon' || app.route == 'loading') {
					if (!app.elop_events_loaded) {
						app.helper_event.events_load();
					}
					app.route = 'events';
				}
				app.isNotLoggedIn = false;
			}).fail(function(error) {
				app.route = 'signon';
				app.isNotLoggedIn = true;
			});
		}

		change_password() {
			if (app.change_password_paper_input != app.change_verify_password_paper_input || app.change_password_paper_input == '' || app.change_verify_password_paper_input == '' || app.verify_password_paper_input == '') {
				if (!(app.change_password_paper_input == '' && app.change_verify_password_paper_input == '' && app.verify_password_paper_input == ''))
					alert("Verify old and new passwords");
			} else {
				app.route = 'loading';
				BaasBox.changePassword(app.verify_password_paper_input, app.change_password_paper_input).done(function(res) {
					app.route = 'settings';
					alert("Password changed");
				}).fail(function(error) {
					alert("Passwords do not match");
				});
			}
			app.verify_password_paper_input = '';
			app.change_password_paper_input = '';
			app.change_verify_password_paper_input = '';
		}

		login() {
			BaasBox.login(app.signon_username_paper_input, app.signon_password_paper_input).done(function (user) {
				app.isNotLoggedIn = false;
				app.signon_username_paper_input = '';
				app.signon_password_paper_input = '';
				if (!app.elop_events_loaded) {
					app.helper_event.events_load();
				}
				app.route = 'events';
				history.pushState('', 'Elop Party Events', '#!/events');

				app.helper_user.BaasBox_fetchCurrentUser();
			}).fail(function (err) {
				console.log("error ", err);
				app.isNotLoggedIn = true;
				app.signon_username_paper_input = '';
				app.signon_password_paper_input = '';
				app.route = 'signon';
			});
		}

		logout() {
			document.getElementById("event_list_area").innerHTML = '<paper-card heading="Loading..."><div class="card-content">Please wait for events to load.</div></paper-card>'
			app.elop_events_loaded = false;

			BaasBox.logout().done(function (res) {
			}).fail(function (error) {
			});
			app.isNotLoggedIn = true;
		}

		signup() {
			if (app.signup_password_paper_input != app.signup_verify_password_paper_input || app.signup_password_paper_input == '' || app.signup_verify_password_paper_input == '') {
				app.route = 'signon';
			} else {
				BaasBox.signup(app.signup_username_paper_input, app.signup_password_paper_input).done(function (res) {
					app.signup_password_paper_input = ''; // Remove Passwords
					app.signup_verify_password_paper_input = '';
					app.isNotLoggedIn = false;
					if (!app.elop_events_loaded) {
						app.helper_event.events_load();
					}
					app.helper_user.BaasBox_fetchCurrentUser();
					app.route = 'events';
				}).fail(function (error) {
					app.signup_password_paper_input = ''; // Remove Passwords
					app.signup_verify_password_paper_input = '';
					app.isNotLoggedIn = true;
					app.route = 'signon';
				});
			}
		}
	}

	app.helper_user = new Helper_User();

})(document);

var helper_userJS = true; // Used for util to check if file has been loaded, place at end