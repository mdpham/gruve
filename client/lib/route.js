//Handle rejected promise in 'resolve' object in state change
angular.module("gruve").run(
	["$rootScope", "$state",
	function($rootScope, $state) {
		$rootScope.$on("$stateChangeError", 
			function(event, toState, toParams, fromState, fromParams, error) {
				//Catch error thrown when $meteor.requireUser promise is rejected
				if (error === "AUTH_REQUIRED") {
					//Redirect home
					$state.go("home");
				}
			}
		)}
]);

//Configure routes
angular.module("gruve").config(
	["$urlRouterProvider", "$stateProvider", "$locationProvider",
	//Define application routes
	function($urlRouterProvider, $stateProvider, $locationProvider) {
		//Set url to look regular
		$locationProvider.html5Mode(true);

		//Catchall redirection 
		$urlRouterProvider.otherwise("/home");

		//Routes
		$stateProvider
			//Home
			.state("home", {
				url: "/home",
				templateUrl: "client/layout/home/home.ng.html",
				controller: "homeCtrl"
			})
	}
]);