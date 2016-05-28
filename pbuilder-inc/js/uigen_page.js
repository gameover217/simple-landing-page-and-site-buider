var _PAGE = {
	
	"list":null,
	"crnt_name":null,
	
	get: function(repo){
		
	},
	get_list: function(token, success){
	
	},
	create: function(token, user_name, repo, filesArray, success){
		_GITHUB.create_files(token, user_name, repo, filesArray);
	},
	delete: function(){
		/* TODO */
	}
}