var _PAGE = {
	
	"site_map":null,
	"crnt_name":null,
	
	get: function(repo, success){
		var _s = success;
		_GITHUB.get_content(token, repo, path, function(success){
			_s(success);
		});
		
	},
	get_list: function(token, success){
	
	},
	create: function(token, repo, filesArray, success){
		var _s = success;
		_GITHUB.create_files(token, repo, filesArray, function(success){
			_s(success);
			
		});
	},	
	delete: function(){
		/* TODO */
	}
}