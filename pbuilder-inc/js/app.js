/* TODO */
/* 1. clear #s~ node from inner elements !!!! */
/* 2. find and kill this.e_obj.section = getClosest(el, '.bx-wrapper'); */





var save_local_grid = function(){
	
	localStorage.actual_landing_data =  JSON.stringify(_PBuilder.data);

	var str = JSON.stringify(_PBuilder.data, null, 2);
	document.getElementById('inspector-content').innerHTML = "##:DATA\n";
	document.getElementById('inspector-content').innerHTML += str;
	var str = JSON.stringify(_PBuilder.schema, null, 2);
	document.getElementById('inspector-content').innerHTML += "\n\n##:SHEMA\n";
	document.getElementById('inspector-content').innerHTML += str;
	var str = JSON.stringify(_PBuilder.move_element, null, 2);
	document.getElementById('inspector-content').innerHTML += "\n\n##:DRAG AND DROP\n";
	document.getElementById('inspector-content').innerHTML += str;
}


function gui_designers(){
	document.getElementById('gui_zoom_button').classList.toggle('active');
	if(document.getElementById('gui_zoom_button').classList.contains("active")){
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
		document.getElementById('modal-content').innerHTML = out;
		loadFile( function(res) {	

				console.log(res)	
				
				out = "<b>Your site was created on:</b><br/>";
				out += "pbuilder-upload/"+window.page_slug;
				out += "<p>Copy this link and enjoy!!</p>";

				out = res;
				document.getElementById('modal-content').innerHTML = out;
				
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
			document.getElementById('modal-content').innerHTML = out;
		});
	}
}

function my_tab(t) {
    
    var x = document.getElementsByClassName("menu-tab");
	for (var i = 0; i < x.length; i++) {
	    x[i].classList.remove("active");
	}
	t.classList.toggle('active');
	document.getElementById('submenu').style.display = "block";
}


