/* pbuilder assets path */
var assets_path = "pbuilder-assets/";
var upload_path = "pbuilder-upload/";
/*clear localsorage*/
localStorage.clear();
//window.page_slug = "strona-xxx";

/* boilerplate repo */
//this.boiler_repo = 'relu-org/relu-boilerplate/';

var new_object = [{
	"title": "Propably best new article on the internet!",
	"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
	"background": upload_path+"unsplash.example2.jpeg",
	"linkname": "Learn more",
	"linktarget": "html://google.com"
}];

var loadFile = function (callback, file, post_data, error, method) {
    var xobj = new XMLHttpRequest();
    //xobj.overrideMimeType("application/json");
    if(post_data){
        if(method){
            xobj.open(method, file, true); 
            xobj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        }else{
            xobj.open('POST', file, true); 
            xobj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        }
    }else{
    	xobj.open('GET', file, true); 
    }
    xobj.onreadystatechange = function () {
        
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
            return true;
        }
        if (xobj.readyState == 4 && xobj.status == "201") {
            callback(xobj.responseText);
            return true;
        }
        if(xobj.readyState == 4 && xobj.status == "403") {        	
        	var msg = JSON.parse(xobj.responseText);
        	msg.error = 'loadFile:error 403';
        	if(msg.message){
        		document.getElementById("preloader-bar").setAttribute('style','opacity:1; background-color:rgb(164, 25, 25); width:100%');
        		document.getElementById("preloader-bar").innerHTML = msg.message;
        		//document.getElementById("modal-content-wrapper").innerHTML += '<div><a href="'+msg.documentation_url+'" target="_blank">'+msg.documentation_url+'</a></div>';
        	}
        	error(msg);
            return true;
        }
        if(xobj.status == "404") {  
			var msg ={};
			msg.error = 'FATAL ERROR\n'+file+' \nDOESNT EXIST';
        	error(msg);
            return true;        	
        }
    };
    //xobj.send('data='+btoa(JSON.stringify(post_data)));  
    xobj.send(JSON.stringify(post_data));  
}
var load_content = function(callback,path,data){	
	loadFile( function(response) {		
		var tempHTML = doT.template(response);
		var tempCONTENT = data;
		callback(tempHTML(tempCONTENT));
	},path,null,
	function(msg){
		alert('app error [_tech.js]:content file doesnt extst');
	});
}

/* on first load clear elements with section (if databese have elements to render) */
var _clear_at_start = function(data){
	/* hardocoded alweays clear elements-agregator */
	//delete data['elements-agregator'];
	//data['elements-agregator'] = {'elements':[]};
	return data;
}

/* CLIMBING UP TECH FUNCTION */
/*
http://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/
*/
var getClosest = function (elem, selector) {
    var firstChar = selector.charAt(0);
    // Get closest match
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
        // If selector is a class
        if ( firstChar === '.' ) {
            if ( elem.classList.contains( selector.substr(1) ) ) {
                return elem;
            }
        }
        // If selector is an ID
        if ( firstChar === '#' ) {
            if ( elem.id === selector.substr(1) ) {
                return elem;
            }
        } 
        // If selector is a data attribute
        if ( firstChar === '[' ) {
            if ( elem.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
                return elem;
            }
        }
        // If selector is a tag
        if ( elem.tagName.toLowerCase() === selector ) {
            return elem;
        }
    }
    return false;
};

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}
