var menu = {};

menu.init = function(){
	menu.isPaused = false;
	menu.isGameOver = false;
	document.getElementById("screen").style.display = "none";
	document.getElementById("pause").style.display = "block";
	document.getElementById("gameover").style.display = "none";
}

menu.play = function(){
	if(!menu.isGameOver){
		if(menu.isPaused){
			document.getElementById("screen").style.display = "none";
			document.getElementById('instructions').style.display='block';
			TTG.playGame();
		}
		menu.isPaused = false;
	}
	document.getElementById("bpause").className = "hud_button";
}
menu.pause = function(){
	if(!menu.isGameOver){
		if(!menu.isPaused){
			document.getElementById("screen").style.display = "block";
			document.getElementById('instructions').style.display='none';
			TTG.pauseGame();
		}
		menu.isPaused = true;
	}
	document.getElementById("bpause").className = "hud_button toggle";
}
menu.togglePause = function(){
	if(menu.isGameOver){
		TTG.pauseGame();TTG.init();TTG.startTheGame();
	}else{
		if(menu.isPaused){
			menu.play();
		}else{
			menu.pause();
		}
	}
}
menu.toggleAudio = function(){
	if(TTG.musicLoaded){
		if(music.paused){
			music.play();
			document.getElementById("bmusic").className = "hud_button";
		}else{
			music.pause();
			document.getElementById("bmusic").className = "hud_button toggle";
		}
	}else if(gameIsMobile){
		music.src = music_source;
		music.addEventListener('canplaythrough', function(){
			TTG.musicLoaded = true;
		}, false);
		music.load();
		music.play();
		musicLoopInit();
		document.getElementById("bmusic").className = "hud_button";
	}
}
menu.gameover = function(){
	menu.isGameOver = true;
	document.getElementById("screen").style.display = "block";
	document.getElementById("gameover").style.display = "block";
	document.getElementById("pause").style.display = "none";
	TTG.pauseGame();
	HUD.printStats();
}