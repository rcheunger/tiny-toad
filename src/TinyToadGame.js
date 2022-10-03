var TTG = {};
TTG.timer_enterFrame = null;
TTG.timer_draw = null;
let peepingPines = true
let slimeyForest = false
let ravensRedwoods = false
let goldenGrove = false
let mysticalMangroves = false

//Zones
if (HUD.points > 0 && HUD.points < 100) {
	peepingPines == true
}
if (HUD.points > 100 && HUD.points < 200) {
	peepingPines == false
	slimeyForest == true
}
if (HUD.points > 200 && HUD.points < 300) {
	slimeyForest == false
	ravensRedwoods == true
}
if (HUD.points > 300 && HUD.points < 400) {
	ravensRedwoods == false
	goldenGrove == true
}
if (HUD.points > 400 && HUD.points < 500) {
	goldenGrove == false
	mysticalMangroves == true
}

TTG.playGame = function(){
	TTG.timer_enterFrame = setInterval(TTG.enterFrame,enterFrameRate);
	TTG.timer_draw = setInterval(TTG.draw,drawFrameRate);
}
TTG.pauseGame = function(){
	clearInterval(TTG.timer_enterFrame);
	clearInterval(TTG.timer_draw);
}
TTG.enterFrame = function(){
	prop.enterFrame();
	toad.enterFrame();
	background.enterFrame();
	HUD.enterFrame();
	
	// SCALE / (TRANSLATE DEPENDING ON TOAD)
	if(toad.startMoving){
		TTG.gScale*=9;
		TTG.yDisp*=9;
		if(toad.coord.y<-200){
			TTG.yDisp += (toad.coord.y+100)*1; //Game height scale
		}else{
			TTG.yDisp += 0;
		}
		if(toad.touchGround3){
			TTG.gScale += 0.7;
			TTG.yDisp += 100;
		}else{
			if(toad.coord.y<-200){
				TTG.gScale += 0.20; //Game scale in air
			}else{
				TTG.gScale += 0.26; //Game scale on ground
			}
		}
		TTG.gScale*=0.1;
		TTG.yDisp*=0.1;
		if(TTG.yDisp<-300){
			TTG.yDisp*=3;
			TTG.yDisp += -300;
			TTG.yDisp*=0.25;
		}
		// SPLAT
		TTG.yDisp += TTG.shake;
		TTG.shake *= -0.5;
	}
}
TTG.draw = function(){
	ctx.clearRect(0, 0, 960, 640); // Clear the canvas
	
	// SCALE PROPER
	ctx.save();
	ctx.translate(100,150-TTG.yDisp*TTG.gScale);
	ctx.scale(TTG.gScale,TTG.gScale);
	
	background.draw(); // Background
	prop.draw(); // Props like Trees
	terrain.draw(toad.coord.x); // Terrain
	toad.draw(); // Toad Player
	prop.drawParasprites(); // Parasprites
	HUD.draw(); // HUD
	
	// RESTORE
	ctx.restore();
	
}

TTG.init = function(){
	TTG.gScale = 0.5;
	TTG.yDisp = -310;
	TTG.shake = 0;
	menu.init();
	HUD.init();
	background.init();
	toad.init();
	terrain.init();
	prop.init();
}

TTG.artAssets = 7;
TTG.loadArtAssets = function(){
	
	if(gameIsMobile){
		TTG.artAssets -= 4;
	}
	
	toad.image.onload =
	background.cloud.onload = 
	prop.image.tree.onload = 
	prop.image.parasprite.onload = 
	prop.image.burst.onload = 
	HUD.timerImage.onload = 
		TTG.onAssetLoad;
	
	toad.image.src = "art/Toad.png";
	prop.image.parasprite.src = "art/Parasprite.png";
	HUD.timerImage.src = "art/Timer.png";
	
	if(!gameIsMobile){
		// Music
		music.src = music_source;
		music.addEventListener('canplaythrough', function(){
			musicLoopInit();
			TTG.musicLoaded = true;
			TTG.onAssetLoad();
		}, false);
		music.load();
	}

	if(!gameIsMobile && peepingPines == true){
		background.cloud.src = "art/Cloud.png";
		prop.image.tree.src = "art/Tree.png";
		prop.image.burst.src = "art/Burst.png";
	}

	if(!gameIsMobile && slimeyForest == true){
		background.cloud.src = "art/Cloud.png";
		prop.image.tree.src = "art/Tree.png";
		prop.image.burst.src = "art/Burst.png";
	}
	
	
}

TTG.onAssetLoad = function(){
	TTG.artAssets--;
	//alert(TTG.artAssets);
	if(TTG.artAssets==0){
		
		// Music
		//music.play();
		//menu.toggleAudio();
		document.getElementById("bmusic").className = "hud_button toggle";
		
		// Remove Loading Screen
		document.getElementById("loading").style.display = "none";
		document.getElementById("game_container").style.display = "block";
		gameIsLoaded = true;
		
		TTG.startTheGame();
	}
}
TTG.startTheGame = function(){
	TTG.enterFrame(); TTG.draw(); TTG.playGame();
	document.getElementById("screen").style.display = "none";
	
	// If Not Home Screen Web App
	if(notHomeScreened && !TTG.alreadyNotified){
		menu.pause();
		document.getElementById("homeScreen").style.display = "block";
		TTG.alreadyNotified = true;
	}
}
TTG.alreadyNotified = false;
TTG.musicLoaded = false;

var canvas;
var ctx;
var hudCanvas;
var hudCTX;