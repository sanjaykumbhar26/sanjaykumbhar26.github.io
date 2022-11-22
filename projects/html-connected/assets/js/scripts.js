AOS.init({
    easing: 'ease-out-back',
    duration: 1000,
    // disable: 'mobile'
    disable: function () {
        var maxWidth = 1280;
        return window.innerWidth < maxWidth;
    }
});


// var map, map2;


// function initMap() {
//     map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 16,
//         center: new google.maps.LatLng(-33.91722, 151.23064),
//         mapTypeId: 'roadmap'
//     });

//     map2 = new google.maps.Map(document.getElementById('map2'), {
//         zoom: 16,
//         center: new google.maps.LatLng(-33.91722, 151.23064),
//         mapTypeId: 'roadmap'
//     });
// }


var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5.27,
        center: new google.maps.LatLng(38.19, -90.20),
        mapTypeId: 'roadmap'
    });


    function addMarker(feature) {
        var marker = new google.maps.Marker({
            position: feature.position,
            // icon: icons[feature.type].icon,
            icon: {
                size: new google.maps.Size(35, 35),
                url: feature.icon,
                scaledSize: new google.maps.Size(35, 35),
            },
            map: map
        });

        marker.addListener('click', function () {
            window.location.href = feature.url;
        });

        var myoverlay = new google.maps.OverlayView();

        myoverlay.draw = function () {
            // add an id to the layer that includes all the markers so you can use it in CSS
            this.getPanes().markerLayer.id = 'markerLayer';
        };
        myoverlay.setMap(map);


    }
    // I wrote this - don't know if it works...
    function addInfoWindow(feature) {
        var infowindow = new google.maps.InfoWindow({
            content: features.content
        });
    }

    // defines locations
    var features = [
        {
            position: new google.maps.LatLng(41.899232, -87.6382897),
            url: 'https://goo.gl/maps/Zyjfk65mRnRfcMmc7',
        }, {
            position: new google.maps.LatLng(32.8061208, -96.8063768),
            url: 'https://goo.gl/maps/RZ26zE3AtvMBxcsB8',
        }
    ];

    // adds markers via the features table
    for (var i = 0, feature; feature = features[i]; i++) {
        addMarker(feature);
        addInfoWindow(feature);
    }


    // marker variable is only defined within the addMarker function

}



// menu
var $btn = $('.btn-menu, .button-modal');

$btn.click(function () {

    $('body').toggleClass('show');

})