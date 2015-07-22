Songs = new Mongo.Collection("songs");
Songs.allow({
	insert: function(){
		return true;
	},
	update: function(){
		return true;
	},
	remove: function(){
		return true;
	}
})