gruve.controller("homeCtrl",
	["$scope","$meteor","$http",
	function($scope, $meteor, $http){
		console.log("homecontroller");

		$scope.playlists = $meteor.collection(Playlists);
		$meteor.autorun($scope, function(){
			$meteor.subscribe("playlists").then(function(){
				$scope.playlists = $meteor.collection(Playlists);
				// console.log("playlists:", $scope.playlists);
			});
		});

		var state = {
			playing: false
		};

		var players = {
			all: ".ui.basic.fullscreen.modal.player.playing",
			playing: ".ui.basic.fullscreen.modal.player.playing",
			idle: ".ui.basic.fullscreen.modal.player.idle"
		};

		$scope.togglePlayer = function(){
			console.log(players.playing, $(".ui.basic.fullscreen.modal.player.playing"));
			$(".ui.basic.fullscreen.modal.player").modal("hide");
			if (state.playing) {
				$(players.playing)
					.modal("setting", "closable", false).modal("show");
			} else {
				$(players.idle)
					.modal("setting", "closable", false).modal("show");
			}
		};

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


		var toPositionTime = function(ms) {
			var minutes = ms/1000/60 << 0;
			var seconds = ((ms/1000) % 60) << 0;
			console.log(minutes, seconds);
			seconds = (seconds < 10 ? "0": "") + seconds;
			return minutes + ":" + seconds;
		};
		var updateCurrentTrack = function(track){
			console.log(track);
			track.duration = toPositionTime(track.duration);
			$scope.currentTrack = track;
			//Update artwork in player
			console.log(track.artwork_url);
			$("img.current-artwork").attr("src", !track.artwork_url ? "images/missing.png" : track.artwork_url);
			// $("img.current-waveform").attr("src", track.waveform_url);
		};

		$scope.selectTrack = function(id){
			//SoundManager config for waveform
			soundManager.setup({flashVersion: 9});

			//Get track
			var promise = $http.get(config.api.tracks+id+config.api.credentials);
			promise
				.then(function(result){
					console.log(result)
					var track = result.data;
					console.log(track);
					//Reset sounds
					soundManager.stopAll();
					soundManager.destroySound("current");
					//Play
					soundManager.createSound({
						id: "current",
						url: track.stream_url + "?client_id="+config.client_id,
						whileplaying: function(){
							//sm object
							// console.log(this);
							$(".current-track-progress .current-track-position").text(toPositionTime(this.position));
						}
					}).play();

					//Update to show in player
					updateCurrentTrack(track);
					return track;
				})
				.then(function(track){
					console.log(track, "asd");
					$(players.playing).modal("setting", "closable", false).modal("show");
				});


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