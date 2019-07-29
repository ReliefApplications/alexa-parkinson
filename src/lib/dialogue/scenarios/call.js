
const State = require('../dialogue-tree').trees.State;

const Utils = require('../../../Utils').Utils;
const constants = require('../../../Constants');

const texts = Utils.getText(constants.texts.call);
const images = constants.images;

// console.log(texts);

const call = new State({
    main: ([request, response]) => {
        
        
        response.say(texts.text);
        response.reprompt(texts.reprompt);

        if (Utils.supportsDisplay(request)) {
            response.directive(Utils.renderBodyTemplate(constants.images.defaultImage, texts.title, texts.text));
        }
        response.shouldEndSession(false);
        return response;
    },

    // Yes
    yes: ([request, response]) => {
        response.say("Estoy llamando");
    },

    // No
    no: ([request, response]) => {
        response.shouldEndSession(true);
    },

    // Didn't understand
    didNotUnderstand: ([request, response]) => {
        response.shouldEndSession(false);
    }

});

module.exports.callIntent = call;