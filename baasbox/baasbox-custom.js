BaasBox.setEndPoint("https://baasbox.elopparty.com");

BaasBox.appcode = "1234567890";

$("#login").click(function() {
	alert("login");
	BaasBox.login("asdfasdfasdf", "asdf")
		.done(function (user) {
		console.log("Logged in ", user);
	})
		.fail(function (err) {
		console.log("error ", err);
	})
});

$("#logout").click(function () {
	BaasBox.logout()
		.done(function (res) {
		console.log(res);
	})
		.fail(function (error) {
		console.log("error ", error);
	})
});

$("#signup").click(function() {
	BaasBox.signup("asdfasdfasdf", "asdf")
		.done(function (res) {
		console.log("signup ", res);
	})
		.fail(function (error) {
		console.log("error ", error);
	})
});

$("#signupWithParams").click(function() {
	BaasBox.signup("test2", "test2", {"visibleByRegisteredUsers": {"email" : "test@test.com"}})
		.done(function (res) {
		console.log("signup ", res);
	})
		.fail(function (error) {
		console.log("error ", error);
	})
});

$("#loadCollection").click(function() {
	BaasBox.loadCollection("test")
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#loadCollectionWithParams").click(function() {
	BaasBox.loadCollectionWithParams("test", {where: "color='red'"})
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#loadObject").click(function() {
	BaasBox.loadObject("test", "9e2921b0-cb60-4fc6-aa9b-28f4a8df4f0e")
		.done(function(res) {
		console.log("res ", res['data']);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#save").click(function () {
	var o = new Object();
	o.list = ["margherita", "capricciosa"];
	o.address = "Prince Street 100, New York, NY";
	BaasBox.save(o, "test")
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#update").click(function () {
	BaasBox.loadCollection("test")
		.done(function(res) {
		objectId = res[0].id;
		console.log("updating object with id ", objectId)
		BaasBox.updateField(objectId, "test", "address", "new address")
			.done(function(res) {
			console.log("res ", res);
		})
			.fail(function(error) {
			console.log("error ", error);
		})
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#delete").click(function () {
	BaasBox.loadCollection("test")
		.done(function(res) {
		objectId = res[0].id;
		console.log("deleting object with id ", objectId)
		BaasBox.deleteObject(objectId, "test")
			.done(function(res) {
			console.log("res ", res);
		})
			.fail(function(error) {
			console.log("error ", error);
		})
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#loadJSONAsset").click(function() {
	BaasBox.loadAssetData("test")
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#getImageURI").click(function () {
	BaasBox.getImageURI("testimage", {'resizeId' : 1})
		.done(function(res) {
		console.log("image URI is ", res['data']);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#fetchCurrentUser").click(function () {
	BaasBox.fetchCurrentUser()
		.done(function(res) {
		console.log("res ", res['data']);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#fetchUser").click(function () {
	BaasBox.fetchUserProfile("test2")
		.done(function(res) {
		console.log("res ", res['data']);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#fetchUsers").click(function () {
	BaasBox.fetchUsers()
		.done(function(res) {
		console.log("res ", res['data']);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#fetchUsersWithParams").click(function () {
	BaasBox.fetchUsers({"where": "user.name='test2'"})
		.done(function(res) {
		console.log("res ", res['data']);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#updateUserProfile").click(function () {
	BaasBox.updateUserProfile({"visibleByTheUser": {"address" : "Prince St, NY"}})
		.done(function(res) {
		console.log("res ", res['data']);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#changePassword").click(function () {
	BaasBox.changePassword("test", "newtest")
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#resetPassword").click(function () {
	BaasBox.resetPassword()
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#followUser").click(function () {
	BaasBox.followUser("test2")
		.done(function(res) {
		console.log("res ", res['data']);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#unfollowUser").click(function () {
	BaasBox.unfollowUser("test2")
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#fetchFollowers").click(function () {
	BaasBox.fetchFollowers("test2")
		.done(function(res) {
		console.log("res ", res['data']);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#fetchFollowing").click(function () {
	BaasBox.fetchFollowing("test")
		.done(function(res) {
		console.log("res ", res['data']);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#fetchObjectsCount").click(function () {
	BaasBox.fetchObjectsCount("test")
		.done(function(res) {
		console.log("res ", res['data']['count']);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#grantUserAccessToObject").click(function () {
	BaasBox.grantUserAccessToObject("test", "f5136a59-83a6-4506-b25d-a0a2ab7d12a7", BaasBox.READ_PERMISSION, "test2")
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#revokeUserAccessToObject").click(function () {
	BaasBox.revokeUserAccessToObject("test", "7a3ed177-f4e8-46ad-b857-75886228cc13", BaasBox.ALL_PERMISSION, "test2")
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#grantRoleAccessToObject").click(function () {
	BaasBox.grantRoleAccessToObject("test", "7a3ed177-f4e8-46ad-b857-75886228cc13", BaasBox.READ_PERMISSION, BaasBox.REGISTERED_ROLE)
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#revokeRoleAccessToObject").click(function () {
	BaasBox.revokeRoleAccessToObject("test", "7a3ed177-f4e8-46ad-b857-75886228cc13", BaasBox.READ_PERMISSION, BaasBox.REGISTERED_ROLE)
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#sendPush").click(function () {
	// Assumes the app has been compiled with a sound file named 'sound.aiff' in the bundle
	BaasBox.sendPushNotification({"message" : "hi there", "users" : ["john", "jane"], "badge" : 1, "sound" : "sound.aiff"})
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#createCollection").click(function () {
	BaasBox.createCollection("ciao")
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#deleteCollection").click(function () {
	BaasBox.deleteCollection("ciao")
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#uploadForm").submit(function(e) {
	e.preventDefault();
	var formObj = $(this);
	var formData = new FormData(this);
	BaasBox.uploadFile(formData)
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#sub").click(function() {
	$("#uploadForm").submit()
});

$("#fetchFile").click(function () {
	BaasBox.fetchFile("0d7c2469-71e0-447b-a524-a8ecd0bf4a77")
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#fetchFileDetails").click(function () {
	BaasBox.fetchFileDetails("7491d26b-b730-40e7-9587-c0c3f58193c7")
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#deleteFile").click(function () {
	BaasBox.deleteFile("0d7c2469-71e0-447b-a524-a8ecd0bf4a77")
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error)
			  {
		console.log("error ", error);
	})
});

$("#grantUserAccessToFile").click(function () {
	BaasBox.grantUserAccessToFile("7491d26b-b730-40e7-9587-c0c3f58193c7", BaasBox.READ_PERMISSION, "test2")
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#revokeUserAccessToFile").click(function () {
	BaasBox.revokeUserAccessToFile("7491d26b-b730-40e7-9587-c0c3f58193c7", BaasBox.READ_PERMISSION, "test2")
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#grantRoleAccessToFile").click(function () {
	BaasBox.grantRoleAccessToFile("7491d26b-b730-40e7-9587-c0c3f58193c7", BaasBox.READ_PERMISSION, BaasBox.REGISTERED_ROLE)
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

$("#revokeRoleAccessToFile").click(function () {
	BaasBox.revokeRoleAccessToFile("7491d26b-b730-40e7-9587-c0c3f58193c7", BaasBox.READ_PERMISSION, BaasBox.REGISTERED_ROLE)
		.done(function(res) {
		console.log("res ", res);
	})
		.fail(function(error) {
		console.log("error ", error);
	})
});

var baasboxCustomJS = true;