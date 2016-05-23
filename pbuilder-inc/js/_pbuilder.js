var _PBuilder = {
	/* PROJECTS AND PAGES */
	'projects':{
		
	},
	
	/* TEMPLATE SECTON */
	'boiler_repo':'', /* template source */
	'data':{}, /* content example file */
	'schema':{}, /* properties for html sections */
	'properties':{}, /* global properties */	
	/* TECH SECTON */
	'loaded_components':{},
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
	init: function(boiler_repo){
		var _t = this;
		_t.boiler_repo = boiler_repo;
		/* Render App from file*/
		if(localStorage.actual_landing_data){
			//this.init_Callback(JSON.parse(localStorage.actual_landing_data));
		}else{
			
			_GITHUB.get_content({
				'repo':_t.boiler_repo,
				'branch':'master',
				'filter':['page'],
			},
			/* callback */
			function() {
				_t.data = JSON.parse(atob(_GITHUB.data[_t.boiler_repo]['page-content.json']));
				_t.schema = JSON.parse(atob(_GITHUB.data[_t.boiler_repo]['page-properties.json'])).schema;
				_t.properties = JSON.parse(atob(_GITHUB.data[_t.boiler_repo]['page-properties.json'])).properties;
				//localStorage.actual_landing_data = _GITHUB.data[_t.boiler_repo]['page-content.json'];
				
				document.getElementById("page-builder").innerHTML = atob(_GITHUB.data[_t.boiler_repo]['page.html']);
				document.getElementById("page-builder-wraper").style.display = 'block';

				_t.init_Callback(JSON.parse(atob(_GITHUB.data[_t.boiler_repo]['page-content.json'])));
			});
		} 		
	},
	/* 2 INIT callback - update app object */
	init_Callback : function(data){
		/* build data model */
		this.data = data;
		this.data = _clear_at_start(data);

		/* LOAD FROM GITHUB */
		_GITHUB.get_content({
			'repo':_PBuilder.properties['css_source'],
			'branch':'master',
			'filter':['abrahamlincoln'],
			},
			/* callback */
			function() {
				console.log('--LOADED DATA--');
				var d = _GITHUB.data[_PBuilder.properties['css_source']];
				var out = '<style>';
				for(var index in d) { 
					out += atob(d[index]);
				}
				out +='</style>';
				document.getElementsByTagName("head")[0].innerHTML += out;
				_PBuilder.load_components();
		});
	},	
	load_components(){
		console.log('## LOAD COMPONENTS GITHUB ##');
		_this = this;
		var filter = [];
		if(this.schema){
			for(var _i in this.schema) { 			
				filter.push(this.schema[_i].default_component);
			}
		}
		_GITHUB.get_content({
			'repo':'relu-org/ArthurWellesleyComponents/',
			'branch':'master',
			'filter':filter,
			},
			/* callback */
			function() {
				var _in = _GITHUB.data['relu-org/ArthurWellesleyComponents/'];
				for(var _i in _in) {					
					_this.loaded_components[_i] = atob(_in[_i]);
				}
				console.log(_this.loaded_components);
				_this.load_components_callback();
		});
	},
	/* 3 Load components callback - RUN APP */
	load_components_callback: function(){
		save_local_grid();
		/* render defaults components */
		var to_drag_and_drop = [];
		for (section in this.schema){			
			/* set editable section */
			if(this.schema[section].new){
				out = '<div onclick="_PBuilder.add_new(this)" class="add-new-element" data-add="'+section+'">';
				out += '<i class="material-icons">&#xE146;</i></div>';
				document.getElementById(section).outerHTML += out;
			}
			/* get templates and render it */
			var tpl_part = this.loaded_components[this.schema[section]['default_component']];	
			var content = this.data[ this.J_kIx(section) ];
			console.log(content);
			if(content){
				this.data[ this.J_kIx(section) ].elements.forEach(function (data, i) {
			   		_PBuilder.render(data, tpl_part, section);
				});
			}
			if(this.schema[section].dragdrop){
				to_drag_and_drop.push(document.getElementById(section));
			}
		}	
		console.log(to_drag_and_drop);
		/* ------------- */
		/* DRAG AND DROP */	
		var min = 0;
		this.dragobj = dragula(to_drag_and_drop
		).on('drag', function (el) {
			min = document.getElementById("page-builder").offsetHeight;
			document.getElementById("page-builder").style['min-height']=min;
			_bTrform.off();
			_PBuilder.moved_element(el,'from');
		}).on('drop', function (el) {
			_bTrform.on();
			_PBuilder.moved_element(el,'to');
			save_local_grid();
		});	
	},


	
	render: function(data, tpl_part, target){
		
		console.log('render');
		var out = '';

		out += tpl_part;
		//out += '</div>';
		out = out.replace(/\\"/g, '"');
		/* create data */

		var tempHTML = doT.template(out);
		var tempCONTENT = data;

		var controlls='<div class="controlls">';
		//out += '<div class="tech-wrapper">';
		/* check is this section have delete */	

		/*out += '<div class="drag"> <a href="#none"><i class="material-icons">&#xE25D;</i></a></div>';*/
		
		if(this.schema[target].remove){
			controlls += '<div class="controll remove" onmousedown="event.stopPropagation()" onclick="_PBuilder.remove(this,\''+this.schema[target].remove+'\')"><a href="#none"><i class="material-icons">&#xE92B;</i></a></div>';
		}
		if(this.schema[target].edit_this){
			controlls += '<div class="controll edit" onmousedown="event.stopPropagation()" onclick="_PBuilder.edit(this); return false"><a href="#openModal"><i class="material-icons">&#xE254;</i></a></div>';
		}
		controlls += '</div>';

		/* rebuild exist element */
		var elements = document.getElementById(target).children;
		for( var i = 0; i<elements.length; i++){
			if(elements[i].classList.contains('gu-transit')){
				console.log(elements[i]);
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
		var valut_obj = this.data[ this.J_kIx( this.move_element.from.section) ].elements[this.move_element.from.index];
		/* remove */
		this.data[ this.J_kIx( this.move_element.from.section) ].elements.splice(this.move_element.from.index, 1);
		/* add */
		this.data[ this.J_kIx( this.move_element.to.section) ].elements.splice(this.move_element.to.index, 0, valut_obj);
		/* --------- */
		/* check if i should change template */
		if(this.schema[this.move_element.to.section]['extended_default_component']){
			var tpl_part = this.loaded_components[ this.schema[this.move_element.to.section]['default_component'] ];
			this.render(
				valut_obj,
				this.loaded_components[ this.schema[this.move_element.to.section]['default_component'] ], 
				this.move_element.to.section
			);
		}
	},

	/* ------------------------ */
	/* actions */
	/* ------------------------ */

	remove: function(el,target){
		var wraper = getClosest(el, 'section');
		this.J_delete(wraper.parentNode.id, this.DOM_Ix( wraper ));
		wraper.parentNode.removeChild(wraper);
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
		var tpl_part = _PBuilder.loaded_components[_PBuilder.schema[_t.id]['default_component']];	
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
		console.log(this.data);
		//document.getElementById('page-builder-wraper').classList.toggle('blur');
		window.location.hash = '#openModal';
		
		/* todo HARDCODED FIND xestion calsss !!!!!! */
		this.e_obj.section = getClosest(el, 'section');
		
		this.e_obj.section_index = this.J_kIx(this.e_obj.section.id);
		this.e_obj.element = getClosest(el, '.bx');
		this.e_obj.element_index = this.DOM_Ix( this.e_obj.element );
		this.e_obj.constrols = this.e_obj.element.querySelectorAll('[data-bx]');
		this.e_obj.data_fragment = this.data[this.e_obj.section_index].elements[this.e_obj.element_index];
		
		console.log(this.e_obj);
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
			document.getElementById('exist-preview').style.display = 'none';
			document.getElementById('dropzone').setAttribute("value", upload_path+file.name); 

		});
	},
	build_elem_form: function(e_obj){
		this.e_obj = e_obj;
		var out = '<div id="editor-wraper" onkeypress="_PBuilder.editor_keypress(event)">';
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
		/*var usage_template = this.loaded_components[this.schema[section.id]['default_component']];
		var result = usage_template.match(/{{=it.(.*?)}}/g).map(function(val){
			alert(val);
			return val.replace(/<\/?b>/g,'');
		});*/
		out += '<a id="save-content" class="button" onclick="_PBuilder.editor_save()" href="#close">Save</a>';
		out += '</div>';
		document.getElementById('modal-content').innerHTML = out;
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
			this.data[this.e_obj.section_index].elements[this.e_obj.element_index][_name] = _value;
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
			var obj = this.schema; 
		}		
		return Object.keys(obj).indexOf(key);
	},
	J_delete: function(section, index){
		this.data[this.J_kIx( section)].elements.splice(index, 1);
	},
	DOM_Ix: function(el){
     	return Array.prototype.indexOf.call(el.parentNode.children, el);
	},

	/* ###################################################################################### */
	/* JSON MANIPULATIONS */
	J_merge: function(section, data){

		/* J_merge */
		//var tech_array = data.concat(this.data[section].elements); 
		//this.data[section].elements = tech_array;
		
		/* overwrite */
		this.data[section].elements = data;
		this.templating_data(section);
	},
}