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
			SC.get("/tracks/"+id, function(track){
				//Waveform
				$("#waveform-canvas").empty();
				var waveform = new Waveform({
					container: document.getElementById("waveform-canvas"),
					innerColor: "#333"
				});
				waveform.dataFromSoundCloudTrack(track);

				//Stream
				SC.stream(track.uri, {}, function(sound){
					console.log("sound:", sound);
					//Stop playing track
					if ($scope.selectedTrack) {
						$scope.selectedTrack.stop();
					};
					//Handle sound object
					$scope.selectedTrack = sound;
					console.log($scope.selectedTrack);
					//Progress
					$scope.selectedTrack.play();
				});

			})
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