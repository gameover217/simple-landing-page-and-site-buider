var _CONTEXT_HELP = {
	init:function(){
		if(!_USER.current){
			this.show_help('login-tab','Login first');
		}else{
			if(!_PROJECT.crnt_name){
				this.show_help('projects-tab','Get or create project');
			}else{
				this.show_help('pages-tab','Choose page');
			}
		}
	},
	show_help: function(id, content){
		this.close();
		document.getElementById(id).innerHTML += '<div id="tooltip-"'+id+' class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-content">'+content+'</div></div>';
	},
	close: function(){
		removeElementsByClass('tooltip');
	}
};
