<?php
	$data = json_decode(base64_decode($_GET['data']));
	$schema = json_decode(base64_decode($_GET['schema']));
	$schema =  (array) $schema;
	$tid = $_GET['tid'];

	//echo $site_Templateo;
	
	

	/* ------ */
	require_once('simple_html_dom.php');
	//$html = str_get_html($site_Template);
	$html = file_get_html('pbuilder-assets/boiler-plates/relu-person/site.html');
	$counter = 0;
		foreach($html->find('section') as $element){
			
			$def_c = $schema[$element->id]->default_component;
			$component = file_get_contents('pbuilder-assets/components/ArthurWellesleyCSSconcept/'.$def_c.'.doT.html');
			
			
			foreach($data[$counter] as $component_data){
				$comp_out = $component;
				foreach ($component_data as $key1 => $value1) {
					$comp_out = str_replace('{{=it.title}}',$value1->title,$comp_out);
					$comp_out = str_replace('{{=it.description}}',$value1->description,$comp_out);
					$comp_out = str_replace('{{=it.image}}',$value1->image,$comp_out);
				}
				
			}

		//$component = str_replace('{{=it.title}}','TITLE',$component);

		$html->find('section[id='.$element->id.']', 0)->innertext = $comp_out;
		
		$counter++;
	}
   
	$textfilename="pbuilder-upload/".$tid."/index.html";
	file_put_contents ($textfilename, $html);	  
	//header('Content-Type: text/html; charset=utf-8');
			
	//echo $html;
	
?>
