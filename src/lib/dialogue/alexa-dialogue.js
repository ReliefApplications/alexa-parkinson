const tree = require('./dialogue-tree');

const dialogue = new tree.StateTree();

dialogue
    .addIntentAction()
    .addIntentAction()
    .addIntentAction()

module.exports.dialogue = dialogue;