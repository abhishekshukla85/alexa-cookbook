var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    // alexa.appId = 'amzn1.echo-sdk-ams.app.1234';

    ///alexa.dynamoDBTableName = 'YourTableName'; // creates new table for session.attributes

    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
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
        this.emit(':ask', 'How can I help you today?');
    },

    'AMAZON.CancelIntent' : function() {
        this.emit(':tell', 'I will cancel, this was fun though!');
    },

    'AMAZON.StopIntent' : function() {
        var myName = '';
        if (this.attributes['name']) {
            myName = this.attributes['name'];
        }
        this.emit(':tell', 'goodbye, ' + myName, 'try again');
    }
};

