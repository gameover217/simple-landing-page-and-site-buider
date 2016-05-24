var _PROJECT = {
	"token":sessionStorage.access_token, // |[var_def:index.php]|
	"current_user":"localhost-dadmor",
	"organisation_name":null, /* if usser have projects in organisation [localhost-damor]*/ 
	"git_user":null, /* set user form current or organisation */
	"project_name":null,
	"user_branch":null,
	"public_branch":"master",
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
		// LIST YOUR REPOS ON ORGANISATION		
		this.check_token();
	},

	check_token:function(){
		if(!this.token){
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
				if(_PROJECT.organisation_name){
					_PROJECT.git_user = _PROJECT.organisation_name;
				}else{
					_PROJECT.git_user = _PROJECT.current_user.login;
				}
				document.getElementById('login-tab').innerHTML = '<i class="material-icons">&#xE8A6;</i> '+_PROJECT.current_user.login;
				_PROJECT.check_project();
			},'https://api.github.com/user?access_token='+this.token,null,
			function(msg){
				alert('I have problem with download https://api.github.com/user');
			});
		}
	},
	/* PROJECT SECTION */
	check_project:function(){
		
		/* if i have organosation - get from organisation */
		loadFile( function(res) {	
			/* yes - its good token */	
			var out = '<div id="add-project-tab" class="menu-tab" onclick="_PROJECT.new_project_modal()">';
			out += '<i class="material-icons">&#xE147;</i> add new project';
			out += '</div>';
			document.getElementById('submenu').innerHTML = out;
			JSON.parse(res).forEach(function (data, i) {
				if(data.default_branch == _PROJECT.public_branch){
					document.getElementById('submenu').innerHTML += '<div class="menu-tab" onclick="_PROJECT.get_project(\''+data.full_name+'\')"><i class="material-icons">&#xE88A;</i>'+data.full_name+'</div>'
				}
			});
		},'https://api.github.com/users/'+this.git_user+'/repos',null,
		function(msg){
			alert('I have problem with download https://api.github.com/users/'+this.git_user+'/repos');
		});
		document.getElementById('tooltip-projects').style.display = "flex";
	},
	get_project: function(name){
		_PROJECT.project_name = name;
		_GITHUB.get_content({
				'repo':name+'/',
				'branch':this.public_branch,
				'filter':null,
			},
			/* callback */
			function() {

				if( _GITHUB.data[_PROJECT.project_name+'/']['index.html'] ){
					alert('index-exist');
				}
				if( _GITHUB.data[_PROJECT.project_name+'/']['index.html'] ){
					alert('index-exist');
				}
				console.log(_GITHUB.data[_PROJECT.project_name+'/']);
				//alert(_GITHUB.data[_name+'/'].length); 

				//alert('i dont have index = i create it and start builder');
				
			});
	},
	new_project_modal: function(name){
		load_content( function(_r) {	
			window.location.hash = '#openModal';
			document.getElementById('openModal').innerHTML = _r;
		},'pbuilder-inc/gui-content/_PROJECT-add-new.html',{"m_title":"Name your new project"});
	},
	new_project_add: function(){
		this.project_name = document.getElementById('add-new-input').value;
		loadFile( function(res) {	
			alert('repo exist - please create project with different name');
		},'https://api.github.com/repos/'+this.git_user+'/'+this.project_name,null,
		function(msg){
			/*'repo dont exist - OK'*/
			loadFile( function(response) {	
				console.log('OK - repo created:)');
				document.getElementById('tooltip-pages').style.display = "flex";
			},
				'https://api.github.com/user/repos?access_token='+sessionStorage.access_token, 
			{
			  "name": _PROJECT.project_name,
			  "description": "Static website from UiGEN.org",
			  "homepage": "http://uigen.org",
			  "private": false,
			  "has_issues": true,
			  "has_wiki": true,
			  "has_downloads": true,
			  "auto_init": true
			},
			function(msg){
				alert('error 404');
			});

		});
	},
	project_update: function(){
		
		if(Object.keys(_GITHUB.data).length == 0){
			alert('add page to published');

		}else{

			var data = window.btoa(JSON.stringify(_PBuilder.data));
			var schema = window.btoa(JSON.stringify(_PBuilder.schema));
			var properties = window.btoa(JSON.stringify(_PBuilder.properties));
			window.location.href="#openModal";

			out = "Generating static WebPage now...<br>Please wait...";
			document.getElementById('modal-content').innerHTML = out;
			
				loadFile( function(saveData) {
					out = "Page was created and pushing to repo";
					document.getElementById('modal-content').innerHTML = out;

					/* -------------------------------------------------------- */
					loadFile( function(response) {	
						//console.log(response);
					},
						'https://api.github.com/repos/'+_PROJECT.project_name+'/contents/.uigen/page-properties.json?access_token='+sessionStorage.access_token, 
					{ 
						"message": "add UiGEN properties",
						"path": ".uigen/page-properties.json",
						"content": properties
					},
					function(msg){
						alert('error 404');
					},'PUT');

					/* -------------------------------------------------------- */
					loadFile( function(response) {	
						//console.log(response);
					},
						'https://api.github.com/repos/'+_PROJECT.project_name+'/contents/.uigen/page-content.json?access_token='+sessionStorage.access_token, 
					{ 
						"message": "add UiGEN properties",
						"path": ".uigen/page-content.json",
						"content": data
					},
					function(msg){
						alert('error 404');
					},'PUT');

				
					
			},
			 'pbuilder-publisher/publish.php', 
			{
				"data":data,
				"properties":properties,
				"schema":schema,
				"page_slug":window.page_slug,
				"css":_GITHUB.data[_PBuilder.properties.css_source],
				"html":_GITHUB.data[_PBuilder.boiler_repo]['page.html']
			},
			function(msg){
				alert('error: pbuilder-publisher/publish.php');
			});
		}
	},
	/* PAGES SECTION */
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