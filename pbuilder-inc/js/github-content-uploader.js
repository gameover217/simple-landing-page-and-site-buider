var _GITHUB = {
	data:{},
	response:{},
	counter:0,
	filter:'',
	repo:'',
	get_content: function(properties, finished){
		this.finished = finished;
		this.repo = properties.repo;
		this.filter = properties.filter;
		if(!this.filter){
			this.filter = null;
		}
		loadFile( function(response) {
			_GITHUB.response = JSON.parse(response);
			_GITHUB.load();
		}, 'https://api.github.com/repos/'+this.repo+'git/trees/'+properties.branch); 
	},
	load: function(){
		_this = this;
		if(this.filter){
			res = this.response.tree[this.counter].path.search(this.filter);
		}else{
			res = '1';
		}
		if(	res != '-1' ){
			loadFile( function(response) {
				if(!_this.data[_this.repo]){
					_this.data[_this.repo] = {};
				}
				_this.data[_this.repo][_this.response.tree[_this.counter].path] = JSON.parse(response).content;
				_this.next_call();
			}, this.response.tree[this.counter].url); 
		}else{
			this.next_call();
		}
	},
	next_call: function(){
		this. counter++;
		if(this.counter != this.response.tree.length){
			_GITHUB.load();
		}else{
			this.finished();
		}
	}
}