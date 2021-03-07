<?php

// includes
include_once('helpers.php');

// In this example, we do not actually save anything, just return an error to the Builder
// You can replace the line below with your actual code
return json(
    [
        'message' => 'DEMO content is not configured for saving. See BuilderJS documentation for more integration guideline'
    ],
    403
);


// THIS IS THE END OF THE REQUEST - SEE MORE GUIDELINE BELOW FOR MORE SAVE OPTIONS


/******************************************************************************/


/**
 * Of course you can actually save the posted content to a MySQL database, to a local filesystem, etc.
 *
 * EXAMPLE 01: Save it to the original index.html file
 */

// Get the original index.html file
$file = '/path/to/index.html';

// Get BuilderJS' posted content
$html = $_POST['content'];

// Write the contents back to the file
file_put_contents($file, $html);

/** DONE, that's it! **/

/******************************************************************************/

/**
 * EXAMPLE 02: Below is an example of how you save it to a MySQL database table
 */

// Sample DB credentials
$servername = "localhost";
$username = "mysqlusername";
$password = "SEcrEt!";
$dbname = "db";

// Retrieve posted information
$html = $_POST['content'];
$templateID = 1;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Insert/update BuilderJS' posted content to the `emails` DB table
$stmt = $conn->prepare("UPDATE `emails` SET html_content = ? WHERE id = ?");
$stmt->bind_param("ss", $html, $templateID);

$stmt->execute();

$stmt->close();
$conn->close();

/** DONE, that's it **/

/******************************************************************************/

/**
 * EXAMPLE 03: Save to a file, with inline CSS
 */

// Require the CSS inline utility
// Install via composer:
//
//     composer require tijsverkoyen/css-to-inline-styles
//
use TijsVerkoyen\CssToInlineStyles\CssToInlineStyles;

// Get the original index.html file
$file = '/path/to/index.html';

// Get BuilderJS' posted content
$html = $_POST['content'];

// List of CSS references to make inline
$styles = [
    '/path/to/bootstrap.css',
    '/path/to/style.css',
];

// create CSS inliner instance
$cssToInlineStyles = new CssToInlineStyles();

// Convert CSS styles to inline HTML
foreach ($styles as $css) {
    $html = $cssToInlineStyles->convert($html, $css);
}

// Write the content back to the file with inline CSS styles
file_put_contents($file, $html);

// IMPORTANT: (again) the CSS inliner library is required and can be installed via composer: composer require tijsverkoyen/css-to-inline-styles

/** DONE, that's it! **/
