var _PROJECT = {
	
	"list":null,
	"crnt_name":null,
	"crnt_pub_branch":"gh-pages",
	
	get: function(repo){
		this.crnt_name = repo;
		_GITHUB.get_content({
			'token':_USER.token,
			'repo':repo+'/',
			'branch':this.crnt_pub_branch,
			'filter':undefined,
		},
		function() {			
			if( !_GITHUB.data[_PROJECT.crnt_name+'/']['.uigen/init.txt'] ){
				alert('Critical error: I dont have init file');
				return false;
			}
			if( !_GITHUB.data[_PROJECT.crnt_name+'/']['index.html'] ){
				alert('I dont have index');
				return false;
			}
			console.log(_GITHUB.data);
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
		/* TODO - add generic form system !!!!!!! */
		this.crnt_name = name;
		_GITHUB.create_repo(token, {
			"name": this.crnt_name,
			"description": "Static website from UiGEN.org",
			"homepage": "http://uigen.org",
			"private": false,
		},function(success){
			_s(JSON.parse(success));
		});
	},
	delete: function(){
		/* TODO */
	}
}