Meteor.startup(function () {
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

	// Initialize SC connection
	SC.initialize({
		// client_id: SoundCloud dev id
		client_id: config.client_id,
		redirect_uri: ""
	});

	//Get my user information
	SC.get("http://api.soundcloud.com/resolve.json?url=http://soundcloud.com/"+config.username+"&client_id="+config.client_id,
	function(user){
		// console.log(user);
		//Get user
		SC.get(config.api.users+user.id+"/playlists?client_id="+config.client_id, 
			function(data){
				// console.log(data);
				Meteor.call("clearPlaylists", function(){
					_.each(data, function(playlist){
						Playlists.insert(playlist);	
					});
				});
		})
	});
});