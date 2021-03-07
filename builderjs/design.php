<?php
    $dir = __DIR__ . DIRECTORY_SEPARATOR . "assets/templates/layouts/";
    $templateUrl = array_diff(scandir($dir), array('..', '.'));
    $layouts = [];
    foreach ($templateUrl as $name) {
        $path = __DIR__ . DIRECTORY_SEPARATOR . "assets/templates/layouts/" . $name;
        $files = glob($path . "/index.html");
        $content = file_get_contents($files[0]);
        $preg_matchs = preg_match_all('/(<title\>([^<]*)\<\/title\>)/i', $content, $m);
        $title = $m[2][0];
        array_push($layouts, $template = [
            'name' => $title,
            'url' => 'design.php?id='.base64_encode($name).'&type=layouts',
            'thumbnail' => 'assets/templates/layouts/' . $name.'/thumb.png',
        ]);
    }

    $dir = __DIR__ . DIRECTORY_SEPARATOR . "assets/templates/other/";
    $templateUrl = array_diff(scandir($dir), array('..', '.'));
    $other = [];
    foreach ($templateUrl as $name) {
        $path = __DIR__ . DIRECTORY_SEPARATOR . "assets/templates/other/" . $name;
        $files = glob($path . "/index.html");
        $content = file_get_contents($files[0]);
        $preg_matchs = preg_match_all('/(<title\>([^<]*)\<\/title\>)/i', $content, $m);
        $title = $m[2][0];
        array_push($other, $template = [
            'name' => $title,
            'url' => 'design.php?id='.base64_encode($name).'&type=other',
            'thumbnail' => 'assets/templates/other/' . $name.'/thumb.png',
        ]);
    }

    // find template url
    $url = 'assets/templates/' . $_GET['type'] . '/' . base64_decode($_GET['id']);
?>

<!doctype html>
<html>
    <head>
        <title>BuilderJS 4.0</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link href="assets/image/builderjs_color_logo.png" rel="icon" type="image/x-icon" />
        <link rel="stylesheet" href="dist/builder.css">
        <script src="dist/builder.js"></script>

        <script>
            var editor;
            var params = new URLSearchParams(window.location.search);
            var templates = <?php echo JSON_encode(array_merge($layouts, $other));?>;

            var tags = [
                {type: 'label', tag: '{CONTACT_FIRST_NAME}'},
                {type: 'label', tag: '{CONTACT_LAST_NAME}'},
                {type: 'label', tag: '{CONTACT_FULL_NAME}'},
                {type: 'label', tag: '{CONTACT_EMAIL}'},
                {type: 'label', tag: '{CONTACT_PHONE}'},
                {type: 'label', tag: '{CONTACT_ADDRESS}'},
                {type: 'label', tag: '{ORDER_ID}'},
                {type: 'label', tag: '{ORDER_DUE}'},
                {type: 'label', tag: '{ORDER_TAX}'},
                {type: 'label', tag: '{PRODUCT_NAME}'},
                {type: 'label', tag: '{PRODUCT_PRICE}'},
                {type: 'label', tag: '{PRODUCT_QTY}'},
                {type: 'label', tag: '{PRODUCT_SKU}'},
                {type: 'label', tag: '{AGENT_NAME}'},
                {type: 'label', tag: '{AGENT_SIGNATURE}'},
                {type: 'label', tag: '{AGENT_MOBILE_PHONE}'},
                {type: 'label', tag: '{AGENT_ADDRESS}'},
                {type: 'label', tag: '{AGENT_WEBSITE}'},
                {type: 'label', tag: '{AGENT_DISCLAIMER}'},
                {type: 'label', tag: '{CURRENT_DATE}'},
                {type: 'label', tag: '{CURRENT_MONTH}'},
                {type: 'label', tag: '{CURRENT_YEAR}'},
                {type: 'button', tag: '{PERFORM_CHECKOUT}', 'text': 'Checkout'},
                {type: 'button', tag: '{PERFORM_OPTIN}', 'text': 'Subscribe'},
            ];

            $( document ).ready(function() {
                var buildMode = true;
                var legacyMode = false;
                var formFields = [];

                if(params.get('type') == 'other') {
                    buildMode = false;
                    legacyMode = true;
                }

                editor = new Editor({
                    // theme: 'beepro',
                    buildMode: buildMode, // default == true
                    legacyMode: legacyMode, // default == false
                    root: '/dist/',
                    url: '<?php echo $url ?>',
                    urlBack: window.location.origin,
                    uploadAssetUrl: 'asset.php',
                    uploadAssetMethod: 'POST',
                    uploadTemplateUrl: 'upload.php',
                    saveUrl: 'save.php',
                    saveMethod: 'POST',
                    data: {
                        _token: 'CSRF_TOKEN',
                        type: '<?php echo $_GET['type'] ?>',
                        template_id: '<?php echo $_GET['id'] ?>',
                    },
                    templates: templates,
                    tags: tags,
                    changeTemplateCallback: function(url) {
                        window.location = url;
                    },
                    // disableFeatures: [ 'change_template', 'export' ], // disable Features
                    // disableWidgets: [ 'HeaderBlockWidget' ], // disable widgets
                    export: {
                        url: 'export.php'
                    },
                    backgrounds: [
                        '/assets/image/backgrounds/images1.jpg',
                        '/assets/image/backgrounds/images2.jpg',
                        '/assets/image/backgrounds/images3.jpg',
                        '/assets/image/backgrounds/images4.png',
                        '/assets/image/backgrounds/images5.jpg',
                        '/assets/image/backgrounds/images6.jpg',
                        '/assets/image/backgrounds/images9.jpg',
                        '/assets/image/backgrounds/images11.jpg',
                        '/assets/image/backgrounds/images12.jpg',
                        '/assets/image/backgrounds/images13.jpg',
                        '/assets/image/backgrounds/images14.jpg',
                        '/assets/image/backgrounds/images15.jpg',
                        '/assets/image/backgrounds/images16.jpg',
                        '/assets/image/backgrounds/images17.png',
                    ]
                });

                editor.init();
            });
        </script>

        <style>
            .lds-dual-ring {
                display: inline-block;
                width: 80px;
                height: 80px;
            }
            .lds-dual-ring:after {
                content: " ";
                display: block;
                width: 30px;
                height: 30px;
                margin: 4px;
                border-radius: 80%;
                border: 2px solid #aaa;
                border-color: #007bff transparent #007bff transparent;
                animation: lds-dual-ring 1.2s linear infinite;
            }
            @keyframes lds-dual-ring {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        </style>
    </head>
    <body class="overflow-hidden">
        <div style="text-align: center;
            height: 100vh;
            vertical-align: middle;
            padding: auto;
            display: flex;">
            <div style="margin:auto" class="lds-dual-ring"></div>
        </div>

        <script>
            switch(window.location.protocol) {
                case 'http:':
                case 'https:':
                  //remote file over http or https
                  break;
                case 'file:':
                  alert('Please put the builderjs/ folder into your document root and open it through a web URL');
                  window.location.href = "./index.php";
                  break;
                default:
                  //some other protocol
            }
        </script>
    </body>
</html>
