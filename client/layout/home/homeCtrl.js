gruve.controller("homeCtrl",
	["$scope","$meteor",
	function($scope, $meteor){
		console.log("homecontroller");
		$scope.init = function(){
		};


		$scope.playlists = $meteor.collection(Playlists);
		$meteor.autorun($scope, function(){
			$meteor.subscribe("playlists").then(function(){
				$scope.playlists = $meteor.collection(Playlists);
				// console.log("playlists:", $scope.playlists);
			});
		});

		$scope.togglePlaylists = function(){
			$("div.playlist-container").transition("slide down");
		};
		$scope.selectPlaylist = function(id) {
			// console.log($scope.playlists, id);
			var result = _.chain($scope.playlists)
				.where({'id': id})
				.first()
				.value();
			console.log("result", result);
			_.each(result.tracks, function(t){
				if (t.artwork_url == null) {t.artwork_url = "images/missing.png"}
			});
			$scope.tracks = result.tracks;

			//Hide playlists
			$scope.togglePlaylists();
		};

		$scope.playState = "pick a song";
		$scope.playTrack = function(id){
			SC.get("/tracks/"+id, function(track){
				console.log(track);
				//Reset sounds
				soundManager.stopAll();
				soundManager.destroySound("current");
				//Play
				soundManager.createSound({
					id: "current",
					url: track.stream_url + "?client_id="+config.client_id,
					whileplaying: function(){
						console.log(this);
						console.log(this.position/this.durationEstimate);
					}
				}).play();

			})
		};

		$scope.togglePlay = function(){
			// if (!$scope.selectedTrack) {
			// 	console.log("no selectedTrack");
			// 	return;
			// }
			var state = soundManager.getSoundById("current").playState;
			console.log(state);
			switch (state) {
				case "playing":
					soundManager.getSoundById("current").pause();
					break;
				case "paused":
					soundManager.getSoundById("current").play();
					break;
				default:
					console.log("selectedTrack not playing/paused", state);
			};
		};
	}
])