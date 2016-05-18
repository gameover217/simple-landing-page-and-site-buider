<!DOCTYPE html>
<html lang="en" class=" is-copy-enabled">
<head>
	<title>Simple landing page and site buider</title>
	<META name="Description" content="Ultra light static websites crator">
</head>
<body id="body"  >
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">
	<link rel="stylesheet" type="text/css" href="pbuilder-inc/css/dragula.min.css">
	<link rel="stylesheet" type="text/css" href="pbuilder-inc/css/medium-editor.min.css">
	<link rel="stylesheet" type="text/css" href="pbuilder-inc/css/page-builder.css">
	<script type="text/javascript" src="pbuilder-inc/js/dragula.min.js"></script>
	<script type="text/javascript" src="pbuilder-inc/js/medium-editor.min.js"></script>
	<script type="text/javascript" src="pbuilder-inc/js/doT.min.js"></script>
	<script type="text/javascript" src="pbuilder-inc/js/github-content-uploader.js"></script>
	<script type="text/javascript" src="pbuilder-inc/js/design_mode.js"></script>
	<script type="text/javascript" src="pbuilder-inc/js/app.js"></script>

	<script type="text/javascript" src="pbuilder-inc/js/dropzone.min.js"></script>


	<div id="openModal" class="modalDialog">
		<div>	
			<a href="#close" title="Close" class="close">X</a>
			<h2 id="modal-title">Content editor</h2>
			<div id="modal-content">
<!-- 			<textarea id="text-editor" style="width:100%; height:10em"></textarea>
			<a onclick="_RENDER.editor_save()" href="#close">Save</a> -->
			</div>
		</div>
	</div>

	<div id="preloader">
		<div id="preloader-bar"></div>
	</div>

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
		<!-- <div class="main-ico" onclick="alert('PREVIEW is lock on this demo')">
			<i class="material-icons">&#xE8F4;</i>
			PREV
		</div> -->
		<h1>THOMAS EDDISON page buider</h1>
		<h2>Ultra light static websites crator</h2>
		<a href="https://github.com/dadmor/simple-landing-page-and-site-buider">https://github.com/dadmor/simple-landing-page-and-site-buider</a>
	</div>

	<div id="templates">
		<div class="menu-tab">
			<i class="material-icons">&#xE24D;</i> Pages
		</div>
		<div class="menu-tab">
			<i class="material-icons">&#xE8F1;</i> Templates
		</div>


		<i class="material-icons">&#xE8F1;</i>
		<ul>
			<li onclick="_PBuilder.load_html('relu-person')">1</li>
			<li onclick="_PBuilder.load_html('photo-blog')">2</li>
			<li onclick="_PBuilder.load_html('pictorama')">3</li>
		</ul>
	</div>
	<!-- <div id="properties" onclick='alert("PROPERTIS is lock on this demo\nprototype alilable on\nhttp://mroczna.stronazen.pl/robo-theme-builder-public-dev/")'>
		<i class="material-icons">&#xE5D2;</i>
	</div> -->

	<div id="page-builder-wraper">
		<div id="page-builder">
				
		</div>
	</div>

	<div id="inspector" style="overflow:hidden;  padding:1em">
		Inspector
		<pre id="inspector-content" style="font-size:9px;"></pre>
	</div>


	
	
</body>
</html>

