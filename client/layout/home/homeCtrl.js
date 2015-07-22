gruve.controller("homeCtrl",
	["$scope","$meteor",
	function($scope, $meteor){
		console.log("homecontroller");
		$scope.test = "TEST";

		$scope.playlists = $meteor.collection(Playlists);
		$meteor.autorun($scope, function(){
			$meteor.subscribe("playlists").then(function(){
				$scope.playlists = $meteor.collection(Playlists);
				console.log("playlists:", $scope.playlists);
			});
		});

		$scope.selectPlaylist = function(id) {
			console.log($scope.playlists, id);
			var result = _.chain($scope.playlists)
				.where({'id': id})
				.first()
				.value();
			console.log("result", result);
			$scope.tracks = result.tracks;
		};

		$scope.playTrack = function(id){
			SC.stream("/tracks/"+id, function(sound){
				sound.play();
			});
		};
	}
])