<?php

// Upload demo assets
function saveAsset() {
    $assetName = uniqid();
    $targetPath = __DIR__ . DIRECTORY_SEPARATOR . "assets/tmp/" . $assetName;

    if ($_POST['type'] == 'upload') {
        //upload file by upload image
        move_uploaded_file( $_FILES['file']['tmp_name'], $targetPath );
    } else if ($_POST['type'] == 'url'){
        //upload file by link url
        $content = file_get_contents($_POST['url']);
        file_put_contents($targetPath, $content);
    } else if ($_POST['type'] == 'base64') {
        //upload file by link base64
        file_put_contents($targetPath, base64_decode($_POST['url_base64']));
    }

    return '/assets/tmp/' . $assetName;
}

function xcopy($source, $dest, $permissions = 0755)
{
    // Check for symlinks
    if (is_link($source)) {
        return symlink(readlink($source), $dest);
    }

    // Simple copy for a file
    if (is_file($source)) {
        return copy($source, $dest);
    }

    // Make destination directory
    if (!is_dir($dest)) {
        $oldmask = umask(0);
        mkdir($dest, $permissions, true);
        umask($oldmask);
    }

    // Loop through the folder
    $dir = dir($source);
    while (false !== $entry = $dir->read()) {
        // Skip pointers
        if ($entry == '.' || $entry == '..') {
            continue;
        }

        // Deep copy directories
        xcopy("$source/$entry", "$dest/$entry", $permissions);
    }

    // Clean up
    $dir->close();

    return true;
}

function xdelete($dir)
{
    if (is_dir($dir)) {
        $objects = scandir($dir);
        foreach ($objects as $object) {
            if ($object != '.' && $object != '..') {
                if (is_dir($dir.'/'.$object)) {
                    xdelete($dir.'/'.$object);
                } else {
                    unlink($dir.'/'.$object);
                }
            }
        }
        rmdir($dir);
    }

    return true;
}

// upload template
function uploadTemplate() {
    if (isset($_POST) && empty($_FILES['file'])) {
        return json(['error' =>  [ 'file' => 'No file upload' ] ], 404);
    }
    
    $assetName = uniqid();
    $filename = $_FILES['file']['name'];
    $targetPath = __DIR__ . DIRECTORY_SEPARATOR . "assets/tmp/original";
    $uploadPath = __DIR__ . DIRECTORY_SEPARATOR . "assets/templates/other/" . $assetName ."/";
    $movethumbnail = __DIR__ . DIRECTORY_SEPARATOR . "assets/templates/other/";
    $thumbnail = __DIR__ . DIRECTORY_SEPARATOR . "assets/image/thumb.png";

    if (isset($_POST) && !empty($_FILES['file'])) {
        $file = $_FILES['file']['tmp_name'];

        move_uploaded_file($_FILES['file']['tmp_name'], $targetPath);
        
        $zip = new ZipArchive();

        $zip->open($targetPath);
        $zip->extractTo($uploadPath);
        $zip->close();
        
        $files = glob($uploadPath. "/index.html"); /*search index.html in folder*/
        $content = file_get_contents($files[0]);
        
        copy($thumbnail, $uploadPath. 'thumb.png');
    }
    return $assetName;
}

// check asset is valid
function validateAsset() {
    if (false) {
        return json(['error' =>  [ 'file' => 'Cannot upload asset file' ] ], 404);
        die();
    }
}

// change header information
function json($message, $code = 200) {
    header("HTTP/1.1 {$code}");
    header('Content-Type: application/json');
    echo json_encode($message);
}