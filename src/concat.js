var background = {};
background.cloud = new Image(300,150);

background.init = function(){
	if(!gameIsMobile){
		background.clouds = [{"x":675,"y":-250,"velX":1},
					 {"x":0,"y":-500,"velX":2},
					 {"x":1000,"y":-750,"velX":3}];
	}
}

background.enterFrame = function()
{
	if(!gameIsMobile){
		var i;
		for(i=0;i<background.clouds.length;i++){
			background.clouds[i].x -= background.clouds[i].velX;
			if(background.clouds[i].x<-1000){
				background.clouds[i].x = 1425;
			}
		}
	}
}

background.draw = function()
{
	// Background Sun
	ctx.save();
	ctx.translate(800,600-HUD.timer*1000);
	ctx.fillStyle = "#FFD";
	ctx.beginPath();
	ctx.arc(0,0,330,0,Math.PI*2,false);
  	ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#FFA";
    ctx.stroke();
	ctx.restore();
	
	// Background Clouds
	if(!gameIsMobile){
		ctx.save();
		ctx.globalAlpha = 0.8;
		var i;
		for(i=0;i<background.clouds.length;i++){
			ctx.drawImage( background.cloud, background.clouds[i].x, background.clouds[i].y, background.cloud.width*2, background.cloud.height*2);
		}
		ctx.restore();
	}
}

var HUD = {};
HUD.timerImage = new Image(100,100);

HUD.init = function(){
	HUD.awesome = 0;
	HUD.timer = 1;
	HUD.points = 0;
	HUD.parasprites = 0;
	HUD.groundvel = 0;
	HUD.maxalt = 0;
	HUD.endTimer = 0;
}


HUD.draw = function(){
	
	hudCTX.clearRect(0, 0, 960, 640); // Clear the canvas
	
	// Draw Night
	if(HUD.timer<0.2){
		hudCTX.save();
		hudCTX.fillStyle = "#003";
		if(HUD.timer>0){
			hudCTX.globalAlpha = 0.8*(0.2-HUD.timer)/0.2;
		}else{
			hudCTX.globalAlpha = 0.8;
		}
		hudCTX.fillRect(0,0,480,300);
		hudCTX.restore();
	}
	
			
	// Draw Outer Circle
	hudCTX.fillStyle = "#333";
	hudCTX.beginPath();
	hudCTX.arc(0,300,60,0,Math.PI*2,false);
	hudCTX.fill();
		
	// Draw Sun & Moon
	hudCTX.save();
	hudCTX.translate(0,300);
	hudCTX.rotate((1-HUD.timer)*0.5*Math.PI);
	hudCTX.drawImage( HUD.timerImage, -50, -50, 100, 100 );
	hudCTX.restore();
		
	// Draw Arc
	if(HUD.awesome>=0){
		hudCTX.beginPath();
		hudCTX.arc(0,300,55,0,-HUD.awesome*0.5*Math.PI,true);
	    hudCTX.lineWidth = 10;
	    hudCTX.strokeStyle = "#FFF";
	    hudCTX.stroke();
    }
	
}

HUD.enterFrame = function(){
	if(toad.startMoving){
		
		HUD.awesome *= 3;
		HUD.awesome += 0.02*(-0.04*toad.coord.y+toad.vel.x*1.2); // Originally 0.04 not 0.02. Halved for better judge of awesome.
		HUD.awesome *= 0.25;
		HUD.timer-=(1/(60*30)-toad.vel.x*(1/(60*30))*(1/20));
		
		if(HUD.groundvel<toad.vel.x){
			HUD.groundvel = toad.vel.x;
		}
		if(HUD.maxalt < -toad.coord.y){
			HUD.maxalt = -toad.coord.y;
		} 
	
		if(HUD.timer<0){
			HUD.timer = 0;
			//alert("YOU LOSE");
			if(HUD.endTimer==0){
				if(toad.vel.x<2 && toad.touchGround2){
					HUD.endTimer=60;
				}
			}else{
				HUD.endTimer--;
				if(HUD.endTimer==1){
					menu.gameover();
				}
			}
		}else if(HUD.timer>1){
			HUD.timer = 1;
		}
		
		if(document.getElementById('instructions').style.display!='none'){
			document.getElementById('instructions').style.opacity -= 0.06;
			if(document.getElementById('instructions').style.opacity<=0.061){
				document.getElementById('instructions').style.display='none';
			}
		}
	}
	
	// POINTS
	document.getElementById('points').innerHTML = HUD.points+"m";
	HUD.points = Math.floor(toad.coord.x/100);
	if(HUD.points<0){
		HUD.points=0;
	}
}

