var Enemy = function(assetManager){
	var _this = this;
	Character.call(this);
	
	this.centerX = 64;
	this.centerY = 120;
	
	this.createSprite("idle", assetManager.getImage("mob-idle"), 2048, 128, 16, 1, true);
	this.createSprite("attack", assetManager.getImage("mob-attack"), 1536, 128, 12, 1, false);
	this.createSprite("death", assetManager.getImage("mob-death"), 1792, 128, 14, 1, false);
	this.createSprite("damage", assetManager.getImage("mob-damage"), 1920, 128, 15, 1, false);

	for(var i in this.spriteList){
		this.spriteList[i].setCenter(this.centerX, this.centerY);
	}

	this.setSprite("idle");
	this.setPosition(Enemy.MIN_X + Math.random() * (Enemy.MAX_X - Enemy.MIN_X), Enemy.MIN_Y + Math.random() * (Enemy.MAX_Y - Enemy.MIN_Y));

	var finalScale = this.scale;
	$.ease(0, 1, function(v){
		_this.setScale(v * finalScale);
	}, 1000);
	
	this.revertDirection = false;

};
Enemy.MIN_Y = 1550;
Enemy.MAX_Y = 1920;
Enemy.MIN_X = 2400;
Enemy.MAX_X = 4000;
Enemy.MIN_SCALE = 0.3;
Enemy.MAX_SCALE = 0.8;

Enemy.prototype = new Character();
Enemy.prototype.setPosition = function(x, y){
	var lastY = this.y;
	Character.prototype.setPosition.call(this, x, y);
	
	if(this.y != lastY){
		var factor = (y - Enemy.MIN_Y) / (Enemy.MAX_Y - Enemy.MIN_Y);
		this.setScale(factor * (Enemy.MAX_SCALE - Enemy.MIN_SCALE) + Enemy.MIN_SCALE);
	}
};
Enemy.prototype.setScale = function(scale){
	this.scale = scale;
	for(var i in this.spriteList){
		this.spriteList[i].setScale(this.scale);
	}
};