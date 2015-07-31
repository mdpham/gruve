gruve.factory("queue", function(){
	function queue(playlist, initType, initPosn){
		this.playlist = playlist;
		this.posn = initPosn;
		this.type = initType;
		this.history = [];
	};

	queue.prototype = {
		getType: function(){
			return (this.type);
		},
		changeType: function(type){
			this.type = type;
			return type;
		},
		changePosn: function(posn){
			this.posn = posn;
		},
		getNext: function(){
			var next, posn;
			console.log('this', this);
			switch (this.type) {
				case "linear":
					//For repeating
					posn = this.posn+1 >= this.playlist.tracks.length ? 0 : this.posn+1;
					next = this.playlist.tracks[posn];
					console.log("next linear", next);
					break;
				case "shuffle":
					next = _.sample(this.playlist.tracks);
					//Find 
					// posn = this.posn;
					posn = _.indexOf(this.playlist.tracks, next);
					console.log("next shuffle", next);
					break;
				case "repeat":
					posn = this.posn;
					next = this.playlist.tracks[posn];
					console.log("next repeat", next);
					break;
			};
			this.posn = posn;
			//
			next.gruve.id = next.id;
			next.gruve.posn = posn;
			//Add to history
			this.history.push(next);
			//update posn
			return next;
		},
		getPrev: function(){
			var prev, posn;
			switch (this.type) {
				case "linear":
					posn = this.posn == 0 ? this.playlist.tracks.length-1 : this.posn-1;
					prev = this.playlist.tracks[posn];
					break;
				case "shuffle":
					prev = _.sample(this.playlist.tracks);
					posn = _.indexOf(this.playlist.tracks, prev);
					break;
				case "repeat":
					posn = this.posn;
					prev = this.playlist.tracks[posn];
					break;
			};
			this.posn = posn;
			//
			prev.gruve.id = prev.id;
			prev.gruve.posn = posn;

			return prev;
		}
	};

	return (queue);
});