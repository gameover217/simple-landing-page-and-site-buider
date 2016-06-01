var _GITHUB = {
	sha:{},
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
			_t.preloader_init('tree');
			_t.move_preloader(_t.res.tree[0].path);
			_t.load();
		}, 'https://api.github.com/repos/'+_t.repo+'git/trees/'+prop.branch+'?recursive=1'); 
	},

	load: function(){
		_t = this;
		if(	_t.check_filter(_t.count) ){
			loadFile( function(_r) {
				if(!_t.data[_t.repo]){
					_t.data[_t.repo] = {};
					_t.sha[_t.repo] = {};
				}
				_t.data[_t.repo][_t.res.tree[_t.count].path] = JSON.parse(_r).content;
				_t.sha[_t.repo][_t.res.tree[_t.count].path] = JSON.parse(_r).sha;
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


		/* -- LOAD user ---------------- */
	get_user:function(_tkn,success){
		_GITHUB.preloader_init(1);
		loadFile( function(res) {
				_GITHUB.move_preloader('login user');	
				success(res);
			},'https://api.github.com/user?access_token='+_tkn,null,
			function(msg){
				alert('Error https://api.github.com/user');
				consile.log(msg);
			});
	},
	/* -- LOAD repos list ---------- */
	get_repos:function(_tkn,success){
		_GITHUB.preloader_init(1);
		loadFile( function(res) {
				_GITHUB.move_preloader('get projects list');	
				success(res);
			},'https://api.github.com/user/repos?access_token='+_tkn,null,
			function(msg){
				alert('Error https://api.github.com/user/repos');
				consile.log(msg);
			});
	},
	/* -- CREATE repo -------------- */
	create_repo:function(_tkn,data,success){
		_GITHUB.preloader_init(1);
		loadFile( function(res) {	
			_GITHUB.move_preloader('get projects list');	
			success(res);
		},
		'https://api.github.com/user/repos?access_token='+_tkn, data,
		function(msg){
			alert('error 404');
		});
	},
	/* ------------------------------ */
	// [{'name','blob'}]
	create_files: function(token, repo, filesArray){
		this.count = 0;
		this.create_next_file(token, repo, filesArray);

	},
	create_next_file: function(token, repo, filesArray){

		if(filesArray.length > this.count){	

			var file = {
				"message": "add UiGEN file:"+filesArray[this.count].file_name,
				"path": filesArray[this.count].file_name,
				"content": filesArray[this.count].content,
				"branch": _PROJECT.crnt_pub_branch
			};
			/* SHA TEST */
			// update sha table
			try {
				if(this.sha[repo+"/"][filesArray[this.count].file_name]){				
					file['sha'] = this.sha[repo+"/"][filesArray[this.count].file_name];
				}	
			}
			catch(err) {}
					
			loadFile( function(response) {		
					_GITHUB.count++;
					_GITHUB.create_next_file(token, repo, filesArray);					
			},
				'https://api.github.com/repos/'+repo+'/contents/'+filesArray[this.count].file_name+'?ref='+_PROJECT.crnt_pub_branch+'&access_token='+token, 
			file,
			function(msg){
				alert('error 404');
			},"PUT");
		}else{
			console.log('github-content-uploader:files created');
			return true;
		}
	},

	/* ------------------------------ */
	preloader_init:function(type){
		this.count,this.preloader_count = 0;
		document.getElementById(this.preloader_bar_id).setAttribute("style", "opacity:1; width:8%");
		document.getElementById(this.preloader_bar_id).innerHTML = "Loader init...";  
		if(type == 'tree'){
			for(var _i in this.res.tree) { 
				if(this.check_filter(_i)){
					this.preloader_length++;
				}
			}
			return true;
		}
		this.preloader_length = type;
	},

	move_preloader: function(content){
		this.preloader_count++;
		var percentage = (this.preloader_count/this.preloader_length)*100;
		document.getElementById(this.preloader_bar_id).style.width = percentage+'%';
		document.getElementById(this.preloader_bar_id).innerHTML = ""+parseInt(percentage)+"% "+content; 
		if(percentage >= 100){
			document.getElementById(this.preloader_bar_id).style.opacity = '0';
		}
	}
}