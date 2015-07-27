gruve.controller("homeCtrl",
	["$scope","$meteor","$http","$interval", "gruveState", "modalPlayers",
	function($scope, $meteor, $http, $interval, gruveState, modalPlayers){
		scope = $scope;
		//STATE WATCHING//
		//gruveState starts with no playing and no player open
		scope.gruveState = new gruveState(false, "stop", false);


		//Playlists
		scope.playlists = $meteor.collection(Playlists);
		$meteor.autorun(scope, function(){
			$meteor.subscribe("playlists").then(function(){
				scope.playlists = $meteor.collection(Playlists);
				// console.log("playlists:", scope.playlists);
			});
		});

		//consider moving into factory
		// var players = {
		// 	all: ".ui.basic.fullscreen.modal.player.playing",
		// 	playing: ".ui.basic.fullscreen.modal.player.playing",
		// 	idle: ".ui.basic.fullscreen.modal.player.idle"
		// };
		scope.togglePlayer = function(){
			//Start Discovering
			// $(players.all).modal("hide");
			modalPlayers.hideAll();
			if (!scope.gruveState.getAudioState()) {
				// $(players.idle).modal("show");
				modalPlayers.showIdle();
			} else {
				// $(players.playing).modal("show");
				modalPlayers.showPlaying();
			};
		};

		scope.togglePlaylists = function(){
			$(".sidebar.playlists-topbar")
				  .sidebar('setting', 'transition', 'overlay')
				  .sidebar('toggle')
		};
		scope.currentPlaylist, scope.tracks;
		scope.selectPlaylist = function(id) {
			$meteor.call("fetchPlaylist", id)
			//Returns playlist object
				//Process for artwork
				.then(function(processed_playlist){
					console.log("processed", processed_playlist);
					return processed_playlist;
				})
				//Load playlist into scope
				.then(function(playlist){
					console.log("playlist in scope", playlist);
					scope.currentPlaylist = playlist;
					return playlist;
				})
				.then(function(playlist){
					//Hide playlist
					scope.togglePlaylists();
					//Load tracks into scope to show in main content page
					scope.tracks = scope.currentPlaylist.tracks;
					return playlist;
				})
				.then(function(playlist){
					$interval.cancel(scope.intervalArtwork);
					scope.intervalArtwork = $interval(function(){
						// console.log("interval", _.sample(_.pluck(playlist.tracks, "artwork_url")));
						$("img.playlist-interval-artwork").attr("src", _.sample(_.pluck(playlist.tracks, "artwork_url")));
						// scope.tracks = _.shuffle(scope.tracks);
					}, 2000);


				})
		};

		scope.currentTrack;
		scope.selectTrack = function(id){
			scope.gruveState.getAudioState(true);
			//SoundManager config for waveform
			soundManager.setup({flashVersion: 9});

			//Get track //move to serverside
			var promise = $http.get(config.api.tracks+id+config.api.credentials);
			promise
				//Process track
				.then(function(result){
					var track = result.data;
					$meteor.call("processTrack", result.data)
						.then(function(processed_track){
							gruveState.updateArtworkAvatarImages(processed_track);
							scope.currentTrack = processed_track;
							track = processed_track;
						})
					return track;
				})
				//Load track into soundManager2
				.then(function(track){
					console.log(track);
					gruveState.loadSound(track);
					scope.muteStatus = false;
				})
				//Change state and play
				.then(function(){
					scope.gruveState.getPlayingState("playing");
					gruveState.playCurrentSound();
				});
		};


		//PLAYING OPTIONS//
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
		//

		//VOLUME OPTIONS//
		scope.muteStatus = false;
		scope.volumeLevel;
		scope.volumeUpButton = function(){
			gruveState.volumeUp();
		};
		scope.volumeDownButton = function(){
			gruveState.volumeDown();
		};
		scope.volumeMuteButton = function(){
			scope.muteStatus = gruveState.volumeMute();
		};
		//


		// var toPositionTime = function(posn_ms) {
		// 	var minutes = posn_ms/1000/60 << 0;
		// 	var seconds = ((posn_ms/1000) % 60) << 0;
		// 	seconds = (seconds < 10 ? "0": "") + seconds;
		// 	return minutes + ":" + seconds;
		// };
	}
])