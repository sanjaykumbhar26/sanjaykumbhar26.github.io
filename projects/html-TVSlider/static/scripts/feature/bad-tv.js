(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([
            'jquery',
            'modernizr',
            'three',
            'three.EffectComposer',
            'three.RenderPass',
            'three.CopyShader',
            'three.MaskPass',
            'threex.badtvpproc/threex.badtvpasses',
            'threex.badtvpproc/threex.badtvdatgui',
            'threex.badtvpproc/threex.badtvsound',
            'threex.badtvpproc/threex.badtvjamming',
            'threex.badtvpproc/shaders/BadTVShader',
            'threex.badtvpproc/shaders/StaticShader',
            'threex.badtvpproc/shaders/RGBShiftShader',
            'threex.badtvpproc/shaders/FilmShader'
        ], factory);
    } else {
        factory(root.$, root.Modernizr, root.THREE);
    }
}(this, function ($, Modernizr, THREE) {
    $(function () {
        var $container, $wrapper;

        function init() {
            $container = $('body').find('.js-bad-tv');
            $wrapper = $('.js-video-wrapper');
            var renderer = new THREE.WebGLRenderer(),
                width = $container.width(),
                height = $container.height(),
                onRenderFcts = [],
                scene = new THREE.Scene(),
                camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, -10000, 10000);

            renderer.setSize(width, height);

            $wrapper.append(renderer.domElement);
            camera.position.z = 3;

            //////////////////////////////////////////////////////////////////////////////////
            //		add an object and make it move					//
            //////////////////////////////////////////////////////////////////////////////////

            //// Load Video
            var $video = $container.find('video'),
                video = $video.get(0);
            video.loop = true;
            video.volume = 1;
            //video.play();

            // create the texture
            var texture = new THREE.Texture(video);
            texture.minFilter = THREE.NearestFilter;
            texture.magFilter = THREE.NearestFilter;
            onRenderFcts.push(function (delta, now) {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    if (texture) texture.needsUpdate = true;
                }
            });

            // build the mesh
            var geometry = new THREE.PlaneGeometry(width, height);
            var material = new THREE.MeshBasicMaterial({
                map: texture
            });
            var mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            //////////////////////////////////////////////////////////////////////////////////
            //		badTVPasses							//
            //////////////////////////////////////////////////////////////////////////////////
            var badTVPasses = new THREEx.BadTVPasses();
            onRenderFcts.push(function (delta, now) {
                badTVPasses.update(delta, now)
            });

            ////////////////////////////////////////////////////////////////////////////////
            //		composer 							//
            ////////////////////////////////////////////////////////////////////////////////

            var composer = new THREE.EffectComposer(renderer);
            var renderPass = new THREE.RenderPass(scene, camera);
            composer.addPass(renderPass);

            // add badTVPasses to composer
            badTVPasses.addPassesTo(composer);

            composer.passes[composer.passes.length - 1].renderToScreen = true;

            //////////////////////////////////////////////////////////////////////////////////
            //		render the scene						//
            //////////////////////////////////////////////////////////////////////////////////
            onRenderFcts.push(function (delta, now) {
                // disable rendering directly thru renderer
                //renderer.render( scene, camera );

                // render thru composer
                composer.render(delta);
            });

            //////////////////////////////////////////////////////////////////////////////////
            //		loop runner							//
            //////////////////////////////////////////////////////////////////////////////////
            var lastTimeMsec = null;
            requestAnimationFrame(function animate(nowMsec) {
                // keep looping
                requestAnimationFrame(animate);
                // measure time
                lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
                var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
                lastTimeMsec = nowMsec;
                // call each update function
                onRenderFcts.forEach(function (onRenderFct) {
                    onRenderFct(deltaMsec / 1000, nowMsec / 1000)
                });
            });
        }

        function bindEvents() {
            $(window).resize(function () {
                var $canvas = $wrapper.find('canvas');
                if ($canvas.length) {
                    $canvas.css('width', $container.width()).css('height', $container.height());
                }
            });
        }

        if (Modernizr.canvas) {
            init();
            bindEvents();
        }
    });
}));