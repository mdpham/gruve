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
	gruveState.updateCurrentSoundPosition = function(posn){
		//Formatted with toPositionTime
		$(".current-track-position").text(posn);
	};

	return (gruveState);
});