HUD.printStats = function(){
	document.getElementById('stats_points').innerHTML = document.getElementById('points').innerHTML;
	document.getElementById('stats_altitude').innerHTML = Math.ceil(HUD.maxalt*0.01);
	document.getElementById('stats_velocity').innerHTML = Math.ceil(3.6*60*HUD.groundvel*0.01);
	document.getElementById('stats_parasprites').innerHTML = HUD.parasprites;
}
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
	//alert("Key Up"); 
}
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
var music = new Audio();
function musicLoopInit(){
	music.addEventListener('ended', function() {
	    music.currentTime = 0;
	    music.play();
	}, false);
}


var music = new Audio();
function musicLoopInit(){
	setInterval( function(){ 
		if(music.currentTime>57){
			music.currentTime = 0; 
			music.play();
		} 
	},200);
	//music.currentTime = 40;
}
var music_source;
if (music.canPlayType('audio/mpeg;')) {
    music.type= 'audio/mpeg';
    music_source = 'music/Gachitoad.mp3';
} else {
    music.type= 'audio/ogg';
    music_source = 'music/Gachitoad.ogg';
}
var toad = {};
toad.image = new Image(800,600);

toad.init = function(){
	toad.coord = new Object();
	toad.vel = new Object();
	toad.coord.x = -10;
	toad.coord.y = -201;
	toad.vel.x = 1.9;
	toad.vel.y = -0.9;
	toad.rotation = 0;
	toad.width = toad.height = 200;
	toad.frame = 0;
	
	toad.touchGround = true; //keyup, on ground
	toad.touchGround2 = false; //keydown
	toad.touchGround3 = false; //air
	toad.keyDown = false;
}

toad.startMoving = false;

toad.draw = function()
{
	// TRANSFORM
	ctx.save();
	ctx.translate(0,toad.coord.y);
	ctx.rotate(toad.rotation);
	if(HUD.timer>0){
		if(toad.touchGround2){
			if(toad.keyDown){
				ctx.drawImage( toad.image, 202, Math.floor(toad.frame)*200+2,196,196, 
								-200/2, -200+20, 200, 200);
			}else{
				ctx.drawImage( toad.image, 2, Math.floor(toad.frame)*200+2,196,196,
								 -200/2, -200+20, 200, 200);
			}
		}else{
			if(HUD.timer>0 && toad.keyDown){
				ctx.drawImage( toad.image, 602, Math.floor(toad.frame)*200+2,196,196,
								 -200/2, -200+20, 200, 200);
			}else{
				ctx.drawImage( toad.image, 402, Math.floor(toad.frame)*200+2,196,196,
								-200/2, -200+20, 200, 200);
			}
		}
	}else{
		if(!toad.touchGround3){
			if(toad.touchGround2){
				toad.touchGround3 = true;
				TTG.shake = 100;
			}
		}
		if(toad.touchGround3){
			ctx.drawImage( toad.image, 800, Math.floor(toad.frame)*200,200,200, 
							-200/2, -200+20, 200, 200);
		}else{
			ctx.drawImage( toad.image, 400, Math.floor(toad.frame)*200,200,200,
								-200/2, -200+20, 200, 200);
		}
	}
	// RESTORE
	ctx.restore();
}

