// Meteor.startup(function () {
//   config = {
//     client_id: "9d3700f41a6e7c052108742a6d661971",
//     username: "phamartin", //user_id: 49699208git
//     api: "http://api.soundcloud.com"
//   };

//   // Initialize SC connection
//   SC.initialize({
//     // client_id: SoundCloud dev id
//     client_id: config.client_id,
//     redirect_uri: ""
//   });

//   //Get my user information
//   $.get("http://api.soundcloud.com/resolve.json?url=http://soundcloud.com/"+config.username+"&client_id="+config.client_id,
//     function(user){
//       console.log(user);
//       //Get user
//       $.get(config.api+"/users/"+user.id+"/playlists?client_id="+config.client_id, 
//         function(data){
//           console.log(data);
//       })
//   });
// });