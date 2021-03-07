<?php

// includes
include_once('helpers.php');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// EXPORT
$assetName = uniqid();
$targetPath = __DIR__ . DIRECTORY_SEPARATOR . "assets/tmp/" . $assetName;
$sourcetPath = __DIR__ . DIRECTORY_SEPARATOR . 'assets/templates/' . $_REQUEST['type'] . '/' . base64_decode($_REQUEST['template_id']);
xcopy($sourcetPath, $targetPath);

// put edit html content
file_put_contents($targetPath . DIRECTORY_SEPARATOR . 'index.html', $_REQUEST['content']);

$dir = $targetPath;
$zip_file = 'tmp/template.zip';

// Get real path for our folder
$rootPath = realpath($dir);

// Initialize archive object
$zip = new ZipArchive();
$zip->open($zip_file, ZipArchive::CREATE | ZipArchive::OVERWRITE);

// Create recursive directory iterator
/** @var SplFileInfo[] $files */
$files = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($rootPath),
    RecursiveIteratorIterator::LEAVES_ONLY
);

foreach ($files as $name => $file)
{
    // Skip directories (they would be added automatically)
    if (!$file->isDir())
    {
        // Get real and relative path for current file
        $filePath = $file->getRealPath();
        $relativePath = substr($filePath, strlen($rootPath) + 1);

        // Add current file to archive
        $zip->addFile($filePath, $relativePath);
        dd;
    }
}

// Zip archive will be created only after closing object
$zip->close();

// rm tmp folder
xdelete($targetPath);

header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename='.basename($zip_file));
header('Content-Transfer-Encoding: binary');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($zip_file));
readfile($zip_file);