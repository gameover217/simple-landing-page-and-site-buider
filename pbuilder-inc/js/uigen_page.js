var _PAGE = {
	
	"site_map":null,
	"crnt_name":null,
	
	get: function(repo, success){
		
	},
	get_list: function(token, success){
	
	},
	create: function(token, user_name, repo, filesArray, success){
		_GITHUB.create_files(token, user_name, repo, filesArray, success);
	},
	set_page: function(name){
		this.crnt_name = name;
	},
	delete: function(){
		/* TODO */
	}
}