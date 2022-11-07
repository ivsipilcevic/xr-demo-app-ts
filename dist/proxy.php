<?php
require_once "./Utils.php";
$endpoint = get($_REQUEST, 'endpoint');
$method = get($_SERVER, "REQUEST_METHOD");
$curl = curl_init();

$headers = pluck(getallheaders(), ['X-App-Id', 'Content-Type', 'X-Authentication']);
$newHeaders = array();
foreach($headers as $key => $value){
	array_push($newHeaders, "{$key}:{$value}");
}
$headers = $newHeaders;
$postfields = http_build_query($_POST);

curl_setopt_array($curl, [
	CURLOPT_URL => $endpoint,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_ENCODING => '',
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 0,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => $method,
	CURLOPT_POSTFIELDS => $postfields,
	CURLOPT_HTTPHEADER => $headers,
]);
$response = curl_exec($curl);
curl_close($curl);
echo $response;
