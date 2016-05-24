<?php
	require_once('simple_html_dom.php');
	

	$input = json_decode(file_get_contents('php://input'), true);
	$data = json_decode(base64_decode($input['data']));
	$schema = json_decode(base64_decode($input['schema']));
	$schema =  (array) $schema;
	$properties = json_decode(base64_decode($input['properties']));
	$properties = (array) $properties;
	$page_slug = $input['page_slug'];
	$html = base64_decode($input['html']);

	$css = $input['css'];

	foreach ($css as $key => $value) {
		$out_css .= base64_decode($value);
	}
	

	$tech_array_file = "inc/properties.json";
	$tech_array = array_merge($properties, $schema, $data);
	
	/* ------ */

	$css_file = "css/style.css";
	$css_link .= '<link rel="stylesheet" type="text/css" href="'.$css_file.'">';

	/* ------ */

	//$html = file_get_html('../pbuilder-assets/boiler-plates/'.$properties['boilerplate'].'/page.html');
	$html = str_get_html($html);

	$counter = 0;
	foreach($html->find('section') as $element){
		
		$def_c = $schema[$element->id]->default_component;
		$component = file_get_contents('../pbuilder-assets/components/'.$properties['components_path'].$def_c.'.doT.html');
		
		foreach($data[$counter] as $component_data){
			$comp_out = "";
			foreach ($component_data as $key1 => $value1) {
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
			'fileContent' => base64_encode($out_css)
		),
		array(
			'filePath' => $file,
			'fileContent' => base64_encode($html)
		),
		array(
			'filePath' => $tech_array_file,
			'fileContent' => base64_encode($tech_array)
		)
	);
	
	$out = json_encode($out_array);
	echo $out;


	//header('Content-Type: text/html; charset=utf-8');
	//header('Location: http://www.example.com/');

