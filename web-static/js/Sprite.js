var Sprite = function(id, image, width, height, colCount, rowCount, loop){
	this.id = id;
	this.loop = loop;
	this.image = image;
	this.rowCount = rowCount;
	this.colCount = colCount;
	this.frameCount = this.rowCount * this.colCount;
	this.currentFrame = 0;
	this.setFrameRate(16);
	this.invert = false;
	this.invertAnim = false;
	this.scale = 1;
	this.lastUpdateTime = 0;
	this.imgWidth = width;
	this.imgHeight = height;
	this.centerX = 0;
	this.centerY = 0;
	this.x = 0;
	this.y = 0;
	
	this.hide();
	this.onAnimationComplete = false;
	
	this.width = Math.round(this.imgWidth / this.colCount);
	this.height = Math.round(this.imgHeight / this.rowCount);
};

Sprite.prototype.setUrl = function(url){
	if(this.url != url){
		this.url = url;
		//this.$img.attr("src", this.url);
	}
};
Sprite.prototype.setPosition = function(x, y){
	this.x = x;
	this.y = y;
	this.refreshPosition();
};

Sprite.prototype.setCenter = function(x, y){
	this.centerX = x;
	this.centerY = y;
	this.refreshPosition();
};
Sprite.prototype.refreshPosition = function(){
	//this.$elm[0].style.left = Math.round(this.x - this.scale * this.centerX) + "px";
	//this.$elm[0].style.top = Math.round(this.y - this.scale * this.centerY) + "px";
};
Sprite.prototype.show = function(type, options){
	if(this.loop){
		this.currentFrame = 0;
		this.play();
	}
	//this.$elm.show(type, options);
};
Sprite.prototype.hide = function(hideType){
	this.stop();
	//this.$elm.hide(hideType);
};
Sprite.prototype.play = function(onComplete){
	var _this = this;
	if(this.player){
		clearTimeout(this.player);
	}
	var frameDuration = this.frameDuration;
	if(this.character && this.character.slowMotion){
		frameDuration = Math.round(frameDuration * 1.5);
	}
	this.player = setTimeout(function(){
		_this.nextFrame();
		if(_this.loop || _this.currentFrame < _this.frameCount - 1){
			_this.play(onComplete);
		}else if((typeof onComplete) == "function"){
			onComplete(_this);
		}
	}, frameDuration);
};
Sprite.prototype.resetAnim = function(){
	this.stop();
	this.currentFrame = 0;
	//this.refreshDisplay();
};
Sprite.prototype.stop = function(){
	if(this.player){
		clearTimeout(this.player);
		this.player = false;
	}
};
Sprite.prototype.nextFrame = function(frames){
	if(!frames){
		frames = 1;
	}
	this.currentFrame = this.currentFrame + frames;
	if(this.currentFrame >= this.frameCount){
		if(this.loop){
			this.currentFrame %= this.frameCount;
		}else{
			this.currentFrame = this.frameCount - 1;
		}
	}
	//this.refreshDisplay();
	if(this.currentFrame == this.frameCount - 1 && !this.loop && this.onAnimationComplete){
		this.onAnimationComplete(this);
		this.onAnimationComplete = false;
	}
};
Sprite.prototype.render = function(g, revert){
	var frame = this.currentFrame;
	if(this.invertAnim){
		frame = this.frameCount - this.currentFrame - 1;
	}
	var col = frame % this.colCount;
	var row = Math.floor(frame/this.colCount);
	if(this.invert) {
		col = this.colCount - col - 1;
		row = this.rowCount - row - 1;
	}
	g.save();
	if(revert) {
		g.scale(-this.scale,this.scale);
	} else {
		g.scale(this.scale,this.scale);
	}
	g.drawImage(this.image, Math.round(this.width * col), Math.round(this.height * row), this.width, this.height, -this.centerX, -this.centerY, this.width, this.height);
	g.restore();
};
Sprite.prototype.setFrameRate = function(frameRate){
	this.frameRate = frameRate;
	this.frameDuration = 1.0 / this.frameRate * 1000;
};
Sprite.prototype.setScale = function(scale){
	if(this.scale != scale){
		this.scale = scale;
		/*this.$elm.width(Math.round(this.width * this.scale));
		this.$elm.height(Math.round(this.height * this.scale));
		this.$img.width(Math.round(this.width * this.scale * this.colCount));
		this.$img.height(Math.round(this.height * this.scale * this.rowCount));*/
		//this.refreshDisplay();
		this.refreshPosition();
	}
};