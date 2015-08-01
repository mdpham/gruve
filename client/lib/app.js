//Declare new angular module and dependencies
gruve = angular.module("gruve", ["angular-meteor", "ui.router"]);

//Bootstrap angular
function onReady() {
	angular.bootstrap(document, ["gruve"]);
};
//Platform
if (Meteor.isCordova) {
	angular.element(document.on("deviceready", onReady));
} else {
	angular.element(document).ready(onReady);
};

Meteor.subscribe("playlists");

