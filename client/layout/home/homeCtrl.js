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
				// //Waveform
				// $("#waveform-canvas").empty();
				// var waveform = new Waveform({
				// 	container: document.getElementById("waveform-canvas"),
				// 	innerColor: "#333"
				// });
				// waveform.dataFromSoundCloudTrack(track);

				//Stream
				// SC.stream(track.uri, {}, function(sound){
				// 	console.log("sound:", sound);
				// 	//Stop playing track
				// 	if ($scope.selectedTrack) {
				// 		$scope.selectedTrack.stop();
				// 	};
				// 	//Handle sound object
				// 	$scope.selectedTrack = sound;
				// 	console.log($scope.selectedTrack);
				// 	//Progress
				// 	$scope.selectedTrack.play();
				// });
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