var _PAGE = {
	
	"site_map":null,
	"crnt_name":null,
	
	get: function(repo, success){
		
	},
	get_list: function(token, success){
	
	},
	create: function(token, repo, filesArray, success){
		_GITHUB.create_files(token, repo, filesArray, success);
	},	
	delete: function(){
		/* TODO */
	}
}