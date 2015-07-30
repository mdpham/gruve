gruve.factory("queue", function(){
	function queue(playlist, init_type, init_posn){
		this.playlist = playlist;
		this.posn = init_posn;
		this.type = init_type;
	};

	queue.prototype = {
		changePosn: function(posn){
			this.posn = posn;
		},
		getNext: function(){
			var next;
			console.log('this', this);
			switch (this.type) {
				case "linear":
					next = this.playlist.tracks[this.posn+1]; 
					break;
				case "shuffle":
					next = _.sample(this.playlist.tracks);
					break;
				case "repeat":
					next = this.playlist.tracks[this.posn];
					break;
			};
			console.log("next", next);
			return next;
		},
		changeType: function(type){
			this.type = type;
		},

	}

	return (queue);
});