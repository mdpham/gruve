gruve.factory("modalPlayers", function(){
	function modalPlayers(){
		this.all = ".ui.basic.fullscreen.modal.player.playing";
		this.playing = ".ui.basic.fullscreen.modal.player.playing";
		this.idle = ".ui.basic.fullscreen.modal.player.idle";
	};

	modalPlayers.hideAll = function(){
		$(".ui.basic.fullscreen.modal.player").modal("hide");
	}
	modalPlayers.showIdle = function(){
		$(".ui.basic.fullscreen.modal.player.idle").modal("show");
	};
	modalPlayers.showPlaying = function(){
		$(".ui.basic.fullscreen.modal.player.playing").modal("show");
	};
	return (modalPlayers);
});