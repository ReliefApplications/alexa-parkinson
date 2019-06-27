const tree = require('../dialogue-tree');
const utils = require('../../../Utils');


module.exports.registrationIntent = new tree.trees.State(
    ([slots]) => {
        utils.log("slots is", slots);
        utils.log("Registration #0");
        if (slots['name'] !== undefined) {
            utils.log("'name' exists");
            let name = slots['name'].value;

            return {
                name: name
            }
        }
    },

    () => { }, // yes

    () => { }, // no

    () => { } // no comprendido
);
