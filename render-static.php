<?php

	$input = json_decode(base64_decode ($_POST['data']), true);
	$data = json_decode(base64_decode($input['data']));
	$schema = json_decode(base64_decode($input['schema']));
	$schema =  (array) $schema;
	$properties = json_decode(base64_decode($input['properties']));
	$properties =  (array) $properties;

	/*  add CSS */

	$css = '';
	$css .=  file_get_contents('pbuilder-assets/'.$properties['css_source'] .'/page-structure-' .$properties['css_structure'].'.css');
	$css .=  file_get_contents('pbuilder-assets/'.$properties['css_source'] .'/page-dimensions-' .$properties['css_dimensions'].'.css');
	$css .=  file_get_contents('pbuilder-assets/'.$properties['css_source'] .'/page-visual-' .$properties['css_visual'].'.css');
	
	$css_file = "/css/style.css";
	$css_link .= '<link rel="stylesheet" type="text/css" href="'.$css_file.'">';

	/* ------ */

	require_once('simple_html_dom.php');
	$html = file_get_html('pbuilder-assets/boiler-plates/'.$properties['boilerplate'].'/page.html');

	$counter = 0;
	foreach($html->find('section') as $element){
		
		$def_c = $schema[$element->id]->default_component;
		$component = file_get_contents('pbuilder-assets/components/'.$properties['components_path'].$def_c.'.doT.html');
		
		
		foreach($data[$counter] as $component_data){
			$comp_out = "";
			foreach ($component_data as $key1 => $value1) {
				var_dump($value1);
				$comp_out .= $component;
				$comp_out = str_replace('{{=it.title}}',$value1->title,$comp_out);
				$comp_out = str_replace('{{=it.description}}',$value1->description,$comp_out);
				$comp_out = str_replace('{{=it.background}}',$value1->background,$comp_out);
			}
		}
		$html->find('section[id='.$element->id.']', 0)->innertext = $comp_out;
		$counter++;
	}

	$html = $css_link.$html;
	
	/* save on server as file */
	/*	
	$file="pbuilder-upload/".$properties['page_slug']."/index.html";
	file_put_contents ($file, $html);
	*/	 

	/* crearte gitgub package */
	$file = 'index.html';
	$out_array = array(
		array(
			'filePath' => $css_file,
			'fileContent' => base64_encode($css)
		),
		array(
			'filePath' => $file,
			'fileContent' => base64_encode($html)
		)
	);
	$out = json_encode($out_array);
	echo $out;
	//header('Content-Type: text/html; charset=utf-8');
	//header('Location: http://www.example.com/');


	/*$ch = curl_init('http://127.0.0.1/Otto-von-Bismarck/index.php?action=upload');
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(array('data' => $out, 'repoName'=>'testpage')));
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	curl_exec($ch);*/
	
	//echo $html;

	//var_dump($out_array);


	
?>



<form method="POST" action="http://127.0.0.1/Otto-von-Bismarck/index.php">
	<input type="hidden" name="data" value='<?php echo $out;?>'>
	<input type="text" name="repoName" value="testpage">

	<button>FEED ME!!!</button>
</form>


<!-- 
	<link href='pbuilder-assets/bo iler-plates/relu-person/css/site-structure-abrahamlincoln.css' rel='stylesheet' type='text/css'>
	<link href='pbuilder-assets/boiler-plates/relu-person/css/site-dimensions-abrahamlincoln.css' rel='stylesheet' type='text/css'>
	<link href='pbuilder-assets/boiler-plates/relu-person/css/site-visual-abrahamlincoln.css' rel='stylesheet' type='text/css'>
 -->