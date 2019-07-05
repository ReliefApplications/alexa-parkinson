const tree = require('../dialogue-tree');
const utils = require('../../../Utils').Utils;
const userService = require('../../database/userdata');

const registration = new tree.trees.State({
    main: ([slots, userId]) => {
        if (slots['name'] !== undefined) {
            let name = slots['name'].value;
            
            userService.addNewUser(userId, name);
            
            return {
                name: name
            }
        }
    },

    yes: () => { }, // yes

    no: () => { }, // no

    didNotUnderstand: () => { } // no comprendido
});

module.exports.registrationIntent = registration;