var _PROJECT = {
	"token":sessionStorage.access_token, // |[var_def:index.php]|
	"current_user":"localhost-dadmor",
	"default_branch":"gh-pages",
	"organisation_name":null, /* if usser have projects in organisation [localhost-damor]*/ 
	"project_name":null,
	"published_url":null,
	"sitemap":{
		"urlset":{
			"url":[],
			"_xmlns":"http://www.sitemaps.org/schemas/sitemap/0.9"
		}
	},
	// TODO parse sitemap to good XML format (json structure is 1:1 :D)
	// https://github.com/abdmob/x2js
	// http://www.sitemappro.com/google-sitemap.html
	
	"set_status": function(){
		this.check_token();
	},

	check_token:function(){
		if(!this.token){
			console.log('token:null');
			document.getElementById('tooltip-login').style.display = "flex";	
			load_content( function(_r) {	
				//window.location.hash = '#openModal';
				//document.getElementById('modal-title').innerHTML = "UiGEN LOGIN";
				//document.getElementById('modal-content').innerHTML = _r;
			},'pbuilder-inc/gui-content/_PROJECT-token-null.html',{});
			return false;

		}else{
			/* I have token - check its good token? */
			loadFile( function(res) {	
				/* yes - its good token */	
				_PROJECT.current_user = JSON.parse(res);
				
				document.getElementById('login-tab').innerHTML = '<i class="material-icons">&#xE8A6;</i> '+_PROJECT.current_user.login;
				_PROJECT.organisation_name =  window.location.hostname+'-'+_PROJECT.current_user.login;
				_PROJECT.check_project();
			},'https://api.github.com/user?access_token='+this.token,null,
			function(msg){
				alert('I have problem with download https://api.github.com/user');
			});
		}
	},
	check_project:function(){
		// LIST YOUR REPOS ON ORGANISATION
		if(!this.organisation_name){
			var repo = _PROJECT.organisation_name;
		}else{
			var repo = _PROJECT.current_user.login;
		}
		/* if i have organosation - get from organisation */
		loadFile( function(res) {	
			/* yes - its good token */	
			JSON.parse(res).forEach(function (data, i) {
				if(data.default_branch == _PROJECT.default_branch){
					document.getElementById('submenu').innerHTML += '<div id="login-tab" class="menu-tab" onclick="_PROJECT.get_project(\''+data.full_name+'\')"><i class="material-icons">&#xE24D;</i>'+data.full_name+'</div>'
				}
			});
		},'https://api.github.com/users/'+repo+'/repos',null,
		function(msg){
			alert('I have problem with download https://api.github.com/users/'+repo+'/repos');
		});
		document.getElementById('tooltip-projects').style.display = "flex";
	},
	get_project: function(name){
		var _name = name;
		_GITHUB.get_content({
				'repo':name+'/',
				'branch':this.default_branch,
				'filter':null,
			},
			/* callback */
			function() {
				if( _GITHUB.data[_name+'/']['index.html'] ){
					alert('index-exist');
				}else{
					alert('i dont have index = i create it and start builder');
				}
				
			});
	},
	new_project: function(name){

	},
	check_pages:function(){
		if(this.sitemap.urlset.url.length == 0){
			alert('projects:null');
			return false;
		}
	},
	check_page:function(){
		if(!this.project_name){
			alert('selected project:null');
			return false;
		}
	},
}
_PROJECT.set_status();




/*
{"loc":"http://www.sitemappro.com/","lastmod":"2016-05-27T23:55:42+01:00","changefreq":"daily","priority":"0.5"},
{"loc":"http://www.sitemappro.com/download.html","lastmod":"2016-05-26T17:24:27+01:00","changefreq":"daily","priority":"0.5"}
*/