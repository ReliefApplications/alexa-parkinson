const tree = require('../dialogue-tree');
const utils = require('../../../Utils').Utils;
const userService = require('../../database/userdata');

const registration = new tree.trees.State(
    ([slots, userId]) => {
        if (slots['name'] !== undefined) {
            let name = slots['name'].value;
            
            userService.saveUser(userId, name);
            
            return {
                name: name
            }
        }
    },

    () => { }, // yes

    () => { }, // no

    () => { } // no comprendido
);

module.exports.registrationIntent = registration;