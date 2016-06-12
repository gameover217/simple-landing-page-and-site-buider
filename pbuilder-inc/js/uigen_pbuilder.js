var _PBuilder = {
	/* TECH SECTON */
	'boilerplate_tree':[],
	'boilerplate_files':{},
	'components_tree':[], /*component tree is not important*/
	'component_files':{},

	'repo': null,
	'filename': null,
	'properties':{},
	'content':null,
	
	'dragobj':{},
	'move_element':{
		'from':{
			'section':'section_id',
			'index':null
		},
		'to':{
			'section':'section_id',
			'index':null
		}
	},
	/* 1 INIT - load content data */
	init: function(repo,filename){
			this.repo = repo;
			this.filename = filename;
			_GITHUBAPI.get_files_list({
				'token':_USER.token,
				'repo':this.repo,
				'path':filename
			},
			/* callback */
			function(res) {
				_PBuilder.boilerplate_tree = JSON.parse(res);
				_PBuilder.get_boilerplate_tree();
			});
		//} 		
	},
	/* 2 INIT callback - update app object */
	get_boilerplate_tree : function(){
		
		_GITHUBAPI.get_files_from_list({
			'token':_USER.token,
			'repo':this.repo,
			'list':this.boilerplate_tree
		},
		function(res) {
			/* load properties */
			_PBuilder.properties = JSON.parse(window.atob(_APPDATA[_PBuilder.repo][_PBuilder.filename+'/properties.json'].content));
			/* load css */
			document.getElementById('uigen-style').innerHTML = '';
			for(file in _APPDATA[_PBuilder.repo]) {	
				/* get filetype */
				var file = _APPDATA[_PBuilder.repo][file];
				if(file.name.split(".").slice(-1)[0] == 'css'){
					document.getElementById('uigen-style').innerHTML += window.atob(file.content);
				}
			}
			/* get content */
			_PBuilder.content = JSON.parse(window.atob(_APPDATA[_PBuilder.repo][_PBuilder.filename+'/content.json'].content));
			/* load html */
			_GITHUBAPI.get_file({
			'token':_USER.token,
			'repo':_PBuilder.repo,
			'path':_PBuilder.filename+'.html'
			},function(res2) {
				//console.log(JSON.parse(res2).content);
				_DOM['pg-builder'].innerHTML = window.atob(JSON.parse(res2).content);
				document.getElementById("page-builder-wraper").style.display = 'block';
			});
			
			
			

			_PBuilder.get_components_list();
		});
	},	
	get_components_list: function(){
		
		if(this.properties.schema){
			for(var _i in this.properties.schema) { 			
				this.components_tree.push(
					{
						'name':this.properties.schema[_i].default_component,
						'path':this.properties.schema[_i].default_component
					}
					);
			}
		}
		
		_GITHUBAPI.get_files_from_list({
			'token':_USER.token,
			'repo':this.properties.properties.components_path,
			'list':this.components_tree
		},
		/* callback */
		function(res) {
			/* build component files */
			for(var index in _PBuilder.components_tree) {
				_PBuilder.component_files[_PBuilder.components_tree[index].name] = window.atob(_APPDATA[_PBuilder.properties.properties.components_path][_PBuilder.components_tree[index].name].content);					
			}
			_PBuilder.load_components_callback();
		});
	},
	/* 3 Load components callback - RUN APP */
	load_components_callback: function(){
		save_local_grid();
		/* render defaults components */
		var to_drag_and_drop = [];
		for (section in this.properties.schema){			
			/* set editable section */
			if(this.properties.schema[section].new){
				out = '<div onclick="_PBuilder.add_new(this)" class="add-new-element" data-add="'+section+'">';
				out += '<i class="material-icons">&#xE146;</i></div>';
				document.getElementById(section).outerHTML += out;
			}
			/* get templates and render it */

			var tpl_part = this.component_files[this.properties.schema[section]['default_component']];	
			var content = this.content[ this.J_kIx(section) ];
			if(content){
				this.content[ this.J_kIx(section) ].elements.forEach(function (data, i) {
			   		_PBuilder.render(data, tpl_part, section);
				});
			}
			if(this.properties.schema[section].dragdrop){
				to_drag_and_drop.push(document.getElementById(section));
			}
		}	
		/* ------------- */
		/* DRAG AND DROP */	
		var min = 0;
		this.dragobj = dragula(to_drag_and_drop
		).on('drag', function (el) {
			min = _DOM['pg-builder'].offsetHeight;
			_DOM['pg-builder'].style['min-height']=min;
			_bTrform.off();
			_PBuilder.moved_element(el,'from');
		}).on('drop', function (el) {
			_bTrform.on();
			_PBuilder.moved_element(el,'to');
			save_local_grid();
		});	

	},

	render: function(data, tpl_part, target){

		var out = '';

		out += tpl_part;

		out = out.replace(/\\"/g, '"');
		/* create data */

		var tempHTML = doT.template(out);
		var tempCONTENT = data;

		var controlls='<div class="controlls">';
		
		/* check is this section have delete */	
		if(this.properties.schema[target].remove){
			controlls += '<div class="controll remove" onmousedown="event.stopPropagation()" onclick="_PBuilder.remove(this,\''+this.properties.schema[target].remove+'\')"><a href="#none"><i class="material-icons">&#xE92B;</i></a></div>';
		}
		if(this.properties.schema[target].edit_this){
			controlls += '<div class="controll edit" onmousedown="event.stopPropagation()" onclick="_PBuilder.edit(this); return false"><a href="#openModal"><i class="material-icons">&#xE254;</i></a></div>';
		}
		controlls += '</div>';

		/* rebuild exist element */
		var elements = document.getElementById(target).children;
		for( var i = 0; i<elements.length; i++){
			if(elements[i].classList.contains('gu-transit')){
				elements[i].outerHTML = tempHTML(tempCONTENT);
				document.getElementById(target).getElementsByClassName('bx')[this.move_element.to.index].innerHTML += controlls;
				return false;
			};
		}
		/* add new element */
		document.getElementById(target).innerHTML += tempHTML(tempCONTENT);
		document.getElementById(target).lastChild.innerHTML += controlls;


		
	},
	/* ------------------------ */
	/* drag and drop controller */
	/* ------------------------ */
	
	/* create dragged element start and end point to rebuild json data base object */
	moved_element:function(el,type){
		this.move_element[type].section = el.parentNode.id;
		this.move_element[type].index = this.DOM_Ix(el);
    	if(type == 'to'){
    		this.update_data_after_move();    		
    	}    	
    	return this.move_element;
	},
	update_data_after_move: function(){
		/* get */
		var valut_obj = this.content[ this.J_kIx( this.move_element.from.section) ].elements[this.move_element.from.index];
		/* remove */
		this.content[ this.J_kIx( this.move_element.from.section) ].elements.splice(this.move_element.from.index, 1);
		/* add */
		this.content[ this.J_kIx( this.move_element.to.section) ].elements.splice(this.move_element.to.index, 0, valut_obj);
		/* --------- */
		/* check if i should change template */
		if(this.properties.schema[this.move_element.to.section]['extended_default_component']){
			var tpl_part = this.component_files[ this.properties.schema[this.move_element.to.section]['default_component'] ];
			this.render(
				valut_obj,
				this.component_files[ this.properties.schema[this.move_element.to.section]['default_component'] ], 
				this.move_element.to.section
			);
		}
	},

	/* ------------------------ */
	/* actions */
	/* ------------------------ */

	remove: function(el,target){
		var wraper = getClosest(el, '.s-wrapper');

		this.J_delete(wraper.children[0].id, this.DOM_Ix( getClosest(el, 'article') ));
		wraper.children[0].removeChild( getClosest(el, 'article') );
		/*save_local_grid();*/
	},
	'e_obj':{
		'section':{},
		'section_index':{},
		'element':{},
		'element_index':{},
		'controls':{},
		'data_fragment':{}
	},
	add_new:function(el) {
		// this to ma byc sekcja;
		var _t = document.getElementById(el.getAttribute("data-add"));
		var tpl_part = _PBuilder.component_files[_PBuilder.properties.schema[_t.id]['default_component']];	
		var content = _PBuilder.data[ _PBuilder.J_kIx(_t.id) ];
		
		if(content){
			document.getElementById(_t.id).innerHTML = "";
			var new_section = new_object.concat(content.elements); 
			new_section.forEach(function (data, i) {
		   		_PBuilder.render(data, tpl_part, _t.id);
			});
			content.elements = new_section;
		}else{
			//alert('iam empty i chuj');
		}
	},	
	edit:function(el){
		//document.getElementById('page-builder-wraper').classList.toggle('blur');
		window.location.hash = '#openModal';
		
		/* todo HARDCODED FIND xestion calsss !!!!!! */
		this.e_obj.section = getClosest(el, 'section');
		
		this.e_obj.section_index = this.J_kIx(this.e_obj.section.id);
		this.e_obj.element = getClosest(el, '.bx');
		this.e_obj.element_index = this.DOM_Ix( this.e_obj.element );
		this.e_obj.constrols = this.e_obj.element.querySelectorAll('[data-bx]');
		this.e_obj.data_fragment = this.content[this.e_obj.section_index].elements[this.e_obj.element_index];
		
		/* render form */
		this.build_elem_form(this.e_obj);
		/* TODO & WARNING - always run uploader if run edit window */
		var myDropzone = new Dropzone("div#dropzone", { 
			url: "pbuilder-upload.php",
			thumbnailWidth: "400"
		});

		myDropzone.on("complete", function(file) {
			//remove background example
			//myDropzone.removeFile(file);
			_DOM['ex-prev'].style.display = 'none';
			_DOM['drop-z'].setAttribute("value", upload_path+file.name); 

		});
	},
	build_elem_form: function(e_obj){

		this.e_obj = e_obj;

		var out = '';
		out += '<div>';
		out += '<a href="#close" title="Close" class="close">X</a>';
		out += '<h2 id="modal-title">Edit content block</h2>';
		out += '<div id="modal-content">';
		out += '<div id="editor-wraper" onkeypress="_PBuilder.editor_keypress(event)">';
		for( var i = 0; i<this.e_obj.constrols.length; i++){

			if(this.e_obj.constrols[i].getAttribute("data-bx") == 'title'){
				out += '<input data-edit-controll="true" name="'+this.e_obj.constrols[i].getAttribute("data-bx")+'" value="'+this.e_obj.constrols[i].innerHTML+'" ><br>';
			}
			if(this.e_obj.constrols[i].getAttribute("data-bx") == 'description'){
				out += '<textarea data-edit-controll="true" name="'+this.e_obj.constrols[i].getAttribute("data-bx")+'">'+this.e_obj.constrols[i].innerHTML+'</textarea><br>';
			}
			if(this.e_obj.constrols[i].getAttribute("data-bx") == 'background'){
				out += '<div id="dropzone" data-edit-controll="true" name="'+this.e_obj.constrols[i].getAttribute("data-bx")+'" value="'+this.e_obj.data_fragment[this.e_obj.constrols[i].getAttribute("data-bx")]+'">';
				out += 'add or edit background';
				out += '<div id="exist-preview" style="background-image:url(\''+this.e_obj.data_fragment.background+'\')"></div>';
				out += '</div>';
			}
			
		}
		/* parse template */
		/*var usage_template = this.component_files[this.schema[section.id]['default_component']];
		var result = usage_template.match(/{{=it.(.*?)}}/g).map(function(val){
			alert(val);
			return val.replace(/<\/?b>/g,'');
		});*/
		out += '<a id="save-content" class="button" onclick="_PBuilder.editor_save()" href="#close">Save</a>';
		out += '</div>';
		out += '</div>';
		out += '</div>';
		_DOM['modal-opn'].innerHTML = out;
	},
	editor_keypress: function(e){
		if (e.keyCode == 13) {
			this.editor_save();
			window.location.hash = '#close';
		}
	},
	editor_save:function(){
		var edited_controlls = document.querySelectorAll('[data-edit-controll]');
		for( var i = 0; i<edited_controlls.length; i++){
			
			if( edited_controlls[i].getAttribute("name")=='background'){
				
				var _name = edited_controlls[i].getAttribute("name");
				var _value = edited_controlls[i].getAttribute("value");
			
			}else{
				
				var _name = edited_controlls[i].name;
				var _value = edited_controlls[i].value;
			
			}
			/* update JSON */
			this.content[this.e_obj.section_index].elements[this.e_obj.element_index][_name] = _value;
			/* update DOM */
			if(document.querySelector("[data-bx="+_name+"]") != null){
				
				if(_name == 'background'){
					var out = "background-image:url('"+_value+"');";
					this.e_obj.element.querySelector("[data-bx="+_name+"]").setAttribute('style',out);
				}else{
					this.e_obj.element.querySelector("[data-bx="+_name+"]").innerHTML = _value;
				}
				
			}
			
		}
		save_local_grid();
	},

	/* ------------------------ */
	/* tech */
	/* ------------------------ */
	/* get key index */
	J_kIx: function(key, shema){
		if(shema == undefined){
			var obj = this.properties.schema; 
		}		
		return Object.keys(obj).indexOf(key);
	},
	J_delete: function(section_id, el_index){
		this.content[this.J_kIx(section_id)].elements.splice(el_index, 1);
	},
	DOM_Ix: function(el){
     	return Array.prototype.indexOf.call(el.parentNode.children, el);
	},

	/* ###################################################################################### */
	/* JSON MANIPULATIONS */
	J_merge: function(section, data){

		/* J_merge */
		//var tech_array = data.concat(this.content[section].elements); 
		//this.content[section].elements = tech_array;
		
		/* overwrite */
		this.content[section].elements = data;
		this.templating_data(section);
	},
}