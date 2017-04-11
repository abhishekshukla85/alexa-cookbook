var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    // alexa.appId = 'amzn1.echo-sdk-ams.app.1234';

    alexa.dynamoDBTableName = 'HelloWorldTable'; // creates new table for session.attributes

    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {

    'NewSession': function() {
        // any previous session attributes are now loaded from Dynamo into the session attributes

        var todayNow = new Date();

        if(this.attributes['timestamp']) {  // user must have been here before
            var dateLast = new Date(this.attributes['timestamp']);
            var timeSpanMS = todayNow.getTime() - dateLast.getTime();
            var timeSpanHR = Math.floor(timeSpanMS / (1000 * 60 * 60));
            var timeSpanMIN = Math.floor(timeSpanMS / (1000 * 60 ));

            this.attributes['hoursSinceLast'] = timeSpanHR;
            this.attributes['minutesSinceLast'] = timeSpanMIN;

            var launchCount = this.attributes['launchCount'];
            this.attributes['launchCount'] = parseInt(launchCount) + 1;

        } else {  // first use
            this.attributes['hoursSinceLast'] = 0;
            this.attributes['minutesSinceLast'] = 0;
            this.attributes['launchCount'] = 0;

        }

        this.attributes['timestamp'] = todayNow;

        this.emit('MyIntent');

    },
    
    'LaunchRequest': function () {
        this.emit('MyIntent');
    },

    'MyIntent': function () {
        this.emit(':tell', 'Hello World from Alexa');
    },

    'WhatsUpIntent' : function() {
        this.emit(':ask', 'what is up?');
    },

    'MyNameIsIntent': function() {
        var myName = this.event.request.intent.slots.firstname.value;
        this.attributes['name'] = myName;

        this.emit(':ask', 'hello, ' + myName, 'try again');
    },

    'AMAZON.HelpIntent' : function() {
        var myName = '';
        if (this.attributes['name']) {
            myName = this.attributes['name'];
        }
        this.emit(':ask','Hi ' + myName + ', How can I help you today?');
    },

    'AMAZON.CancelIntent' : function() {
        var myName = '';
        if (this.attributes['name']) {
            myName = this.attributes['name'];
        }
        this.emit(':tell', 'ok ' + myName + '. I will cancel, this was fun though!');
    },

    'AMAZON.StopIntent' : function() {
        var myName = '';
        if (this.attributes['name']) {
            myName = this.attributes['name'];
        }
        this.emit(':tell', 'goodbye, ' + myName, 'try again');
    }
};

