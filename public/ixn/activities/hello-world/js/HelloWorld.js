define( function( require ) {

    'use strict';
    
	var Postmonger = require( 'postmonger' );
	var $ = require( 'vendor/jquery.min' );

    var connection = new Postmonger.Session();
    var toJbPayload = {};
    var step = 1; 
	var endpoints;
	
    $(window).ready(onRender);

    connection.on('initActivity', function(payload) {
        var amount;

        if (payload) {
            toJbPayload = payload;
            console.log('payload',payload);
            
			//merge the array of objects.
			var aArgs = toJbPayload['arguments'].execute.inArguments;
			var oArgs = {};
			for (var i=0; i<aArgs.length; i++) {  
				for (var key in aArgs[i]) { 
					oArgs[key] = aArgs[i][key]; 
				}
			}
			//oArgs.amount will contain a value if this activity has already been configured:
			//amount = oArgs.amount || toJbPayload['configurationArguments'].defaults.amount;            
        }
        
		$.get( "/version", function( data ) {
			$('#version').html('Version: ' + data.version);
		});                

        // If there is no amount selected, disable the next button
        if (!amount) {
            connection.trigger('updateButton', { button: 'next', enabled: false });
        }

		//$('#selectAmount').find('option[value='+ amount +']').attr('selected', 'selected');		
		gotoStep(step);
        
    });

    connection.on('requestedEndpoints', function(data) {
		if( data.error ) {
			console.error( data.error );
		} else {
			endpoints = data;
            console.log("endpoints",data);
		}        
    });

    connection.on('clickedNext', function() {
        step++;
        gotoStep(step);
        connection.trigger('ready');
    });

    connection.on('clickedBack', function() {
        step--;
        gotoStep(step);
        connection.trigger('ready');
    });

    function onRender() {
        connection.trigger('ready');
        connection.trigger('requestEndpoints');

        // Disable the next button if a value isn't selected
        $('#userTitle').keyup(function() {
            var title = getTitle();
            var body = getBody();
            var tag = getTag();
            var icon = getIcon();
            var valid = Boolean(title) && Boolean(tag) && Boolean(body) && Boolean(icon);
            connection.trigger('updateButton', { button: 'next', enabled: valid });
        });

        $('#userBody').keyup(function() {
            var title = getTitle();
            var body = getBody();
            var tag = getTag();
            var icon = getIcon();
            var valid = Boolean(title) && Boolean(tag) && Boolean(body) && Boolean(icon);
            connection.trigger('updateButton', { button: 'next', enabled: valid });
        });

        $('#userTag').keyup(function() {
            var title = getTitle();
            var body = getBody();
            var tag = getTag();
            var icon = getIcon();
            var valid = Boolean(title) && Boolean(tag) && Boolean(body) && Boolean(icon);
            connection.trigger('updateButton', { button: 'next', enabled: valid });
        });

        $('#userIcon').keyup(function() {
            var title = getTitle();
            var body = getBody();
            var tag = getTag();
            var icon = getIcon();
            var valid = Boolean(title) && Boolean(tag) && Boolean(body) && Boolean(icon);
            connection.trigger('updateButton', { button: 'next', enabled: valid });
        });


    };

    function gotoStep(step) {
        $('.step').hide();
        switch(step) {
            case 1:
                console.log("step", 1);
                $('#step1').show();
                var title = getTitle();
                var body = getBody();
                var tag = getTag();
                var icon = getIcon();
                var valid = Boolean(title) && Boolean(tag) && Boolean(body) && Boolean(icon);
                connection.trigger('updateButton', { button: 'next', text: 'next', enabled: valid });
                connection.trigger('updateButton', { button: 'back', visible: false });
                break;
            case 2:
                console.log("step", 2);
                $('#step2').show();
                var title = getTitle();
                var body = getBody();
                var tag = getTag();
                var icon = getIcon();
                var valid = Boolean(title) && Boolean(tag) && Boolean(body) && Boolean(icon);
                connection.trigger('updateButton', { button: 'next', text: 'next', enabled: valid });
                connection.trigger('updateButton', { button: 'back', visible: true });
                break;
            case 3:
                console.log("step", 3);
                $('#step3').show();
                $('#showTitle').html(getTitle());
                $('#showBody').html(getBody());
                $('#showTag').html(getTag());
                $('#showIcon').html(getIcon(true));
                connection.trigger('updateButton', { button: 'back', visible: true });
                connection.trigger('updateButton', { button: 'next', text: 'done', visible: true });
                break;
            case 4: // Only 2 steps, so the equivalent of 'done' - send off the payload
                console.log("step", 3);
                save();
                break;
        }
    };

    function getTitle() {
        return $('#userTitle').val().trim();
    };
    function getBody() {
        return $('#userBody').val().trim();
    };
    function getTag() {
        return $('#userTag').val().trim();
    };
    function getIcon(asImg) {
        asImg = asImg == undefined ? false : asImg;
        var rv = $('#userIcon').val().trim();
        if (asImg) {
            var img = '<img src="' + rv + '" />';
            rv = img;
        } 
        return rv;
    };

    function save() {

        var title = getTitle();
        var body = getBody();
        var tag = getTag();
        var icon = getIcon();

        // toJbPayload is initialized on populateFields above.  Journey Builder sends an initial payload with defaults
        // set by this activity's config.json file.  Any property may be overridden as desired.
        //toJbPayload.name = "my activity";

        //this will be sent into the custom activity body within the inArguments array.
        toJbPayload['arguments'].execute.inArguments.push({"title": title});
        toJbPayload['arguments'].execute.inArguments.push({"body": body});
        toJbPayload['arguments'].execute.inArguments.push({"tag": tag});
        toJbPayload['arguments'].execute.inArguments.push({"icon": icon});

        console.log("toJbPayload", toJbPayload['arguments'].execute.inArguments);

		/*
        toJbPayload['metaData'].things = 'stuff';
        toJbPayload['metaData'].icon = 'path/to/icon/set/from/iframe/icon.png';
        toJbPayload['configurationArguments'].version = '1.1'; // optional - for 3rd party to track their customActivity.js version
        toJbPayload['configurationArguments'].partnerActivityId = '49198498';
        toJbPayload['configurationArguments'].myConfiguration = 'configuration coming from iframe';
		*/
		
		toJbPayload.metaData.isConfigured = true;  //this is required by JB to set the activity as Configured.
        connection.trigger('updateActivity', toJbPayload);
    }; 
    	 
});
			
