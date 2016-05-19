<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
rel="stylesheet">
<link rel="stylesheet" type="text/css" href="pbuilder-inc/css/dragula.min.css">
<link rel="stylesheet" type="text/css" href="pbuilder-inc/css/medium-editor.min.css">
<link rel="stylesheet" type="text/css" href="pbuilder-inc/css/page-builder.css">
<script type="text/javascript" src="pbuilder-inc/js/dragula.min.js"></script>
<script type="text/javascript" src="pbuilder-inc/js/medium-editor.min.js"></script>
<script type="text/javascript" src="pbuilder-inc/js/doT.min.js"></script>
<script type="text/javascript" src="pbuilder-inc/js/app.js"></script>
<script type="text/javascript" src="pbuilder-inc/js/dropzone.min.js"></script>

<body id="body"  >
	<!-- PRELOADER -->
	<div id="preloader">
		<div id="preloader-bar"></div>
	</div>
	<!-- MAIN HEADER -->
	<div id="main-header">
		<div class="main-ico" onclick="alert('RESTART is lock on this demo')">
			<i class="material-icons">&#xE863;</i>
			RESTART
		</div>
		<div class="main-ico" onclick="gui_save()">
			<i class="material-icons">&#xE2C0;</i>
			SAVE
		</div>
		<div id="gui_zoom_button" class="main-ico" onclick="gui_designers()">
			<i class="material-icons">&#xE323;</i>
			DESIGN MODE
		</div>
		<h1>UiGEN.org page buider</h1>
		<h2>Ultra light static websites crator</h2>
		<a href="https://github.com/dadmor/simple-landing-page-and-site-buider">https://github.com/dadmor/simple-landing-page-and-site-buider</a>
	</div>
	<!-- LEFTBAR -->
	<div id="templates">
		<div class="menu-tab">
		<a href="http://uigen.org/Otto-von-Bismarck?remote">login</a>
			<!-- <div onclick="github_login();">login</div> -->
		</div>
		<div class="menu-tab">
		<a href="http://uigen.org/Otto-von-Bismarck?remote">get-user</a>
			<!-- <div onclick="github_login();">login</div> -->
		</div>
		<div class="menu-tab">
			<i class="material-icons">&#xE88A;</i> Projects
		</div>
		<div class="menu-tab">
			<i class="material-icons">&#xE24D;</i> Pages
		</div>
		<div class="menu-tab">
			<i class="material-icons">&#xE8F1;</i> Templates
		</div>
		<i class="material-icons">&#xE8F1;</i>
		<ul>
			<li onclick="_PBuilder.init('relu-org/relu-boilerplate/')">1</li>
			<li>2</li>
			<li>3</li>
		</ul>
	</div>

	<!-- PAGEBUILDER -->
	<div id="page-builder-wraper">
		<div id="page-builder">
				
		</div>
	</div>

	<!-- INSPECTOR -->
	<div id="inspector" style="overflow:hidden;  padding:1em">
		Inspector
		<pre id="inspector-content" style="font-size:9px;"></pre>
	</div>

	<script>
	function github_login(){
		loadFile( function(response) {
			alert(response);
		}, 'http://uigen.org/Otto-von-Bismarck?remote'); 
		
	}
	</script>
	
</body>