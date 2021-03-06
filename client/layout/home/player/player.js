Template['menu-player'].rendered = function(){
	//Track Title
	$(".current-track-title-button").popup({
		popup: $(".current-track-title-popup"),
		on: "click",
		position: "bottom left"
	});
	//Track artist
	$(".current-track-username-button").popup({
		popup: $(".current-track-username-popup"),
		on: "click",
		position: "bottom left"
	});
	//Track Position
	$(".current-track-position-button").popup({
		popup: $(".current-track-position-popup"),
		// on: "hover",
		// hoverable: true,
		on: "click",
		position: "bottom right"
	});

	//Mute status in menu player
	$(".current-track-mute-status")
		.transition("set looping")
		.transition("pulse", "2000ms");
};