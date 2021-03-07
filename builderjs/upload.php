<?php

// includes
include_once('helpers.php');

// UPLOAD
$url = uploadTemplate();
return json([ 'url' => $url ], 200);