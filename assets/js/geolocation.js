
function loadMarker(data) {
  var template = $('#marker-template').html();
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template, data);
  $('body').html(rendered);
}


function build_Marker(data){

var $container = $('.location-marker');
//var $container = $('.location-marker');
var $img = $('.location-img');
var $latitude = $('.location-latitude');
var $longitude = $('.location-longitude');
var $content = $('.location-content');
var $audio = $('.location-audio');
		
		$img.attr('data-width',data.teaser_image.width)
			.attr('data-height',data.teaser_image.height)
			.attr('data-original-imgage',data.main_image.url)
			.attr('data-audio-src',data.audio_src.url);
		$img.find('img').attr('src','http://localhost:8000/data/route-1/img/meer.png');//data.teaser_image.url
		$latitude.text(data.pos.latitude);
		$longitude.text(data.pos.longitude);

    $audio.find('source').attr('type','audio/mpeg').attr('src', data.audio_src.mp4);
		$audio.find('source').attr('type','audio/ogg').attr('src', data.audio_src.ogg);
		$container.attr('data-id',data.id)
      .attr('data-longitude',data.longitude)
			.attr('data-latitude',data.latitude);
		$content.find('h1').text(data.title);
		$content.find('p').text(data.text);


}


$.ajax({ 
    type: 'GET',
    url: '../data/route-1/route-1.json', 
    data: { get_param: 'value' }, 
    dataType: 'json',
    success: function (data) {
      //loadMarker(data);
      data.story.forEach(function(single){
        console.log(single);
      var holder = $('<div/>');
      holder.attr('class','holder')
          .prependTo('body');

        var $id = '#story-' + single.meta.id;
      var template_story = $("#story-template").html();
      var html_story = Mustache.to_html(template_story, single);
          holder.html(html_story);

      var template_marker = $("#marker-template").html();
      var html_marker = Mustache.to_html(template_marker, single);
          $($id).find('#marker').html(html_marker);
      });
      bind_events();

      //data.forEach(function(marker){
      //  console.log(marker);
      //  //build_Marker(marker);
//
      //});
 			
    },
    error : function(error){
    	console.log(error);
    }

});
//______________________________________________________
var currentPosition = {
	longitude:0,
	latitude:0
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
  	// 	console.log('Distanz zum Marker: ',distance);
  	// 	console.log('OriginalPosition', currentPosition);
  	// console.groupEnd();
    // Do something here cause they reached their destination
  }
  else{
  	// console.group('Nope');
  	// 	console.log('Zu weit weg! Distanz zum nächsten Marker: ',distance);
  	// 	console.log('OriginalPosition', currentPosition);
  	// console.groupEnd();
  }
}
function run_program(time){
		OnInterval();
}

var time = 0;
function loop(time){
	requestAnimationFrame(loop);

	run_program(time);
}

loop(time);


//__________________________________________________

function bind_events(){
var $body = $('body');
var $btns = $('.ico-button');

var $btn_marker  = $('[data-action="action-marker"]');
var $btn_haltestellen  = $('[data-action="action-haltestellen"]');

var $articles = $('article');

$btns.bind({
  click : function(){
  
    var $action = $(this).data('action');
    var $selector = '.story-'+$action;
    console.log($selector);
        $articles.fadeOut();

        $($selector).fadeIn(200);
  }
});

$btns.bind({
  click : function(){
    console.log('click');
  }
});

console.log($btn_haltestellen,$btn_marker);

}



















