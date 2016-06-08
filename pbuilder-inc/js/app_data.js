var _DATA = {
	/* repositories */
	assets:{
		boilerplates:{},
		css:{},
		blocks:{}
	},
	sha:{
		boilerplates:{},
		css:{},
		blocks:{}
	},
	/* projects user repos */
	projects:{}, 
	global_content:{}
}

var projects_schema = {
	props:{
		boilerplate_repo:null,
		css_repo:null,
		css_filter:[],
		blocks_repo:null,
		blocks_filter:[]
	},
	schema:{},
	content:{}
}
var input = '<div class="right-tab" onclick="viz_data(_USER)">User</div>';
input += '<div class="right-tab" onclick="viz_data(_DATA)">App</div>';
input += '<div class="right-tab" onclick="viz_data(_PROJECT)">Projecs</div>';
input += '<div class="right-tab" onclick="viz_data(_PAGE)">Pages</div>';
input += '<div class="right-tab" onclick="viz_data(_PBuilder)">Builder</div>';
input += '<pre id="prettyprint" class="prettyprint"></pre>';
document.getElementById('right-bar').innerHTML += input;

function viz_data(data){
	//console.log(data);
	//var jsonHtmlTable = ConvertJsonToTable(eval(data), 'jsonTable', null, 'Download');
	var out = syntaxHighlight(JSON.stringify(data, null, 2));
	document.getElementById('prettyprint').innerHTML = out;
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function right_bar_click(){
	document.getElementById("right-bar").classList.toggle("open");
}