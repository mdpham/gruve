Meteor.publish("playlists", function(){
	return Playlists.find({});
})

Meteor.startup(function(){
	config = {
		client_id: "9d3700f41a6e7c052108742a6d661971",
		username: "phamartin", //user_id: 49699208git
		api: {
			base: "http://api.soundcloud.com",
			tracks: "http://api.soundcloud.com/tracks/",
			users: "http://api.soundcloud.com/users/",
			credentials: "?client_id=9d3700f41a6e7c052108742a6d661971"
		},
		assets: {
			// missingPNG : "images/missing.png"
			missingPNG: "images/white-brushed.png"
		}
	};
	Meteor.methods({
		clearPlaylists: function(){
			Playlists.remove({});
		},
		fetchPlaylist: function(soundcloud_id){
			//Add error catching
			console.log(Playlists.findOne({id: soundcloud_id}));
			var findOne = Playlists.findOne({id: soundcloud_id});
			//Gruve data object for playlist
			findOne.gruve = {};
			//Process start and end dates for playlist
			var start = moment(findOne.title.substring(1,9), "MM.DD.YY");
			findOne.gruve.startDate = start.format("ll");
			findOne.gruve.endDate = start.add(1, "weeks").format("ll");
			//Process tracks
			_.each(findOne.tracks, function(t){
				//Gruve data object for track
				t.gruve = {};
				//Track artwork
				if (t.artwork_url == null) {t.gruve.artwork_url = config.assets.missingPNG;}
				else {t.gruve.artwork_url = t.artwork_url.replace("large", "t500x500");};
				//User avatar artwork
				t.gruve.avatar_url = t.user.avatar_url.replace("large", "t500x500");
			});
			return findOne;
		}

	})
})