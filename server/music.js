Meteor.publish("playlists", function(){
	return Playlists.find({});
})

Meteor.startup(function(){
	Meteor.methods({
		clearPlaylists: function(){
			Playlists.remove({});
		}
	})
})