var _PROJECT = {
	"token":sessionStorage.access_token, // |[var_def:index.php]|
	"current_user":"localhost-dadmor",
	"organisation_name":null, /* if usser have projects in organisation [localhost-damor]*/ 
	"git_user":null, /* set user form current or organisation */
	"repo_name":null,
	"project_name":null, /* user + repo */
	"user_branch":null,
	"public_branch":"gh-pages",
	"published_url":null,
	"projectmap":[],
	"sitemap":[],
	"current_page":null,
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
				console.log(_PROJECT.current_user);
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
			_PROJECT.projectmap = JSON.parse(res);
			load_projects_list();
		},'https://api.github.com/users/'+this.git_user+'/repos',null,
		function(msg){
			alert('I have problem with download https://api.github.com/users/'+this.git_user+'/repos');
		});
		document.getElementById('tooltip-projects').style.display = "flex";
	},
	get_project: function(name){
		
		clear_tabs();
		document.getElementById('tooltip-projects').style.display = "none";
		
		_PROJECT.project_name = name;
		_GITHUB.get_content({
				'repo':name+'/',
				'branch':this.public_branch,
				'filter':undefined,
			},
			/* callback */
			function() {
				console.log(_GITHUB.data);
				document.getElementById('header-description').innerHTML = "<h1><span style='font-weight:bold; color:#fff'>Project:</span> "+_PROJECT.project_name+"</h1><h2>Page:"+""+"</h2>";
				
				if( !_GITHUB.data[_PROJECT.project_name+'/']['.uigen/init.txt'] ){
					alert('Critical error: I dont have  init file');
				}
				if( !_GITHUB.data[_PROJECT.project_name+'/']['index.html'] ){
					console.log('create page with map');
					_PROJECT.sitemap.push({'name':'index.html'});

					document.getElementById('tooltip-pages').style.display = "flex";
					document.getElementById('tooltip-template').style.display = "flex";
					document.getElementById('page-builder-wraper').style.display = "block";
				}				
			});
	},
	new_project_modal: function(name){
		load_content( function(_r) {	
			window.location.hash = '#openModal';
			_DOM['modal-opn'].innerHTML = _r;
		},'pbuilder-inc/gui-content/_PROJECT-add-new.html',{"m_title":"Name your new project"});
	},
	new_project_add: function(){
		
		clear_tabs();
		document.getElementById('tooltip-projects').style.display = "none";
		
		this.repo_name = document.getElementById('add-new-input').value;
		this.project_name = this.git_user + '/' + this.repo_name;
		document.getElementById('header-description').innerHTML = "<h1><span style='font-weight:bold; color:#fff'>Project:</span> "+this.project_name+"</h1><h2>Page:"+""+"</h2>";
		/*'repo dont exist - OK'*/
		loadFile( function(response) {	
				console.log('new repository created');


				/* -------------------------------------------------------- */
				loadFile( function(response) {		
						console.log('init.txt created');					
						document.getElementById('tooltip-pages').style.display = "flex";
						document.getElementById('tooltip-template').style.display = "flex";
						document.getElementById('page-builder-wraper').style.display = "block";						
				},
					'https://api.github.com/repos/'+ _PROJECT.project_name+'/contents/.uigen/init.txt?ref='+_PROJECT.public_branch+'&access_token='+sessionStorage.access_token, 
				{ 
					"message": "add UiGEN properties",
					"path": ".uigen/init.txt",
					"content": window.btoa("true"),
					"branch": _PROJECT.public_branch
				},
				function(msg){
					alert('error 404');
				},"PUT");
				/* -------------------------------------------------------- */

		},
			'https://api.github.com/user/repos?access_token='+sessionStorage.access_token, 
		{
		  "name": _PROJECT.repo_name,
		  "description": "Static website from UiGEN.org",
		  "homepage": "http://uigen.org",
		  "private": false,
		  "has_issues": true,
		  "has_wiki": true,
		  "has_downloads": true,
		},
		function(msg){
			alert('error 404');
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
						console.log('page-properties.json created');
					},
						'https://api.github.com/repos/'+_PROJECT.project_name+'/contents/.uigen/page-properties.json?access_token='+sessionStorage.access_token, 
					{ 
						"message": "add UiGEN properties",
						"path": ".uigen/page-properties.json",
						"content": properties,
						"branch": _PROJECT.public_branch
					},
					function(msg){
						alert('error 404');
					},'PUT');

					/* -------------------------------------------------------- */
					loadFile( function(response) {	
						//console.log(response);
						console.log('page-content.json created');
					},
						'https://api.github.com/repos/'+_PROJECT.project_name+'/contents/.uigen/page-content.json?access_token='+sessionStorage.access_token, 
					{ 
						"message": "add UiGEN content",
						"path": ".uigen/page-content.json",
						"content": data,
						"branch": _PROJECT.public_branch
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



