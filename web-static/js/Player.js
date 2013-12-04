var Player = function(assetManager){
	var self = this;
	Character.call(this);
	
	$(document).keyup(function(e){
		self.onKeyUp(e);
	});
	$(document).keydown(function(e){
		self.onKeyDown(e);
	});
		
	this.speed = {
		x: 600,
		y: 200
	};
	
	this.centerX = 64;
	this.centerY = 120;
	
	this.createSprite("idle",assetManager.getImage("player-idle"), 2048, 256, 16, 2, true);
	this.createSprite("attack",assetManager.getImage("player-attack"), 2048, 128, 16, 1, false);
	this.createSprite("move",assetManager.getImage("player-move"), 896, 128, 7, 1, true);
	
	for(var i in this.spriteList) {
		this.spriteList[i].setCenter(this.centerX, this.centerY);
	}

	this.keyList = {};
	this.revertDirection = false;
	this.setSprite("idle");
};
Player.MIN_Y = 1455;
Player.MAX_Y = 1920;
Player.MIN_SCALE = 0.5;
Player.MAX_SCALE = 1.3;

Player.prototype = new Character();
Player.prototype.init = function(){
};
Player.prototype.setPosition = function(x, y){
	var lastY = this.y;
	Character.prototype.setPosition.call(this, x, y);
	
	if(this.y != lastY){
		var factor = (y - Player.MIN_Y) / (Player.MAX_Y - Player.MIN_Y);
		this.setScale(factor * (Player.MAX_SCALE - Player.MIN_SCALE) + Player.MIN_SCALE);
	}
};

Player.prototype.setScale = function(scale){
        this.scale = scale;
        for(var i in this.spriteList){
                this.spriteList[i].setScale(this.scale);
        }
};

Player.prototype.update = function(deltaTime){
	var move = {x: 0, y: 0};
	
	//console.log(this.keyList);
	// Q (113|81)

	// S (115|83)

	// D (100|68)

	// Z (122|90)
	for(var i in this.keyList) {
		if(this.keyList[i]) {
			switch(i) {
				case "113", "81":
					this.revertDirection = true;
					move.x = -1;
				break;
				case "115", "83":
					move.y = 1;
				break;
				case "100", "68":
					this.revertDirection = false;
					move.x = 1;
				break;
				case "122", "90":
					move.y = -1;
				break;
			}
		}
	}
	if(move.x != 0 || move.y != 0){
		this.move(move.x * this.speed.x * this.scale * deltaTime, move.y * this.speed.y * this.scale * deltaTime);
		this.setSprite("move");
	}else{
		this.setSprite("idle");
	}

	//this.setSprite (move, idle);
};

Player.prototype.onKeyDown = function(k){
	var self = this;
	if(k.which == 32) {
		var lastAnim = this.lastAnimId;
		this.setSprite("attack", function(){
			self.setSprite(lastAnim);
			for (var i in game.mobList) {
				if(self.x - 40 <  game.mobList[i].x && game.mobList[i].x < self.x + 40) {
					if(self.y - 50 < game.mobList[i].y && game.mobList[i].y < self.y + 50) {
						camera.shake(3);
						game.mobList[i].setSprite("death");
						setTimeout(function() {
							game.mobList.splice(i, 1);
						}, 5000);
					}
				}
			}
			
		});
	}
	this.keyList[k.which] = true;
};
Player.prototype.onKeyUp = function(k){
	this.keyList[k.which] = false;
};