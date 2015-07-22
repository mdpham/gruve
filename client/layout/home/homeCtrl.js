gruve.controller("homeCtrl",
	["$scope","$meteor",
	function($scope, $meteor){
		console.log("homecontroller");
		$scope.test = "TEST";

		$meteor.autorun($scope, function(){
			$meteor.subscribe("songs").then(function(){
				$scope.songs = $meteor.collection(Songs);
				console.log("songs:", $scope.songs);
			})
		})
	}
])