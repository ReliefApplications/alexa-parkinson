
const dialogueTree = require('../dialogue-tree');

const Utils = require('../../../Utils').Utils;
const Constants = require('../../../Constants').Constants;

const texts = Utils.TEXTS;
const images = Utils.IMAGES;

const call = new dialogueTree.trees.State(
    (request, response) => {
        response.say(texts.callText);

    },

    // Yes
    (request, response) => {
        // Calling the association.
        // TODO: ask how are association - patient
    },

    // No
    (request, response) => {},

    // Didn't understand
    (request, response) => {}

);

module.exports.callState = call;