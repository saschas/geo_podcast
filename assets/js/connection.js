$.couch.urlPrefix = "http://127.0.0.1:5984";



$.couch.login({
    name: "sascha",
    password: "..,-fidmg",
    success: function(data) {
        console.log('login' , data);
    },
    error: function(status) {
        console.log('login' , status);
    }
});

$.couch.session({
    success: function(data) {
        console.log('session' , data);
    }
});

var $db = $.couch.db("geo_location");



$db.info({
    success: function(data) {
        console.log('info' , data);
    }
});

$db.allDocs({
    success: function(data) {
    	console.log('data.rows',data.rows);
      $.each(data.rows,function(i,d){
      	var $span = $('<span>');
      	$span.data('id',d.id)
      	.appendTo('.story-overview').text(d.title);

      	console.log('d',d)
      });
    }
});

$db.openDoc("e980c9c24829f73ca25d923b3003317d", {
    success: function(data) {
        console.log(data);
    },
    error: function(status) {
        console.log(status);
    }
});

$db.allDesignDocs({
    success: function(data) {
        console.log('allDesignDocs' , data);
    }
});

var mapFunction = function(doc) {
    emit();
};