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
	"drop-z": gID('dropzone')
}
function gID(id){
	return document.getElementById(id);
}

/* -----------------------------------------*/
/* user autologin */
_USER.login(
	/* success */
	function(res){
		//alert('user login !!!');
		console.log(res);
	},
	/* fail */
	function(){
		//alert('I dont have token - fuck you!!!');
	}
);
/* -----------------------------------------*/
/* create MENU */
var mbtn_tpl = "pbuilder-inc/gui-content/context_menu-button.html";

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
	}
	);
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
var project_get_list_callback;
var _cx_menu_projects = function(data){
	if(_USER.current){		
		_PROJECT.get_list(_USER.token, project_get_list_callback = function(res){
			//_AGENT.store_callback('project_get_list_callback');
			load_content( function(_r) {	
				_DOM['sub-mnu'].innerHTML = _r;
			},
			'pbuilder-inc/gui-content/project-list.html',
			{
				"list": res,
				"branch":_PROJECT.crnt_pub_branch
			});
		});
	}
}

var get_project = function(repo){
	_CX_MENU.close();
	_PROJECT.get(repo);
}

var new_project_show_modal = function(){
	load_content( function(_r) {	
		window.location.hash = '#openModal';
		_DOM['modal-opn'].innerHTML = _r;
	},'pbuilder-inc/gui-content/project-add-modal.html',{"m_title":"Name your new project"});
}

var project_create_callback;
var new_project_run = function(_t){
	_PROJECT.create(_USER.token, _t.previousSibling.value, project_create_callback = function(res){
		console.log('project created');
		console.log(res);
		_PAGE.create(_USER.token, _USER.current.login, _PROJECT.crnt_name, [
			{"file_name":"init.txt","content":"UiGEN:true"},
			{"file_name":"index.html","content":"UiGEN index empty file"},
			{"file_name":".uigen/index\/properties.json","content":"{}"},
			{"file_name":"site-visual.css","content":"/* UiGEN visual empty css file*/"}
		]);
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
var _cx_menu_pages = function(data){
	console.log(data);
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
	console.log(data);
}
/* -----------------------------------------*/







/* -------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------- */

var save_local_grid = function(){
	localStorage.actual_landing_data =  JSON.stringify(_PBuilder.data);
	var str = JSON.stringify(_PBuilder.data, null, 2);
	_DOM['insp-content'].innerHTML = "##:DATA\n";
	_DOM['insp-content'].innerHTML += str;
	var str = JSON.stringify(_PBuilder.schema, null, 2);
	_DOM['insp-content'].innerHTML += "\n\n##:SHEMA\n";
	_DOM['insp-content'].innerHTML += str;
	var str = JSON.stringify(_PBuilder.move_element, null, 2);
	_DOM['insp-content'].innerHTML += "\n\n##:DRAG AND DROP\n";
	_DOM['insp-content'].innerHTML += str;
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

				console.log(res)	
				
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
