const State = require('../dialogue-tree').trees.State;
const constants = require('../../../Constants').TEXTS;


module.exports = new State({
    main: function() {
        return Promise.resolve([constants.helpText, constants.helpScreenTitle, constants.helpScreenText]);
    },
});