toad.enterFrame = function()
{
	// KEY
	toad.keyDown = kCont.down;
	if(!toad.startMoving){
		toad.startMoving = toad.keyDown;
		// Play music if not mobile and upon starting game
		if(toad.keyDown){
			if( !gameIsMobile && music.paused ){
				//music.currentTime = 0;
				menu.toggleAudio();
			}
		}
	}
	
	// FRAME
	toad.frame += (2+toad.vel.x)/60;
	if(toad.keyDown){
		toad.frame += 0.2;
	}
	toad.frame %= 3;
	
	if(toad.startMoving){
		
		// Velocity Addition
		if(HUD.timer<=0){
			toad.vel.x*=0.98;
		}
		if(HUD.timer>0 && toad.keyDown){
			if(toad.touchGround2){
				if(toad.vel.y>0){
					toad.vel.y += 0.3; 
					//toad.vel.x += 0.05; 
				}else{
					//toad.vel.y -= 0.05; 
					toad.vel.x += 0.2; 
					//toad.vel.x += 0.1; //Should just be pushing fwd
				}
			}else{
				toad.vel.y += 0.25;
			}
		}else{
			if(HUD.timer>0 && toad.touchGround2){
				if(toad.vel.y<0 && toad.vel.x<3){
					toad.vel.x += 0.05;
				}
			}
			if(HUD.timer<=0 && !toad.touchGround2){
				toad.vel.y+=0.2;
			}
			toad.vel.y += 0.08;
		}
		
		// Move coords
		toad.coord.x += toad.vel.x;
		var terrY = terrain.funct(toad.coord.x);
		if(toad.touchGround3){
			toad.coord.y += terrY;
		}else{
			toad.coord.y += toad.vel.y;
		}	
		// Terrain Update
		
		terrain.updateX(toad.coord.x);
		
		// Correct coords
		/*toad.touchGround = (   ( toad.vel.y>0 && toad.coord.y>terrY-2 )
	                       || ( toad.vel.y<0 && toad.coord.y>terrY-0.5 )
	                       );*/
	 	//toad.touchGround3 = toad.coord.y>terrY-100;
	 	toad.touchGround2 = toad.coord.y>terrY-5;
	 	toad.touchGround = toad.coord.y>terrY;
		if(toad.touchGround)
		{
			toad.coord.y = terrY;
			// Slope & Projection
			var terrSlope = terrain.functDiff(toad.coord.x);
			var terrLength = Math.sqrt(1*1+terrSlope*terrSlope);
			var dotProduct = toad.vel.x*1 + toad.vel.y*terrSlope;
			dotProduct = dotProduct/terrLength;
			toad.vel.x = dotProduct/Math.sqrt(1+terrSlope*terrSlope);
			if(toad.vel.x<0.1){
				toad.vel.x=0.1;
			}
			toad.vel.y = toad.vel.x*terrSlope;
			toad.vel.x*=0.995;
			toad.vel.y*=0.995;
		}else{
			//toad.coord.y += toad.vel.y;
		}
		
		toad.rotation = Math.atan2(toad.vel.y,toad.vel.x);
		if(toad.rotation>Math.PI*0.3){
			toad.rotation*=3;
			toad.rotation+=Math.PI*0.3;
			toad.rotation*=0.25;
		}
	
	}
}

