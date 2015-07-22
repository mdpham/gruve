gruve.controller("homeCtrl",
	["$scope","$meteor",
	function($scope, $meteor){
		console.log("homecontroller");
		$scope.test = "TEST";

		$scope.playlists = $meteor.collection(Playlists);
		$meteor.autorun($scope, function(){
			$meteor.subscribe("playlists").then(function(){
				$scope.playlists = $meteor.collection(Playlists);
				// console.log("playlists:", $scope.playlists);
			});
		});

		$scope.selectPlaylist = function(id) {
			// console.log($scope.playlists, id);
			var result = _.chain($scope.playlists)
				.where({'id': id})
				.first()
				.value();
			console.log("result", result);
			$scope.tracks = result.tracks;
		};

		$scope.playTrack = function(id){
			SC.stream("/tracks/"+id, {
				onfinish: function(){
					console.log("FINISHED PLAYING TRACK ", id);
				},
				onload: function(){
					console.log("LOADED ", id);
				},
				onplay: function(){
					console.log("PALYED", id);
				}
			}, function(sound){
				console.log("sound:", sound);
				//Stop playing track
				if ($scope.selectedTrack) {
					$scope.selectedTrack.stop();
				};
				//Load and play
				$scope.selectedTrack = sound;
				$scope.selectedTrack.play();
			});
		};

		$scope.togglePlay = function(){
			if (!$scope.selectedTrack) {
				console.log("no selectedTrack");
				return;
			}
			var state = $scope.selectedTrack.getState();
			switch (state) {
				case "playing":
					$scope.selectedTrack.pause();
					break;
				case "paused":
					$scope.selectedTrack.pause();
					break;
				default:
					console.log("selectedTrack not playing/paused", state);
			};
		};
	}
])