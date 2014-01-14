var Game = function(){
	var self = this;
	var sleep = 2;
	this.localTime = 0;
	this.globalTime = 0;	

	//var win = new Window('main-window', document.getElementById("gui"));
	var win = new Window('main-window', document.getElementById("gui"));
	
	infoPage = new InfoPage();
	try{
		win.addPage("info", infoPage);
		win.addPage("description", new Page("<strong>hello</strong> world"));
		win.addPage("equipement", new Page("lorem ipsum"));
	}catch(e){
		console.log("New Exception : " + e);
	}
	
	infoPage.refreshData({
		name: "Johnny",
		title: "be good",
		xp: 200,
		hp: 643,
		power: 65,
		progress: 0.8
	});
	$scene = $("#main-scene");

	$("#gui").append($("<div>").button().css({position: "absolute", top:"5px", left:"5px"}).append("Menu").click(function(){
		if($(win.root).hasClass("visible")){
			$(win.root).removeClass("visible");
		} else {
			$(win.root).addClass("visible");
		}
	}));
	/*$(win.root).hide();*/

	var imageList = {
		"background": "/cours-web-static/img/getImage.php?url=forest.jpg&sleep=" + sleep,
		"player-idle": "/cours-web-static/img/getImage.php?url=sprite/idle-1-2-1.png&sleep=" + sleep,
		"player-attack": "/cours-web-static/img/getImage.php?url=sprite/attack-1-2-1.png&sleep=" + sleep,
		"player-move": "/cours-web-static/img/getImage.php?url=sprite/move-1-2-1.png&sleep=" + sleep,
		"mob-idle": "/cours-web-static/img/getImage.php?url=sprite/mob-idle.png&sleep=" + sleep,
		"mob-damage": "/cours-web-static/img/getImage.php?url=sprite/mob-damage.png&sleep=" + sleep,
		"mob-attack": "/cours-web-static/img/getImage.php?url=sprite/mob-attack.png&sleep=" + sleep,
		"mob-death": "/cours-web-static/img/getImage.php?url=sprite/mob-death.png&sleep=" + sleep
	};
	
	var soundList= {
		"music": "/cours-web-static/sound/15 We Have To Defeat It.mp3",
		"music2": "/cours-web-static/sound/19 Luminous Sword.mp3"
	};
	this.assetManager = new AssetManager();
	this.assetManager.startLoading(imageList,soundList);
	player = new Player(this.assetManager);
	camera = new Camera(player);
	
	this.mobList = [];
	
	/*setTimeout(function() {
		
		}, 2000);*/
	setInterval(function() {
		if(self.mobList.length < 20) {
			tempo = new Enemy(self.assetManager);
			if(Math.random()<0.5) {
				tempo.revertDirection = true;
			}
			self.mobList.push(tempo);
			self.mobList.sort(function(a, b) {
				if(a.y < b.y) {
					return -1;
				} else if(a.y == b.y) {
					return 0;
				} else {
					return 1;
				}
				});
		}
		}, 2000);

	player.setPosition(3530, 1770);
	player.init();
	
	requestAnimFrame(
		function loop() {
			self.mainLoop();
			requestAnimFrame(loop);
		}					
	);
	this.canvas = $(".scene-view").get(0);
	this.graphics = this.canvas.getContext("2d");
	
	
};
Game.prototype.mainLoop = function(){
	var now = Date.now();
	var globalTimeDelta = now - this.globalTime;
	var localTimeDelta = Math.min(50, globalTimeDelta);
	this.localTime += localTimeDelta;
	
	this.graphics.canvas = this.canvas;
	this.graphics.drawTimeMillis = now;
	
	this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	var fadeDuration = 5000;
	var loadingAlpha = 0;
	var playerStatus = false;
	if (this.assetManager.isDoneLoading()) {
		//var sound = this.assetManager.getSound("music2");
		sound.play();
		loadingAlpha = tween(1, 0, this.assetManager.loadingEndTime, fadeDuration, "easeInOut");
		this.graphics.save();
		camera.render(this.graphics);
		this.graphics.drawImage(this.assetManager.getImage("background"), 0, 0);
		
		player.update(localTimeDelta / 1000);
		
		var bRender = false;
		for(var i in this.mobList) {
			if(this.mobList[i].y < player.y) {
				this.mobList[i].render(this.graphics);
			} else {
				if(!bRender) {
					player.render(this.graphics);
					bRender = true;
				}
				this.mobList[i].render(this.graphics);
			}
		}
		if(!bRender) {
			player.render(this.graphics);
		}
		
		this.graphics.restore();
	}
	if(!this.assetManager.isDoneLoading() || loadingAlpha > 0){
		if(this.assetManager.isDoneLoading()) {
			this.graphics.globalAlpha = loadingAlpha;
		}
		this.assetManager.renderLoadingProgress(this.graphics);
		this.graphics.globalAlpha = 1;
	}
	/*if(this.assetManager.isDoneLoading()) {
		this.graphics.save();
		camera.render(this.graphics);
		this.graphics.drawImage(this.assetManager.getImage("background"), 0, 0);
		
		this.graphics.restore();
	}*/
};
var TWEEN_FACTOR = 1.5;
var TWEEN_EXPO_FACTOR = 4;
function tween(from, to, startTime, duration, easing) {
	var now = Date.now();
	var t = (now - startTime) / duration;
	t = Math.max(0, Math.min(1, t));
	if(typeof(easing) != "undefined") {
		switch(easing) {
			case "easeOut":
				t = Math.pow(t, 1/ TWEEN_FACTOR);
				break;
			case "easeIn":
				t = Math.pow(t, TWEEN_FACTOR);
				break;
			case "easeOutExpo":
				t = Math.pow(t, 1/ TWEEN_EXPO_FACTOR);
				break;
			case "easeInExpo":
				t = Math.pow(t, TWEEN_EXPO_FACTOR);
				break;
			case "easeOutSine":
				t = Math.sin(t * Math.PI / 2);
				break;
			case "easeInSine":
				t = Math.sin((t - 1) * Math.PI / 2) + 1;
				break;
			case "easeInOut":
				t = Math.sin((t - 0.5) * Math.PI) / 2 + 0.5;
				break;
		}
	}
	return t * (to - from) + from;
};