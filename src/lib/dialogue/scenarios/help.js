const State = require('../dialogue-tree').trees.State;
const constants = require('../../../Constants').TEXTS;


const help = new State({
    main: function() {
        return Promise.resolve(constants.helpText);
    },
});