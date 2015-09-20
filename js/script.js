$(document).ready(function() {
    var var_map;
    var var_location;
    var var_mapoptions;
    var var_marker;

      function init_map() {
        var_location = new google.maps.LatLng(45.430817,12.331516);
 
        var_mapoptions = {
          center: var_location,
          zoom: 14
        };
 
        var_marker = new google.maps.Marker({
            position: var_location,
            map: var_map,
            title:"Venice"});
 
        var_map = new google.maps.Map(document.getElementById("map-container"),
            var_mapoptions);
 
        var_marker.setMap(var_map); 
 
      }
        
      google.maps.event.addDomListener(window, 'load', init_map);

  });

function loadData() {

    var $body = $('body');
    var $background = $('#background');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $strViewElem = $('#streetview-foto');
    var $greeting = $('#greeting');
    var $googleHeader = $('google-header');
    var $googleMap = $('google-map');
    var streetValue = $('#street').val();
    var cityValue = $('#city').val();
    var address = streetValue + ', ' + cityValue;
    var map;
    

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    $strViewElem.text("");
    $googleMap.text("");

    //Greeting text includes location
    $greeting.text('So, you want to live at ' + address + '?');

    //Generates Google Streetview image
    var streetviewUrl = "http://maps.googleapis.com/maps/api/streetview?size=600x400&location=" + address + "";
    $strViewElem.append('<img class="strvimg" src="' + streetviewUrl + '">');

    // creates link for AJAX request
    var requestNYT = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + cityValue + "&begin_date=20150101&api-key=bec2df7e772a904f941747a02d2bc3e7:4:72782796";

    // NYTimes AJAX request
    $.getJSON(requestNYT)
        .done ( function (data) {
            $nytHeaderElem.text("New York Times articles about: " + cityValue);
            articles = data.response.docs;

            //runs through each article and provides the requested data from each
            for (var i = 0 ; i < articles.length ; i++ ) {
                var headlineAndLink = "<a href='" + articles[i].web_url + "'target='_blank''>" + articles[i].headline.main;
                var snippet = "<p>" + articles[i].snippet + "</p>" ;
                $nytElem.append("<li class='article'>" + headlineAndLink  + "</a>" + snippet + "</li>" );
                };
        })

        .fail ( function (e) {
            $nytHeaderElem.text("New York Times article could not be loaded.");
        });

    // wiki link created with Wikipedia API sandbox
    var requestWiki = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+ cityValue + '&format=json&callback=wikiCallback'

    // var wikiRequestTimeout = setTimeout(function(){
    //     $wikiElem.text("Wikipedia articles could not be loaded.");
    // }, 8000);

    // Wikipedia AJAX request
    $.ajax({
        type: "GET",
        url: requestWiki,
        dataType: "jsonp",
        success: function (response) {
            var wikiArticles = response[1];

            for (var i = 0 ; i < wikiArticles.length ; i++ ) {
                var articleStr = wikiArticles[i];
                var url = "http://en.wikipedia.org/wiki/" + wikiArticles[i];
                $wikiElem.append("<li><a href='" + url + "'target='_blank'>" + articleStr + "</a></li>" );
                };
            // clearTimeout(wikiRequestTimeout);
        },
        error: function (e) {
            $wikiElem.text("Wikipedia articles could not be loaded.");
        }
    });

    return false;
};

$('#form-container').submit(loadData);


// creates the map
// function initMap() {
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: -34.397, lng: 150.644},
//     zoom: 8
//   });
// }
// appending the map
// $googleMap.append('<div id="map"></div>');