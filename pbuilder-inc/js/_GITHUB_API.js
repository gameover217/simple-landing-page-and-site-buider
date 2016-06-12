var _GITHUBAPI = {
	
	//files_storage: '_APPDATA',
	files_counter:0,
	
	/* -- LOAD user ---------------- */
	get_user:function(_tkn,success){
		loadFile( function(res) {
				success(res);
			},'https://api.github.com/user?access_token='+_tkn,null,
			function(msg){
				alert('Error https://api.github.com/user');
				consile.log(msg);
			});
	},	
	
	/* -- LOAD repos list ---------- */
	get_repos:function(_tkn,success){
		loadFile( function(res) {
				success(res);
			},'https://api.github.com/user/repos?access_token='+_tkn,null,
			function(msg){
				alert('Error https://api.github.com/user/repos');
				consile.log(msg);
			});
	},
	/* -- CREATE repo -------------- */
	create_repo:function(_tkn,data,success){
		loadFile( function(res) {	
			success(res);
		},
		'https://api.github.com/user/repos?access_token='+_tkn, data,
		function(msg){
			alert('error 404');
		});
	},
	get_files_list:function(data,success){ /* token, repo, path */
		loadFile( function(res) {
				success(res);
			},'https://api.github.com/repos/'+data.repo+'contents/'+data.path+'?access_token='+data.token,
			null,
			function(msg){
				alert('Error https://api.github.com/user/repos');
				console.log(msg);
			});
	},
	get_files_from_list:function(data, success){
		var _t = this;
		var _s = success;
		var _data = data;
		if(_data.list.length > _t.files_counter ){		
			this.get_file({
				token: data.token,
				repo: data.repo,
				path: data.list[this.files_counter].path,
			},function(res) {	
					_t.files_counter++;
					var _res = JSON.parse(res);
					if(!_APPDATA[_data.repo]){
						_APPDATA[_data.repo] = {};
					}
					_APPDATA[_data.repo][_res.path] = _res;
					_t.get_files_from_list(_data, _s);
			});
		}else{
				_t.files_counter=0;
				_s('loaded completed');
		}
	},
	/* ------------------------------ */
	get_file:function(data, success){  /* token, repo, path */
		loadFile( function(res) {	
			success(res);
		},
		'https://api.github.com/repos/'+data.repo+'contents/'+data.path+'?access_token='+data.token, 
		null,
		function(msg){
			alert('error 404');
		});
	},
	/* ------------------------------ */
	// [{'name','blob'}]
	create_files: function(token, repo, filesArray, cf_success){
		var _s = cf_success;
		this.files_counter = 0;
		this.create_next_file(token, repo, filesArray, function(success){
			_s(success);
		});
	},
	create_next_file: function(token, repo, filesArray, nf_success){
		var _s = nf_success;
		if(filesArray.length > this.files_counter){	
			var file = {
				"message": "add UiGEN file:"+filesArray[this.files_counter].file_name,
				"path": filesArray[this.files_counter].file_name,
				"content": filesArray[this.files_counter].content,
				"branch": _PROJECT.crnt_pub_branch
			};
			try {
				/*
				if(this.sha[repo+"/"][filesArray[this.files_counter].file_name]){	

					file['sha'] = _DATA.sha.boilerplates[repo+"/"][filesArray[this.files_counter].file_name];
				}
				*/
			}
			catch(err) {}
			loadFile( function(response) {		
				_GITHUB.count++;
				_GITHUB.create_next_file(token, repo, filesArray, _s); 
			},
			'https://api.github.com/repos/'+repo+'/contents/'+filesArray[this.files_counter].file_name+'?ref='+_PROJECT.crnt_pub_branch+'&access_token='+token, 
			file,
			function(msg){
				alert('error 404');
			},"PUT");
		}else{	
			_s(filesArray);	
			console.log('github-content-uploader:files created');
			return true;
		}
	}

	
}