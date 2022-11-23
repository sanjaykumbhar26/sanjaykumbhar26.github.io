require.config({
    'baseUrl': 'static/scripts',
    'deps': ['bootstrap'],
    'paths': {
        'jquery': '../vendor/jquery/dist/jquery',
        'bootstrap': '../vendor/bootstrap/dist/js/bootstrap',
        'modernizr': '../vendor/modernizr/modernizr',
        'anythingslider': '../vendor/anythingslider/js/jquery.anythingslider',
        'anythingslider': '../vendor/anythingslider/js/jquery.anythingslider.min',
        'anythingslider-fx': '../vendor/anythingslider/js/jquery.anythingslider.fx',
        'anythingslider-video': '../vendor/anythingslider/js/jquery.anythingslider.video',
        'swfobject': '../vendor/anythingslider/js/swfobject',
        'jquery.countdown': '../vendor/jquery.countdown/dist/jquery.countdown',
        'smooth.scroll': '../vendor/smooth.scroll/index',
        'three': '../vendor/three.js/three',
        'three.ShaderPass': '../vendor/threex.badtvpproc/examples/vendor/three.js/examples/js/postprocessing/ShaderPass',
        'three.EffectComposer': '../vendor/threex.badtvpproc/examples/vendor/three.js/examples/js/postprocessing/EffectComposer',
        'three.RenderPass': '../vendor/threex.badtvpproc/examples/vendor/three.js/examples/js/postprocessing/RenderPass',
        'three.MaskPass': '../vendor/threex.badtvpproc/examples/vendor/three.js/examples/js/postprocessing/MaskPass',
        'three.CopyShader': '../vendor/threex.badtvpproc/examples/vendor/three.js/examples/js/shaders/CopyShader',
        'threex.badtvpproc/threex.badtvpasses': '../vendor/threex.badtvpproc/threex.badtvpasses',
        'threex.badtvpproc/threex.badtvdatgui': '../vendor/threex.badtvpproc/threex.badtvdatgui',
        'threex.badtvpproc/threex.badtvsound': '../vendor/threex.badtvpproc/threex.badtvsound',
        'threex.badtvpproc/threex.badtvjamming': '../vendor/threex.badtvpproc/threex.badtvjamming',
        'threex.badtvpproc/shaders/BadTVShader': '../vendor/threex.badtvpproc/shaders/BadTVShader',
        'threex.badtvpproc/shaders/StaticShader': '../vendor/threex.badtvpproc/shaders/StaticShader',
        'threex.badtvpproc/shaders/RGBShiftShader': '../vendor/threex.badtvpproc/shaders/RGBShiftShader',
        'threex.badtvpproc/shaders/FilmShader': '../vendor/threex.badtvpproc/shaders/FilmShader'
    },
    'shim': {
        'bootstrap': ['jquery'],
        'modernizr': {
            'exports': 'window.Modernizr'
        },
        'anythingslider': ['jquery', 'swfobject'],
        'anythingslider-fx': ['jquery', 'anythingslider'],
        'anythingslider-video': ['jquery', 'anythingslider'],
        'three': {
            'exports': 'window.THREE'
        },
        'three.ShaderPass': {
            'deps': ['three'],
            'exports': 'THREE.ShaderPass'
        },
        'three.EffectComposer': {
            'deps': ['three', 'three.MaskPass'],
            'exports': 'THREE.EffectComposer'
        },
        'three.RenderPass': {
            'deps': ['three'],
            'exports': 'THREE.RenderPass'
        },
        'three.MaskPass': {
            'deps': ['three'],
            'exports': 'THREE.MaskPass'
        },
        'three.CopyShader': {
            'deps': ['three'],
            'exports': 'THREE.CopyShader'
        },
        'threex.badtvpproc/threex.badtvpasses': {
            'deps': ['three', 'three.ShaderPass'],
            'exports': 'THREEx.BadTVPasses'
        },
        'threex.badtvpproc/threex.badtvdatgui': {
            'deps': ['three'],
            'exports': 'THREEx.addBadTVPasses2DatGui'
        },
        'threex.badtvpproc/threex.badtvsound': {
            'deps': ['three'],
            'exports': 'THREEx.BadTVSound'
        },
        'threex.badtvpproc/threex.badtvjamming': {
            'deps': ['three'],
            'exports': 'THREEx.BadTVJamming'
        },
        'threex.badtvpproc/shaders/BadTVShader': {
            'deps': ['three'],
            'exports': 'THREE.BadTVShader'
        },
        'threex.badtvpproc/shaders/StaticShader': {
            'deps': ['three'],
            'exports': 'THREE.StaticShader'
        },
        'threex.badtvpproc/shaders/RGBShiftShader': {
            'deps': ['three'],
            'exports': 'THREE.RGBShiftShader'
        },
        'threex.badtvpproc/shaders/FilmShader': {
            'deps': ['three'],
            'exports': 'THREE.FilmShader'
        }
    }
});
