function start(){
	console.log("ok");

	//var win = new Window('main-window', document.getElementById("gui"));
	var win = new Window('main-window', document.getElementById("gui"));
	
	$("#gui").append($("<div>").button().html("Toggle").click(function(){$(win.root).toggle(fade, 200);}));
	//.css("position", "absolute")
	
	var infoPage = new InfoPage();
	
	try{
		win.addPage("info", infoPage);
		win.addPage("description", new Page("<strong>hello</strong> world"));
		win.addPage("equipement", new Page("lorem ipsum"));
	}catch(e){
		console.log("New Exception : " + e);
	}
	
	var playerData = {
		xp: 23,
		hp: 100,
		power: 42
	};
	playerData.progress = 0.33;
	playerData.name = "Ulrich";
	playerData.title = "samouraï";
	
	infoPage.refreshData(playerData);
}