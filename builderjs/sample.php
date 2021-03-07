
<html>
    <head>
        <link rel="stylesheet" href="/dist/builder.css"></link>
        <script type='text/javascript' src="/dist/builder.js"></script>
    </head>
    <body class="overflow-hidden">
        
        <script>
            // A more complicated setup
            var templates = [];
            
                var newData = {
                    "name" : 'Template Builder Is Awsome',
                    "url" : '/template-builder/5f76f8f7ecf434a86bb385df-2733BE60-9C59-0615-56B7-333065525A75/',
                    "thumbnail" : ''
                };
                templates.push(newData)
            
                var newData = {
                    "name" : 'Template Builder Is Awsome',
                    "url" : '/template-builder/5f76f8f7ecf434a86bb385df-34C65FDD-59B8-8FB5-75CA-C027FBF2406D/',
                    "thumbnail" : ''
                };
                templates.push(newData)
            
                var newData = {
                    "name" : 'Template Builder Is Awsome',
                    "url" : '/template-builder/5f76f8f7ecf434a86bb385df-F3FFA38C-DE3A-7C52-DCBB-9C33FFF10E1B/',
                    "thumbnail" : ''
                };
                templates.push(newData)
            
            
            var builder = new Editor({
                root: '/dist/',
                saveUrl: '/save.php',
                saveMethod: 'POST',
                backUrl: '/user/5f76e9f59300e24778e2f30f/email-templates',
                templateName: 'Template Builder Is Awsome',
                workplace: '5f76e9f59300e24778e2f30f',
                templates: templates
            });
            builder.init();

        </script>

    </body>
</html>
