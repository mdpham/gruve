gruve.controller("homeCtrl",
	["$scope","$meteor","$http","gruveState",
	function($scope, $meteor, $http, gruveState){
		scope = $scope;

		//Playlists
		scope.playlists = $meteor.collection(Playlists);
		$meteor.autorun(scope, function(){
			$meteor.subscribe("playlists").then(function(){
				scope.playlists = $meteor.collection(Playlists);
				// console.log("playlists:", scope.playlists);
			});
		});

		//STATE WATCHING//
		//State starts with no playing and no player open
		scope.gruveState = new gruveState(false, "stop", false);
		//	On $digest(); State variable in scope.state is changed and then $digest() called
		//Playing
		// scope.$watch(
		// 	function(){return scope.gruveState.getPlayingState()},
		// 	function(newPlayingState, oldPlayingState){
		// 		switch(newPlayingState) {
		// 			//Song is playing
		// 			case "play":
		// 				console.log(scope.currentTrack);
		// 				break;
		// 			//Song is paused
		// 			case "plause":
		// 				break;
		// 			//Song is stopped
		// 			case "stop":
		// 				break;
		// 		}	
		// 	}
		// );

		var players = {
			all: ".ui.basic.fullscreen.modal.player.playing",
			playing: ".ui.basic.fullscreen.modal.player.playing",
			idle: ".ui.basic.fullscreen.modal.player.idle"
		};

		scope.togglePlayer = function(){
			//Start Discovering
			$(players.all).modal("hide");
			if (!scope.gruveState.getAudioState()) {
				$(players.idle).modal("show");
			} else {
				$(players.playing).modal("show");
			}
		};

		scope.togglePlaylists = function(){
			// $("div.playlist-container").transition("slide down");
			$(".sidebar.playlists-topbar")
				  .sidebar('setting', 'transition', 'overlay')
				  .sidebar('toggle')
		};
		scope.selectPlaylist = function(id) {
			$meteor.call("fetchPlaylist", id)
			//Returns playlist object
				.then(function(playlist){
					var tracks = playlist.tracks;
					_.each(tracks, function(t){
						console.log(t.artwork_url);

						if (t.artwork_url == null) {t.missing_artwork_url = config.assets.missingPNG;}
						else {t.artwork_url = t.artwork_url.replace("large", "t500x500");}
					});
					scope.tracks = playlist.tracks
				})
				.then(function(){
					//Hide playlist
					scope.togglePlaylists();
				});
		};

		var toPositionTime = function(posn_ms) {
			var minutes = posn_ms/1000/60 << 0;
			var seconds = ((posn_ms/1000) % 60) << 0;
			seconds = (seconds < 10 ? "0": "") + seconds;
			return minutes + ":" + seconds;
		};
		var updateCurrentTrack = function(track){
			console.log(track);
			track.duration = toPositionTime(track.duration);
			scope.currentTrack = track;
			//Update artwork in player
			console.log(track.artwork_url);
			$("img.current-artwork").attr("src", !track.artwork_url ? "images/missing.png" : track.artwork_url);
		};

		scope.selectTrack = function(id){
			scope.gruveState.getAudioState(true);
			//SoundManager config for waveform
			soundManager.setup({flashVersion: 9});

			//Get track
			var promise = $http.get(config.api.tracks+id+config.api.credentials);
			promise
				.then(function(result){
					console.log(result)
					var track = result.data;
					console.log(track);
					//Play Audio//
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
							// $(".current-track-position").text(toPositionTime(this.position));
							gruveState.updateCurrentSoundPosition(toPositionTime(this.position));
						},
						onstop: function(){
							gruveState.updateCurrentSoundPosition("0:00");
						}
					});//.play();
					//

					//Update current track//
					track.duration = toPositionTime(track.duration);
					scope.currentTrack = track;
					//Update artwork in player
					if (track.artwork_url) {track.artwork_url = track.artwork_url.replace("large", "t500x500");};
					$("img.current-artwork").attr("src", !track.artwork_url ? "images/missing.png" : track.artwork_url);
					//

					return track;
				})
				.then(function(track){
					$(players.playing).modal("setting", "closable", false).modal("show");
				})
				.then(function(){
					scope.gruveState.getPlayingState("playing");
					gruveState.playCurrentSound();
				});


		};


		//Playing Optinos
		scope.playButton = function(){
			//Prevent mutliple playing of current sound
			if (!(scope.gruveState.getPlayingState() == "playing")) {
				gruveState.playCurrentSound();	
				scope.gruveState.getPlayingState("playing");				
			};
		};
		scope.pauseButton = function(){
			gruveState.pauseCurrentSound();
			scope.gruveState.getPlayingState("pause");
		};
		scope.stopButton = function(){
			gruveState.stopCurrentSound();
			scope.gruveState.getPlayingState("stop");
		};
	}
])