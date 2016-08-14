<?php 
	if($_POST["passw"] == "Licey1553"){
		$type = $_POST["type"];
		if($type == "add"){
			$handle = fopen("links.html", "a");
			fwrite($handle, $_POST["text"]."\n");
			fclose($handle);
		}else if($type == "update"){
			$num = $_POST["line_num"];
			$lines = file("links.html");
			if($num>0){
				$lines[$num] = $_POST["line_text"];

				$handle = fopen("links.html", "w");
				foreach ($lines as $line_num => $line) {
			    	fwrite($handle, $line);
				}
				fclose($handle);
			}
		} else if($type == "checkPassw"){
			echo "Correct password";
		}
	}else{
		echo "Incorrect password";
	}

?>