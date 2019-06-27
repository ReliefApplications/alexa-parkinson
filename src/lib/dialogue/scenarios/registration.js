const tree = require('../dialogue-tree');

module.exports.registrationIntent = new tree.trees.State(
    (slots) => {
        if (slots['name'] !== undefined) {
            let name = slots['name'].value;

            return {
                name: name
            }
        }
    },

    () => { }, // yes

    () => { }, // no

    () => { } // no comprendido
)