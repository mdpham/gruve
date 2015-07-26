//Custom type
gruve.factory("gruveState", function(){
	//Constructor
	function gruveState(audioState, playingState, playerState){
		//Audio is loaded
		this.audio = audioState;
		//Audio is being played
		this.playing = playingState;
		this.player = playerState;
	};

	//Instance methods on prototype
	gruveState.prototype = {
		playing: function(){
			return (this.playing);
		},
		getAudioState: function(state){
			if (state) {this.audio = state;};
			return (this.audio);
		},
		getPlayingState: function(state){
			if (state) {this.playing = state;};
			return (this.playing);
		},
		getPlayerState: function(state){
			if (state) {this.player = state;};
			return (this.player);
		}
	};

	//Static methods, no access to 'this' reference//
	//Play current sound loaded in soundManager
	gruveState.playCurrentSound = function() {
		// soundManager.getSoundById("current").play();
		soundManager.play("current");
		return (soundManager.getSoundById("current"));
	};
	//Pause current sound loaded in soundManager
	gruveState.pauseCurrentSound = function() {
		// soundManager.getSoundById("current").pause();
		soundManager.pause("current");
		return (soundManager.getSoundById("current"));
	};
	//Stop current sound loaded in soundManager
	gruveState.stopCurrentSound = function() {
		// soundManager.getSoundById("current").stop();
		soundManager.stop("current");
		return (soundManager.getSoundById("current"));
	};
	//Updates current player position with format "MM:SS"
	gruveState.updateCurrentSoundPosition = function(posn_ms){
		var minutes = posn_ms/1000/60 << 0;
		var seconds = ((posn_ms/1000) % 60) << 0;
		seconds = (seconds < 10 ? "0": "") + seconds;
		var posn = minutes + ":" + seconds;
		//Formatted with toPositionTime
		$(".current-track-position").text(posn);
	};
	//Update current artwork and avatar images
	gruveState.updateArtworkAvatarImages = function(track) {
		//Should be processed track//
		//Update artwork in player
		$("img.current-artwork").attr("src", track.gruve.artwork_url);
		$("img.current-avatar").attr("src", track.gruve.avatar_url);
		//Update permalinks to user and track pages on soundcloud
		$("a.current-avatar-href").attr("href", track.user.permalink_url);
		$("a.current-artwork-href").attr("href", track.permalink_url);
		//
	};
	return (gruveState);
});