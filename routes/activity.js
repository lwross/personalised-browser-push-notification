//'use strict';

// Dependencies
var util = require( 'util' );
var webpush = require('web-push');

// VAPID keys should only be generated only once.
var vapidKeys = webpush.generateVAPIDKeys();

exports.logExecuteData = [];

function logData( req, http_result ) {
    exports.logExecuteData.push({
    	http_result: {
			body: http_result.body,
			headers: http_result.headers,
			trailers: http_result.trailers,
			method: http_result.method,
			url: http_result.url,			
			request_options: http_result.request_options   	
    	},
    	activity: {
			body: req.body,
			headers: req.headers,
			trailers: req.trailers,
			method: req.method,
			url: req.url,
			params: req.params,
			query: req.query,
			route: req.route,
			cookies: req.cookies,
			ip: req.ip,
			path: req.path,
			host: req.host,
			fresh: req.fresh,
			stale: req.stale,
			protocol: req.protocol,
			secure: req.secure,
			originalUrl: req.originalUrl
		}	
    });
    /*
        console.log( "body: " + util.inspect( req.body ) );
        console.log( "headers: " + req.headers );
        console.log( "trailers: " + req.trailers );
        console.log( "method: " + req.method );
        console.log( "url: " + req.url );
        console.log( "params: " + util.inspect( req.params ) );
        console.log( "query: " + util.inspect( req.query ) );
        console.log( "route: " + req.route );
        console.log( "cookies: " + req.cookies );
        console.log( "ip: " + req.ip );
        console.log( "path: " + req.path );
        console.log( "host: " + req.host );
        console.log( "fresh: " + req.fresh );
        console.log( "stale: " + req.stale );
        console.log( "protocol: " + req.protocol );
        console.log( "secure: " + req.secure );
        console.log( "originalUrl: " + req.originalUrl );
    */ 
}


/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );;
    res.send( 200, 'Edit' );
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log('req.body', req.body );
    //console.log('vapidKeys', vapidKeys);
    res.send( 200, 'Save' );
};

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function( req, res ) {
	console.log('body',util.inspect(req.body, {showHidden: false, depth: null}));
	//console.log('body',JSON.stringify(req.body));
	
	//merge the array of objects.
	var aArgs = (req.body && req.body.inArguments) ? req.body.inArguments : [];
	var oArgs = {};
	if (aArgs) {
		for (var i=0; i<aArgs.length; i++) {  
			for (var key in aArgs[i]) { 
				oArgs[key] = aArgs[i][key]; 
			}
		}
	}	

	//console.log('oArgs',util.inspect(oArgs, {showHidden: false, depth: null}));
	//console.log('oArgs',JSON.stringify(oArgs));
	//console.log('token',req.session.token);


//////////////////////////// START WEB PUSH //////////////////////////

	var vapidKeys = webpush.generateVAPIDKeys();

	var title = oArgs.title || "Web Push Notification";
	var body = oArgs.body || "Hello There";
	var tag = oArgs.tag || "";
	var icon = oArgs.icon || "/images/icon-192x192.png";
	var p256dh = oArgs.p256dh;
	var auth = oArgs.auth;
	var subscriptionID = oArgs.subscriptionID;
	var endpoint = "https://android.googleapis.com/gcm/send/" + subscriptionID;

	console.log('p256dh', p256dh);
	console.log('auth', auth);
	console.log('subscriptionID', subscriptionID);
	console.log('endpoint', endpoint);


	webpush.setGCMAPIKey(process.env.GCM_SERVER_KEY);
	webpush.setVapidDetails(
	  'mailto:'+process.env.YOUR_EMAIL_ADDRESS,
	  vapidKeys.publicKey,
	  vapidKeys.privateKey
	);

	console.log('vapidKeys', vapidKeys);

	// This is the same output of calling JSON.stringify on a PushSubscription
	const pushSubscription = {
	  endpoint: endpoint,
	  keys: {
	    auth: auth,
	    p256dh: p256dh
	  }
	};

	console.log('pushSubscription', pushSubscription);

	var pushNotification = {
		  title: title,
	      body: body,
	      icon: icon,
	      tag: tag
	};

	console.log('pushNotification',JSON.stringify(pushNotification));

	webpush.sendNotification(pushSubscription, 
		JSON.stringify(pushNotification)
	).then(function (res){
	    console.log('sendNotification Promise',res);
	    console.log('Promise statusCode',res.statusCode);
	  });

	res.send( 200, body );
//////////////////////////// END WEB PUSH //////////////////////////
	
};

/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    console.log( 'req.body', req.body );
    res.send( 200, 'Publish' );
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    res.send( 200, 'Validate' );
};
