var _PROJECT = {
	
	"list":null,
	"crnt_name":null,
	"crnt_pub_branch":"gh-pages",
	
	get: function(repo, success){
		var _s = success;
		this.crnt_name = repo;
		
		_GITHUB.get_content({
			'token':_USER.token,
			'repo':repo+'/',
			'branch':this.crnt_pub_branch,
			'filter':undefined,
			'content_type':'project'
		},
		function() {	

/*			if( !_GITHUB.data[_PROJECT.crnt_name+'/']['init.txt'] ){
				alert('Critical error: I dont find init file.\nThis is not UiGEN repo or crasched repo');
				return false;
			}
			if( !_GITHUB.data[_PROJECT.crnt_name+'/']['index.html'] ){
				console.log('I dont have index');
				return false;
			}*/
			if( _DATA.projects[_PROJECT.crnt_name+'/']['site-map.json'] ){
				console.log('-site map exist-');
				_s(JSON.parse(window.atob(_DATA.projects[_PROJECT.crnt_name+'/']['site-map.json'])));
				return true;
			}
		});

	},
	get_list: function(token, success){
		var _s = success;
		_GITHUB.get_repos(token, function(success){
			_PROJECT.list = JSON.parse(success);
			_s(_PROJECT.list);
		});
	},
	create: function(token, name, success){
		var _s = success;
		name.replace(/ /g,'-');
        name.replace(/[^\w-]+/g,'');
		/* TODO - add generic form system !!!!!!! */
		_GITHUB.create_repo(token, {
			"name": name,
			"description": "Static website from UiGEN.org",
			"homepage": "http://uigen.org",
			"private": false,
		},function(success){
			_PROJECT.crnt_name = JSON.parse(success).full_name;
			_s(JSON.parse(success));
		});
	},
	delete: function(){
		/* TODO */
	}
}