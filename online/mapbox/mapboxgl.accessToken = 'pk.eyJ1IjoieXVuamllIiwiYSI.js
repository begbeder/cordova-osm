mapboxgl.accessToken = 'pk.eyJ1IjoieXVuamllIiwiYSI6ImNpZnd0ZjZkczNjNHd0Mm0xcGRoc21nY28ifQ.8lFXo9aC9PfoKQF9ywWW-g';
var sfmapbox = [-122.413692, 37.775712];
// sfmapbox = [-122,37];
var mylocation = sfmapbox;
var taxon_active = 'Plantae';
var markers = {};
var marker_me;

// Create a new dark theme map
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/outdoors-v9', //stylesheet location
    center: sfmapbox, // Center of USA
    zoom: 12, // starting zoom
    // minZoom: 11,
});

map.on('load', function() {

    // Disable scroll in posts
    if (window.location.search.indexOf('embed') !== -1) map.scrollZoom.disable();

    //Add controls for navigation, geocoding and geolocation
    var geocoder = new mapboxgl.Geocoder();
    map.addControl(geocoder);
    map.addControl ( new mapboxgl.Navigation({ position: 'top-left' }) );
    var geolocator = new mapboxgl.Geolocate({ position: 'top-left' });
    map.addControl(geolocator);

    //go to SF and retrieve data
    mapMe(mylocation);
    getObservation(mylocation, taxon_active);

    //Toggle icons in the event of zoom change
    map.on('zoom', function() {
        var zoom = map.getZoom();
        $('.marker').each(function() {
            checkZoom(this, zoom);
        });
    });

    //Interact with taxas buttons
    $('.button').on('click', function() {
        $('.button').removeClass('active');
        $(this).addClass('active');
        taxon_active = $(this).attr('id');
        getObservation(mylocation, taxon_active);
        $('.mapboxgl-popup') ? $('.mapboxgl-popup').remove() : null;
    });

    //Redo quest on location change
    geocoder.on('result', function(e) {
        // window.alert('new location: ' + e.result.center);
        mylocation = e.result.center;
        getObservation(mylocation, taxon_active);
        mapMe(mylocation);
        $('.mapboxgl-popup') ? $('.mapboxgl-popup').remove() : null;
    });

    //Redo quest on geolocation
    geolocator.on('geolocate', function(position) {
        mylocation = [position.coords.longitude, position.coords.latitude];
        map.zoomTo(12);
        mapMe(mylocation);
        getObservation(mylocation, taxon_active);
    });

    //Mobile friendly
    $('#info').on('click', function() {
        if ( $('#introduction').is(':visible') ) {
            $('#introduction').hide();
            $('#info').css('background-image', 'url(img/arrow_down.svg)');
            $('#sidebar').css('height', '150px');
        } else {
            $('#introduction').show();
            $('#info').css("background-image", 'url(img/arrow_up.svg)');
            $('#sidebar').css('height', '240px');
        }
    })
});

// Map the user location using a marker called me
function mapMe(location) {
    if (!document.getElementById('me')) {
        var me = document.createElement('div');
        me.id = "me";
        me.style.backgroundImage = 'url(img/icon_me.png)';
        marker_me = new mapboxgl.Marker(me)
            .setLngLat(location)
            .addTo(map);
    } else {
        marker_me.setLngLat(location);
    }

    map.flyTo({ 'center': location, 'zoom': 12 });
}

// Retrieve from API, map the markers to the map, and save relevant data in html. Pop-ups for marker on click.
function getObservation(location, taxon) {

    $('.loading').show();

    // clean up previous markers
    for (marker in markers) {
        markers[marker].remove();
    }
    markers = {};

    //create url
    var iNat_url = createURL(location, taxon);

    // get results from url
    try {
        iNat_results = $.getJSON(iNat_url, function() {
            // console.log("API results: ", iNat_results.responseJSON.results);

            // Update count in html description
            $('#count').html(iNat_results.responseJSON.results.length);

            // Used for marker change on zoom level
            var zoom = map.getZoom();

            // Iterate through all API results
            iNat_results.responseJSON.results.forEach(function(marker) {
                // create an img element for the marker
                var el = document.createElement('div');
                el.className = 'marker';
                img_url = marker.photos[0].url;

                // text description for popup
                var species = marker.species_guess ? marker.species_guess : 'Unknown';
                var user = marker.user.name ? marker.user.name : 'Anonymous';
                text = [species, ", observed on ", marker.observed_on, " by ", user,
                    ". <a href=", marker.uri, " target='_blank'>link</a>"
                ].join('');
                text = text.charAt(0).toUpperCase() + text.substr(1);

                // img_url = img_url.replace("http", "https");
                $(el).attr('data-img', img_url);
                $(el).attr('data-taxon', taxon);
                $(el).attr('data-text', text);
                $(el).attr('data-latlon', marker.geojson.coordinates);

                // Map to the map with markers for the current zoomlevel
                checkZoom(el, zoom);

                // add marker to map
                markers[marker.id] = new mapboxgl.Marker(el)
                    .setLngLat(marker.geojson.coordinates)
                    .addTo(map);
            });

            $('.loading').hide();

            // markers on click
            $('.marker').click(function(e) {

                e.stopPropagation();

                var latlon = $(this).attr('data-latlon').split(",");
                latlon = [Number(latlon[0]), Number(latlon[1])];

                var img_med = $(this).attr('data-img').replace('square', 'medium');
                var html = "";
                html = ["<div class='img-md' style='background-image:url(", img_med, ")'></div><p>",
                    $(this).attr('data-text'), "</p>"
                ].join("");

                $('.mapboxgl-popup') ? $('.mapboxgl-popup').remove() : null;

                var popup = new mapboxgl.Popup()
                    .setLngLat(latlon)
                    .setHTML(html)
                    .addTo(map);

            });
        });
    } catch (e) {
        window.alert("API not working properly :(")
    }
}

// Create the url for API request
function createURL(location, taxon) {
    url = ['https://api.inaturalist.org/v1/observations?geo=true&native=true&photos=true&lat=',
        location[1], '&lng=', location[0], '&radius=5&iconic_taxa=', taxon, '&order=desc&order_by=created_at'
    ].join('');
    console.log("API url: ", url);
    return url;
}

// Check what zoom level for what markers, then map to map
function checkZoom(marker, zoom) {
    var img;
    if (zoom < 12) {
        $(marker).addClass('sm');
        img = 'url(img/marker_' + $(marker).attr('data-taxon').toLowerCase() + '.png)';
        $(marker).css("background-image", img);
    } else {
        $(marker).removeClass('sm');
        img = 'url(' + $(marker).attr('data-img') + ')';
        $(marker).css("background-image", img);
    };
}