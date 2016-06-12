/* TODO */
/* 1. clear #s~ node from inner elements !!!! */
/* 2. find and kill this.e_obj.section = getClosest(el, '.bx-wrapper'); */


/* DOM PERFORMANCE SECTION ---------------- */
var _DOM = {
	"insp-content": gID('inspector-content'),
	"gui-zoom-btn": gID('gui_zoom_button'),
	"modal-ctnt": gID('modal-content'),
	"modal-opn": gID('openModal'),
	"sub-mnu": gID('submenu'),
	"pg-builder": gID("page-builder"),
	"ex-prev": gID('exist-preview'),
	"drop-z": gID('dropzone'),
	"hed-dsc": gID('header-description'), 
}
function gID(id){
	return document.getElementById(id);
}
/* -----------------------------------------*/

var templates = [
{
	"name":"RELU Person",
	"repo":"relu-org/relu-boilerplate/"
},
{
	"name":"Karl Marks",
	"repo":"UiGENpages/karlmarks-boilerplate/"
},
]


/* create MENU */
var mbtn_tpl = "pbuilder-inc/gui-content/context_menu-buttons.html";

_CX_MENU.init(
	'contextmenu', /* menu container ID */
	'submenu', /* submenu container ID */
	{
		"name":null, /* string */
		"id":null, /* string */
		"ico":null, /* string */
		"tpl_path":null, /* string */
		"onclick_callback":null, /* string */
		"submenu":null, /* bolean */
		"href":null /* string */
	}
);
/* -----------------------------------------*/
_CX_MENU.register_menu(
	{
		"name":"Login", /* string */
		"id":"login-tab", /* string */
		"ico":"&#xE913;", /* string */
		"tpl_path":mbtn_tpl, /* string */
		"submenu":false, /* bolean */
		"href": "http://uigen.org/Otto-von-Bismarck?remote" /* string */
	},function(done){		
		
		/* -----------------------------------------*/
		/* -----------------------------------------*/
		/* user autologin */
		_USER.login(
			/* success */
			function(res){
				document.getElementById('login-tab').setAttribute("onclick", "open_current_user()");
				document.getElementById('login-tab').innerHTML = '<i class="material-icons">&#xE85E;</i>  '+_USER.current.login;
				_CONTEXT_HELP.init();

			},
			/* fail */
			function(){
				//alert('I dont have token - fuck you!!!');
				_CONTEXT_HELP.init();
			}
		);
		/* -----------------------------------------*/
		/* -----------------------------------------*/

	}
	);

function open_current_user(){
	right_bar_open();
	viz_data(_USER);
}
/* -----------------------------------------*/
_CX_MENU.register_menu(
	{
		"name":"Projects", /* string */
		"id":"projects-tab", /* string */
		"ico":"&#xE88A;", /* string */
		"tpl_path":mbtn_tpl, /* string */
		"onclick_callback":"_cx_menu_projects",
		"submenu":true /* bolean */
	}
);
/* Example contstruction with callback-listener for Agent */
var menu_projects_callback;
var _cx_menu_projects = function(){	
	if(_USER.current){		
		_PROJECT.get_list(_USER.token, menu_projects_callback = function(res){
			//_AGENT.store_callback('project_get_list_callback');
			load_content( function(_r) {	
				_DOM['sub-mnu'].innerHTML = _r;				
			},
			'pbuilder-inc/gui-content/project-list.html',
			{
				"list": res,
				"branch":_PROJECT.crnt_pub_branch,
				"active":_PROJECT.crnt_name
			});
		});
	}
}

var get_project_callback;
var get_project = function(repo){
	if(repo != _PROJECT.crnt_name){
		_CX_MENU.close();
		_CONTEXT_HELP.close();
		_PROJECT.get_files({'token':_USER.token, 'repo':repo, 'path':''}, get_project_callback = function(res){
			_PROJECT.crnt_name = repo;
			_PAGE.site_map = res;
			_CONTEXT_HELP.show_help('pages-tab','Choose page');
		});
	}else{
		_CX_MENU.close();
	}
}

var new_project_show_modal = function(){
	load_content( function(_r) {	
		window.location.hash = '#openModal';
		_DOM['modal-opn'].innerHTML = _r;
	},'pbuilder-inc/gui-content/project-add-modal.html',{"m_title":"Name your new project"});
}

var new_project_run_callback;
var new_project_run = function(_t){
	_PROJECT.create(_USER.token, _t.previousSibling.value, new_project_run = function(res){
		console.log('app:project created');
		var project_response = res;
		_PAGE.site_map = [{"url":"index.html"}];
		_PAGE.create(_USER.token, _PROJECT.crnt_name, [
			{"file_name":"index.html","content":window.btoa("UiGEN index empty file")},
		],function(success){
			project_response.default_branch = _PROJECT.crnt_pub_branch;
			_PROJECT.files_list.push(project_response);
			load_content( function(_r) {	
				_DOM['sub-mnu'].innerHTML = _r;				
			},
			'pbuilder-inc/gui-content/project-list.html',
			{
				"list": _PROJECT.files_list,
				"branch":_PROJECT.crnt_pub_branch
			});
		});
		
	});
}

/* -----------------------------------------*/
_CX_MENU.register_menu(
	{
		"name":"Pages", /* string */
		"id":"pages-tab", /* string */
		"ico":"&#xE24D;", /* string */
		"tpl_path":mbtn_tpl, /* string */
		"onclick_callback":"_cx_menu_pages", /* string */
		"submenu":true /* bolean */
	}
);
var menu_pages_callback;
var _cx_menu_pages = function(data){
	if(_USER.current){	
		load_content( function(_r) {	
			_DOM['sub-mnu'].innerHTML = _r;
		},
		'pbuilder-inc/gui-content/pages-list.html',
		{
			"list": _PAGE.site_map,
			"project": _PROJECT.crnt_name
		});
	}
}