var TTG = {};
TTG.timer_enterFrame = null;
TTG.timer_draw = null;
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
	
	// SCALE / TRANSLATE DEPENDING ON toad
	if(toad.startMoving){
		TTG.gScale*=9;
		TTG.yDisp*=9;
		if(toad.coord.y<-100){
			TTG.yDisp += (toad.coord.y+100)*0.5;
		}else{
			TTG.yDisp += 0;
		}
		if(toad.touchGround3){
			TTG.gScale += 0.7;
			TTG.yDisp += 100;
		}else{
			if(toad.coord.y<-100){
				TTG.gScale += 0.30;
			}else{
				TTG.gScale += 0.40;
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
	toad.draw(); // toad Player
	prop.drawParasprites(); // Parasprites
	HUD.draw(); // HUD
	
	// RESTORE
	ctx.restore();
	
}

TTG.init = function(){
	TTG.gScale = 1;
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
		background.cloud.src = "art/Cloud.png";
		prop.image.tree.src = "art/Tree.png";
		prop.image.burst.src = "art/Burst.png";
		// Music
		music.src = music_source;
		music.addEventListener('canplaythrough', function(){
			musicLoopInit();
			TTG.musicLoaded = true;
			TTG.onAssetLoad();
		}, false);
		music.load();
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
var hudCTX;var terrain = {};

terrain.init = function()
{
	terrain.nodes = [ {"x":-200,"y":-100}, {"x":0,"y":-200}, {"x":400,"y":300}, {"x":700,"y":100} ];
	terrain.lastX = 2;
	terrain.drawFarBack = 600;
	var i;
	for(i=0;i<17;i++){
		terrain.newNode();
	}
}

terrain.newNode = function()
{
	if(terrain.nodes.length<=20){
		terrain.nodes.push( {} );
	}else{
		terrain.nodes.push( terrain.nodes[terrain.lastX-2] );
		terrain.nodes[terrain.lastX-2] = null;
	}
	terrain.nodes[terrain.nodes.length-1].x = terrain.nodes[terrain.nodes.length-2].x + Math.random()*150+250;
	if(terrain.nodes[terrain.nodes.length-2].y<130){
		terrain.nodes[terrain.nodes.length-1].y = 200+Math.random()*70;
	}else{
		terrain.nodes[terrain.nodes.length-1].y = 130-Math.random()*70;
	}
}

terrain.updateX = function(xx)
{
	while( xx > terrain.nodes[terrain.lastX].x ){
		terrain.newNode();
		terrain.lastX++;
	}
}

terrain.funct = function(xx)
{
	var i=terrain.lastX-1;
	while(terrain.nodes[i].x<xx){
		i++;
	}
	var ANode = terrain.nodes[i-1];
	var BNode = terrain.nodes[i];
	return ANode.y
			- (BNode.y-ANode.y)*0.5
			* ( Math.cos( Math.PI*( xx-ANode.x )/( BNode.x-ANode.x ) ) - 1 );
}

terrain.functDiff = function(xx)
{
	var i=terrain.lastX-1;
	while(terrain.nodes[i].x<xx){
		i++;
	}
	var ANode = terrain.nodes[i-1];
	var BNode = terrain.nodes[i];
	return (BNode.y-ANode.y)*0.5
			* Math.PI/( BNode.x-ANode.x )
			* ( Math.sin( Math.PI*( xx-ANode.x )/( BNode.x-ANode.x ) ) );
}

terrain.draw = function( starttt )
{
	// Later, ALL HEX?
	ctx.lineWidth = 50;
	if(gameIsMobile){
		ctx.strokeStyle = "rgb(170,200,47)"; // Top
		ctx.fillStyle = "rgb(152,179,43)"; // Middle
		terrain.drawFrom(starttt,25);
	}else{
		ctx.strokeStyle = "rgb(170,200,47)"; // Top
		terrain.drawFrom(starttt,25);
		ctx.strokeStyle = "rgb(152,179,43)"; // Middle
		ctx.fillStyle = "#8FA927"; // Bottom 
		terrain.drawFrom(starttt,70);
	}
}

terrain.drawFrom = function( starttt, yOff )
{
	ctx.beginPath();
	var tmpTerrYDraw = terrain.funct(starttt-terrain.drawFarBack);
	ctx.moveTo( 0-terrain.drawFarBack, tmpTerrYDraw+yOff );
	var i;
	if(toad.startMoving){
		if(gameIsMobile){
			if(TTG.gScale<0.35){
				for( i=30-terrain.drawFarBack; i<=1440; i+=75 ){
					tmpTerrYDraw = terrain.funct(starttt+i);
					ctx.lineTo( i, tmpTerrYDraw+yOff );
				}
			}else{
				for( i=30-terrain.drawFarBack; i<=1200; i+=50 ){
					tmpTerrYDraw = terrain.funct(starttt+i);
					ctx.lineTo( i, tmpTerrYDraw+yOff );
				}
			}
		}else{
			if(TTG.gScale<0.35){
				for( i=30-terrain.drawFarBack; i<=1440; i+=30 ){
					tmpTerrYDraw = terrain.funct(starttt+i);
					ctx.lineTo( i, tmpTerrYDraw+yOff );
				}
			}else{
				for( i=30-terrain.drawFarBack; i<=1200; i+=20 ){
					tmpTerrYDraw = terrain.funct(starttt+i);
					ctx.lineTo( i, tmpTerrYDraw+yOff );
				}
			}
		}
	}else{
		if(gameIsMobile){
			for( i=30-terrain.drawFarBack; i<=500; i+=30 ){
				tmpTerrYDraw = terrain.funct(starttt+i);
				ctx.lineTo( i, tmpTerrYDraw+yOff );
			}
		}else{
			for( i=30-terrain.drawFarBack; i<=500; i+=10 ){
				tmpTerrYDraw = terrain.funct(starttt+i);
				ctx.lineTo( i, tmpTerrYDraw+yOff );
			}
		}
	}
	ctx.lineTo(1425,1000);
	ctx.lineTo(0-terrain.drawFarBack,1000);
	ctx.fill();
	ctx.stroke();
}
var prop = {};
prop.image = {};
prop.image.tree = new Image(600,170);
prop.image.parasprite = new Image(400,200);
prop.image.burst = new Image(750,150);

prop.init = function(){
	
	// TREES
	if(gameIsMobile){
		prop.trees = [];
	}else{
		prop.trees = [{},{},{},{},{},{},{}];
		prop.treeLength = 3;
		prop.treePast = 1000;
		toad.coord.x -= 800;
		prop.addTrees();
		toad.coord.x += 800;
	}
	
	// PARASPRITES
	prop.parasprites = [{},{},{},{}];
	prop.addParasprites();
}

prop.addTrees = function(){
	if(gameIsMobile){
		prop.treeLength = 0;
	}else{
		var i;
		var xxx = 1500;
		prop.treeLength = Math.ceil(3+Math.random()*4);
		prop.treePast = 1000+Math.ceil(Math.random()*2000);
		for(i=0;i<prop.treeLength;i++){
			prop.trees[i].x = xxx+toad.coord.x;
			prop.trees[i].y = terrain.funct(prop.trees[i].x);
			prop.trees[i].rotation = Math.atan( terrain.functDiff(prop.trees[i].x) );
			prop.trees[i].type = Math.floor(Math.random()*3);
			xxx += Math.ceil(Math.random()*400+200);
		}
	}
}

// PARASPRITES
prop.addParasprites = function(){
	var i;
	for(i=0;i<prop.parasprites.length;i++){
		prop.parasprites[i].loop = 5000+Math.floor( Math.random()*5000 );
		prop.parasprites[i].flap = 0;
		prop.resetParasprite(i);
	}
}
prop.resetParasprite = function(i){
	prop.parasprites[i].x = prop.parasprites[i].loop+toad.coord.x;
	prop.parasprites[i].y = -Math.random()*400;
	prop.parasprites[i].color = Math.floor( Math.random()*4 );
	prop.parasprites[i].velX = 3+Math.random()*4;
	prop.parasprites[i].life = 0;
}

// Draw
prop.draw = function(){
	var i;
	for(i=0;i<prop.treeLength;i++){
		ctx.save();
		ctx.translate( prop.trees[i].x-toad.coord.x, prop.trees[i].y );
		ctx.rotate(prop.trees[i].rotation);
		ctx.drawImage( prop.image.tree, prop.trees[i].type*200,0,200,170, -200, -280, 400,340);
		ctx.restore();
	}
}

prop.drawParasprites = function(){
	var i;
	for(i=0;i<prop.parasprites.length;i++){
		ctx.save();
		ctx.translate(prop.parasprites[i].x-toad.coord.x,prop.parasprites[i].y);
		if(prop.parasprites[i].life==0){
			ctx.drawImage( prop.image.parasprite, prop.parasprites[i].color*100, Math.floor(prop.parasprites[i].flap)*100,100,100,
							-50, -50, 100,100);
		}else if(!gameIsMobile){
			ctx.drawImage( prop.image.burst, Math.floor((20-prop.parasprites[i].life)/4)*150,0,150,150,
							-100, -100, 200,200);
		}
		prop.parasprites[i].flap = (prop.parasprites[i].flap+0.1*prop.parasprites[i].velX)%2;
		ctx.restore();
	}
}

// EnterFrame
prop.enterFrame = function(){
	if(!gameIsMobile){
		if(prop.trees[prop.treeLength-1].x-toad.coord.x<-prop.treePast){
			prop.addTrees();
		}
	}
	var i;
	var xxx;
	var yyy;
	for(i=0;i<prop.parasprites.length;i++){
		if(prop.parasprites[i].life==0){
			prop.parasprites[i].x += prop.parasprites[i].velX;
			xxx = prop.parasprites[i].x-toad.coord.x;
			yyy = prop.parasprites[i].y-toad.coord.y;
			if( xxx>prop.parasprites[i].loop || xxx<-500){
				prop.resetParasprite(i);
			}
			if( xxx>-toad.width*0.5 && xxx<toad.width*0.5 && yyy>-toad.height && yyy<0 ){
				prop.parasprites[i].life = 20;
				//alert("CAUGHT");
				toad.vel.x*=1.1;
				toad.vel.y*=1.2;
				HUD.parasprites++;
			}
		}else{
			prop.parasprites[i].life--;
			if(prop.parasprites[i].life==1){
				prop.resetParasprite(i);
			}
		}
	}
}
