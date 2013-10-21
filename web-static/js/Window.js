var Window = function(id, parent){
	this.id = id;
	this.parent = parent;
	
	this.root = document.createElement("div");
	this.root.className = "window";
	this.parent.appendChild(this.root);
	
	this.currentPage = null;
};
Window.prototype.addPage = function(title, page){
	if(!(page instanceof Page)){
		throw page + " is not instanceof Page";
	}
	
	...
	
	if(this.currentPage == null){
		this.showPage(menuElm);
	}
};

Window.prototype.showPage = function(elm){
	
};