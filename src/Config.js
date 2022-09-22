(function(exports){

exports.Config = {
	
	friction: 1, // Ground friction
	
	power: 1,  // How much power when you press the button
	
	// The Hilly Terrain (edit this later to very with zones)
	hill: {
		widthVariation: 150,
		widthBase: 400
	},

	// Timer
	timer: {
		constant: 1/(60*15), // Would run out in fifteen seconds (at 60FPS) if you stood still
		speedMultiplier: 0.00005 // Completely arbitrary
	}

};

})(window);