var get_page_callback;
var get_page = function(name){
	_CX_MENU.close();
	_PAGE.crnt_name = name;
	load_content( function(_r) {	
		_DOM['hed-dsc'].innerHTML = _r;
	},
	'pbuilder-inc/gui-content/project-breadcrumb.html',
	{
		"project": _PROJECT.crnt_name,
		"page": _PAGE.crnt_name
	});

	/* load template linked with page */
	/* page is ok - I check pagebuilder !!!! */
	alert('todo: check is page have boilerplate')
	_PBuilder.init(_PROJECT.crnt_name,_PAGE.crnt_name);



	/* TODO - check is page have theme */
	document.getElementById('page-builder-wraper').style.display = 'block';
	_CONTEXT_HELP.show_help('templates-tab','Select page theme :D');


}

/* -----------------------------------------*/
_CX_MENU.register_menu(
	{
		"name":"Templates", /* string */
		"id":"templates-tab", /* string */
		"ico":"&#xE8F1;", /* string */
		"tpl_path":mbtn_tpl, /* string */
		"onclick_callback":"_cx_menu_tpl", /* string */
		"submenu":true /* bolean */
	}
);
var _cx_menu_tpl = function(data){
	if(_USER.current){	
		load_content( function(_r) {	
			_DOM['sub-mnu'].innerHTML = _r;
		},
		'pbuilder-inc/gui-content/templates-list.html',
		{
			"list": templates,
		});
	}
}

var get_template_callback;
/* where is template list */
var get_template = function(repo_name,init_filename){
	_CX_MENU.close();
	_CONTEXT_HELP.close();
	_PBuilder.init(repo_name,init_filename);
}
/* -----------------------------------------*/

var _PUB = {
	prop: {
		data:null,
		schema:null,
		properties:null,
		components:null,
		page_slug:null,
		css:null,
		html:null
	},
	init: function(){
		if( (_PROJECT.crnt_name) && (_PAGE.crnt_name) && (_PBuilder.boiler_repo))
		{
			this.prop.data = window.btoa(JSON.stringify(_PBuilder.data));
			this.prop.schema = window.btoa(JSON.stringify(_PBuilder.schema));
			this.prop.properties = window.btoa(JSON.stringify(_PBuilder.properties));
			this.prop.components = window.btoa(JSON.stringify(_PBuilder.loaded_components));
			this.prop.page_slug = window.page_slug;
			this.prop.css = _DATA.assets.boilerplates[_PBuilder.properties.css_source];
			this.prop.html = _DATA.assets.boilerplates[_PBuilder.boiler_repo][_PBuilder.init_filename+'.html'];
			
			loadFile( function(saveData) {
				_PAGE.create(_USER.token, _PROJECT.crnt_name, JSON.parse(saveData));
				alert('page created: http://'+_USER.current.login+'.github.io/yourprojectname/')
			},
			'pbuilder-publisher/publish.php', 
			this.prop,
			function(msg){
				alert('error: pbuilder-publisher/publish.php');
			});
		}else{
			alert('Project:'+_PROJECT.crnt_name);
			alert('Page:'+_PAGE.crnt_name);
			alert('Temlate:'+_PBuilder.boiler_repo);
		} 
	}	
}





/* -------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------- */

/* off now */
var save_local_grid = function(){
	localStorage.actual_landing_data =  JSON.stringify(_PBuilder.data);
	var str = JSON.stringify(_PBuilder.data, null, 2);
	var str = JSON.stringify(_PBuilder.schema, null, 2);
	var str = JSON.stringify(_PBuilder.move_element, null, 2);

}


function gui_designers(){
	_DOM['gui-zoom-btn'].classList.toggle('active');
	if(_DOM['gui-zoom-btn'].classList.contains("active")){
		_bTrform.init();			
	}else{		
		_bTrform.destroy();
	}
	window.location.href="#";
}
/* rejeted */
function gui_save(){
	
	if(Object.keys(_GITHUB.data).length == 0){
		alert('add page to published');
	}else{

		var data = window.btoa(JSON.stringify(_PBuilder.data));
		var schema = window.btoa(JSON.stringify(_PBuilder.schema));
		var properties = window.btoa(JSON.stringify(_PBuilder.properties));

		window.location.href="#openModal";
		out = "Generating static WebPage now...<br>Please wait...";
		_DOM['modal-ctnt'].innerHTML = out;
		loadFile( function(res) {	

				out = "<b>Your site was created on:</b><br/>";
				out += "pbuilder-upload/"+window.page_slug;
				out += "<p>Copy this link and enjoy!!</p>";

				out = res;
				_DOM['modal-ctnt'].innerHTML = out;
				
				//document.getElementById('body').innerHTML = res;
				//localStorage.actual_landing_data = res;
				//_this.init_Callback(JSON.parse(res));
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
			var data = window.btoa(JSON.stringify(_PBuilder.data));
			var schema = window.btoa(JSON.stringify(_PBuilder.schema));
			var properties = window.btoa(JSON.stringify(_PBuilder.properties));

			var out = "<h3>This version doesnt have unlock external publisher.</h3>";
			out += "<p>Your data (encoded to base64) its here: </p>";
			out += "data:<textarea style='font-size:11px'>"+data+"</textarea>"
			out += "schema:<textarea style='font-size:11px'>"+schema+"</textarea>"
			out += "properties:<textarea style='font-size:11px'>"+properties+"</textarea>"
			_DOM['modal-ctnt'].innerHTML = out;
		});
	}
}
