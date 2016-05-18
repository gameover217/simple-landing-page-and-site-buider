var _GITHUB = {
	
	data: {},
	res: {},
	count: 0,
	filter: [],
	repo: '',
	preloader_count: 0,
	preloader_length: 1,
	preloader_bar_id: 'preloader-bar',

	get_content: function(prop, done){
		_t = this;
		_t.done = done;
		_t.repo = prop.repo;
		_t.filter = prop.filter;
		if(!_t.filter){
			_t.filter = null;
		}
		loadFile( function(_r) {
			_t.res = JSON.parse(_r);
			_t.preloader_init();
			_t.move_preloader(_t.res.tree[0].path);
			_t.load();
		}, 'https://api.github.com/repos/'+_t.repo+'git/trees/'+prop.branch); 
	},

	load: function(){
		console.log(_t.res);
		_t = this;
		if(	_t.check_filter(_t.count) ){
			loadFile( function(_r) {
				if(!_t.data[_t.repo]){
					_t.data[_t.repo] = {};
				}
				_t.data[_t.repo][_t.res.tree[_t.count].path] = JSON.parse(_r).content;
				_t.move_preloader(_t.res.tree[_t.count].path);
				_t.next_call();
			}, _t.res.tree[_t.count].url); 
		}else{
			_t.next_call();
		}
	},

	next_call: function(){
		_t = this;
		_t.count++;
		if(_t.count != _t.res.tree.length){
			_t.load();
		}else{
			_t.count = 0;
			_t.preloader_count = 0;
			document.getElementById(this.preloader_bar_id).style.opacity = '0';
			_t.done();
		}
	},

	check_filter:function(_c){
		_t = this;
		_g = false;
		if(_t.filter){
			_t.filter.forEach(function (_d, i) {
	   			_r = _t.res.tree[_c].path.search(_d);
	   			if(_r!='-1'){	   				
	   				_g = true;
	   			}
			});			
		}else{
			_g = true;
		}
		return _g;
	},

	preloader_init:function(){
		document.getElementById(this.preloader_bar_id).style.opacity = '1';
		document.getElementById(this.preloader_bar_id).style.width = '0%';
		for(var _i in this.res.tree) { 
			if(this.check_filter(_i)){
				this.preloader_length++;
			}
		}
	},

	move_preloader: function(content){
		this.preloader_count++;
		var percentage = (this.preloader_count/this.preloader_length)*100;
		document.getElementById(this.preloader_bar_id).style.width = percentage+'%';
		document.getElementById(this.preloader_bar_id).innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+percentage+"%&nbsp;&nbsp;"+content; 
	}
}