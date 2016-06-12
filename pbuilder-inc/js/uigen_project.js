var _PROJECT = {
	
	"repos_list":null,
	"files_list":null,
	"crnt_name":null,
	"crnt_pub_branch":"gh-pages",
	
	get_files: function(data, success){
		var _s = success;
		_GITHUBAPI.get_files_list(
			data, function(success){
			_PROJECT.files_list = JSON.parse(success);
			_s(_PROJECT.files_list);
		});
	},
	get_list: function(token, success){
		var _s = success;
		_GITHUBAPI.get_repos(token, function(success){
			_PROJECT.repos_list = JSON.parse(success);
			_s(_PROJECT.repos_list);
		});
	},
	create: function(token, name, success){
		var _s = success;
		name.replace(/ /g,'-');
        name.replace(/[^\w-]+/g,'');
		/* TODO - add generic form system !!!!!!! */
		_GITHUBAPI.create_repo(token, {
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