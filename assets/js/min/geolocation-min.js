var markers = {};
var user_data = {};

function loadMarker(data) {
    var template = $('#marker-template').html();
    Mustache.parse(template); // optional, speeds up future uses
    var rendered = Mustache.render(template, data);
    $('body').html(rendered);
}



$.ajax({
    type: 'GET',
    url: '../data/route-1/route-1.json',
    data: {
        get_param: 'value'
    },
    dataType: 'json',
    success: function(data) {
        //loadMarker(data);
        var holder = $('<div/>');
        holder.attr('class', 'holder').prependTo('body');
        data.story.forEach(function(single) {
            var $id = '#story-' + single.meta.id;
            var template_story = $("#story-template").html();
            var html_story = Mustache.to_html(template_story, single);
            holder.append(html_story);

            var template_marker = $("#marker-template").html();
            var html_marker = Mustache.to_html(template_marker, single);
            $($id).find('#marker').append(html_marker);

            var $map = $($id).find('#map-canvas').get(0);
            single.map = mapper($map, single);


            // google.maps.event.addDomListener($($id), 'load', );
        });

        user_data.data = data;
        bind_events();


    },
    error: function(error) {
        console.log(error);
    }

});
//______________________________________________________
var currentPosition = {
    longitude: 0,
    latitude: 0
};
var x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {

    //console.log(position.coords.latitude,position.coords.longitude); 
    currentPosition.latitude = position.coords.latitude;
    currentPosition.longitude = position.coords.longitude;
}

//______________________________________________________
function CalculateDistance(lat1, long1, lat2, long2) {
    // Translate to a distance
    var distance =
        Math.sin(lat1 * Math.PI) * Math.sin(lat2 * Math.PI) +
        Math.cos(lat1 * Math.PI) * Math.cos(lat2 * Math.PI) * Math.cos(Math.abs(long1 - long2) * Math.PI);

    // Return the distance in miles
    //return Math.acos(distance) * 3958.754;

    // Return the distance in meters
    return Math.acos(distance) * 6370981.162;
} // CalculateDistance


// Marker Location One
var targetlong = 13.3190403;
var targetlat = 52.487401399999996;


// Prevent Console Messages
//no_console();


// Call this on an interval
function OnInterval() {
    // Current Location
    var lat = currentPosition.latitude;
    var long = currentPosition.longitude;
    var distance = CalculateDistance(targetlat, targetlong, lat, long);

    // Is it in the right distance? (200m)
    if (distance <= 2500) {
        // Stop the interval
        //stopInterval(OurInterval);
        //  console.group('Yep');
        //  console.log('Distanz zum Marker: ',distance);
        //  console.log('OriginalPosition', currentPosition);
        // console.groupEnd();
        // Do something here cause they reached their destination
    } else {
        // console.group('Nope');
        //  console.log('Zu weit weg! Distanz zum nächsten Marker: ',distance);
        //  console.log('OriginalPosition', currentPosition);
        // console.groupEnd();
    }
}

function run_program(time) {
    OnInterval();
}

var time = 0;

function loop(time) {
    requestAnimationFrame(loop);

    run_program(time);
}

loop(time);


//__________________________________________________

function bind_events(data) {
    var $body = $('body');
    var $btns = $('.ico-button');

    var $btn_marker = $('[data-action="action-marker"]');
    var $btn_haltestellen = $('[data-action="action-haltestellen"]');

    var $articles = $('article');

    var $marker = $('.location-marker');
    var $content = $('.location-content');

    $marker.bind({
        click: function() {
            switch_content($(this))
        }
    })

    $btns.bind({
        click: function() {
            var $parent_id = $(this).data('id');
            var $section = $('#story-' + $parent_id);
            var $action = $(this).data('action');
            var $selector = '.story-' + $action;
            var $articles = $section.find('article');



            $('section').removeClass('active').addClass('inactive');
            $section.addClass('active').removeClass('inactive');
            if ($(this).data('pos') != undefined) {
                // console.log(window.google.maps);

            }
            $articles.fadeOut().animate({
                opacity: 0
            }, 0);;

            $section.find($selector).animate({
                opacity: 1
            }, 0).fadeIn(200);
        }
    });

    $btns.bind({
        click: function() {
            console.log('click');
        }
    });

    function normalIcon() {
        return {
            url: 'http://www.stilagent.de/wp-content/uploads/saw-icon-map.svg'
        };
    }

    function switch_content($el) {
        var $pos = $el.data('pos');
        $pos = $pos.split(',');
        var $parent_id = $el.data('parent-id');
        var $id = $el.data('id');

        var latlng = new google.maps.LatLng($pos[1], $pos[0]);

        // console.log(markers[$parent_id][$id], $parent_id, $id, $pos, latlng);
        markers[$parent_id][$id].setIcon(normalIcon());
        user_data.data.story[0].map.setCenter(markers[$parent_id][$id].getPosition());
        user_data.data.story[0].map.setZoom(15);

        var $selector = $('.location-content[data-id="' + $el.data('id') + '"]');
        $content.fadeOut().animate({
            opacity: 0
        }, 0);;

        $selector.animate({
            opacity: 1
        }, 0).fadeIn(200);
    }

}



function mapper(map, data) {
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var last_station = data.marker[0].pos.address;
    var start_pos = new google.maps.LatLng(data.marker[0].pos.longitude, data.marker[0].pos.latitude);
    var mapOptions = {};
    var mapDim = {
        height: $('.story-map').height(),
        width: $('.story-map').width()
    }
    var markerBounds = new google.maps.LatLngBounds();
    var map = new google.maps.Map(map, mapOptions);

    directionsDisplay.setMap(map);
    var goldStar = {
        //path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
        //fillColor: 'yellow',
        //fillOpacity: 0.8,
        scale: 1,
        strokeColor: 'gold',
        strokeWeight: 14
    };
    markers[data.meta.id] = {};
    data.marker.forEach(function(el) {
        var marker_pos = new google.maps.LatLng(el.pos.longitude, el.pos.latitude);
        markerBounds.extend(marker_pos);

        var marker = new google.maps.Marker({
            position: marker_pos,
            //icon: goldStar,
            map: map,
            title: el.title,

        });

        markers[data.meta.id][el.id] = marker;

        //map.setCenter(markerBounds.getCenter(), google.map.getBoundsZoomLevel(markerBounds));
        calcRoute(last_station, el.pos.address);
        last_station = el.pos.address;

    });
    

    function createBoundsForMarkers(markers) {

        var bounds = new google.maps.LatLngBounds();
        $.each(markers, function(index, el) {
            var m_point = new google.maps.LatLng(el.pos.longitude, el.pos.latitude);
            bounds.extend(m_point);
        });
        return bounds;
    }
    function getBoundsZoomLevel(bounds, mapDim) {
    var WORLD_DIM = { height: 256, width: 256 };
    var ZOOM_MAX = 21;

    function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;
    
    var lngDiff = ne.lng() - sw.lng();
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;
    
    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
}
    function calcRoute(start, end) {
        //console.log(start);
        var start = start;
        var end = end;
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(result);
            }
        });
    }
    var bounds = createBoundsForMarkers(data.marker);
   // console.log(map);
    map.setZoom(getBoundsZoomLevel(bounds, mapDim) )
    map.setCenter(bounds.getCenter(), map.fitBounds(bounds));
    return map;
}











