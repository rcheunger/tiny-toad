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
	toad.width = 175;
	toad.height = 200;
	toad.frame = 0;
	
	toad.touchGround = true;
	toad.touchGround2 = true;
	toad.touchGround3 = false;
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
	
	// FRAME (toad bounce/fly)
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
					toad.vel.y += 0.3 * Config.power; 
					//toad.vel.x += 0.05; 
				}else{
					//toad.vel.y -= 0.05; 
					toad.vel.x += 0.2 * Config.power; 
					//toad.vel.x += 0.1; //Should just be pushing fwd
				}
			}else{
				toad.vel.y += 0.25 * Config.power;
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
			toad.vel.x *= Config.friction;
			toad.vel.y *= Config.friction;
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