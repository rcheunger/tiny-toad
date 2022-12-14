var kCont = {};
kCont.down = false;
kCont.S_FUNCTION = function(){
	if(!kCont.down && menu.isGameOver){ TTG.init(); TTG.startTheGame(); }
	kCont.down = true;
	if(menu.isPaused){
		menu.play();
	}
}
kCont.keyDownHandler = function(event){
	if(event.keyCode==83){ //}|| event.keyCode==32){
		kCont.S_FUNCTION();
	}
	// Pause
	if(event.keyCode==80 || event.keyCode==27){
		menu.togglePause();
	}
	// Music
	if(event.keyCode==77){
		menu.toggleAudio();
	}
	// Reset
	if(event.keyCode==82){
		if(!kCont.down && toad.startMoving){
			TTG.pauseGame();
			TTG.init();
			TTG.startTheGame();
		}
		kCont.down = true;
	}
}
kCont.keyUpHandler = function(event){
	kCont.down = false;
}