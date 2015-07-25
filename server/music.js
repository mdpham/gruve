Meteor.publish("playlists", function(){
	return Playlists.find({});
})

Meteor.startup(function(){
	Meteor.methods({
		clearPlaylists: function(){
			Playlists.remove({});
		},
		fetchPlaylist: function(soundcloud_id){
			//Add error catching
			console.log(Playlists.findOne({id: soundcloud_id}));
			return Playlists.findOne({id: soundcloud_id});
		}

	})
})