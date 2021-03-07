<?php

// includes
include_once('helpers.php');

// UPLOAD
$url = saveAsset();
return json([ 'url' => $url ], 200);