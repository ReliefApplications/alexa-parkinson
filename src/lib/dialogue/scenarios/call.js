
const State = require('../dialogue-tree').trees.State;

const Utils = require('../../../Utils').Utils;
const Constants = require('../../../Constants');

const texts = Constants.TEXTS;
const images = Constants.IMAGES;

// console.log(texts);

const call = new State({
    main: ([request, response]) => {
        response.say(texts.callText);
        response.reprompt(texts.callReprompt);
        if (Utils.supportsDisplay(request)) {
            response.directive(Utils.renderBodyTemplate(Constants.IMAGES.defaultImage, Constants.TEXTS.callTitle, Constants.TEXTS.callText));
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