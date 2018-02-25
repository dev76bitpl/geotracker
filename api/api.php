<?php

function get_ip($ip2long = false)
{
 if($_SERVER['HTTP_CLIENT_IP'])
 {
  $ip = $_SERVER['HTTP_CLIENT_IP'];
 }
 else if($_SERVER['HTTP_X_FORWARDED_FOR'])
 {
  $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
 }
 else
 {
  $ip = $_SERVER['REMOTE_ADDR'];
 }

 if($ip2long)
 {
  $ip = ip2long($ip);
 }

 return $ip; 
}

echo get_ip();
    //http://stackoverflow.com/questions/18382740/cors-not-working-php
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }
 
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
 
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
 
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
 
        exit(0);
    }
 
 
    //http://stackoverflow.com/questions/15485354/angular-http-post-to-php-and-undefined
    $postdata = file_get_contents("php://input");
    if (isset($postdata)) {
        $array = json_decode($postdata);
 

//Example array.
//$array = array('Ireland', 'England', 'Wales', 'Northern Ireland', 'Scotland');
 
//Encode the array into a JSON string.
$encodedString = json_encode($array);
 
//Save the JSON string to a text file.
file_put_contents("./logs/".get_ip()."-json_array.txt", $encodedString.PHP_EOL , FILE_APPEND | LOCK_EX);

print_r($postdata);
//Retrieve the data from our text file.
//$fileContents = file_get_contents('json_array.txt');
 
//Convert the JSON string back into an array.
//$decoded = json_decode($fileContents, true);
 
//The end result.
//var_dump($decoded);



            //echo "Server returns: " . $username;
		//print_r($request);
    }
    else {
        echo "Not called properly with username parameter!";
    }

?>
