const SkillMemory = require('./../models/skill-memory');

/**
 * Memory saved during the last request
 * @type {SkillMemory}
 */
let memory = undefined;

/**
 * Memory used during this request to interact with the user
 * @type {SkillMemory}
 */
let hotMemory = undefined;

module.exports = {
    /** Update the hot memory for dynamic dialogs */
    updateHotMemory: function() {
        hotMemory = memory;
        memory = undefined;
    },

    /** 
     * Save a new memory
     * @param {SkillMemory} memory memory to save
     */
    setMemory: function(newMemory) {
        memory = newMemory;
    },
    /**
     * Return the last memory saved
     * @returns {SkillMemory}
     */
    getHotMemory: function() {
        return hotMemory;
    },

    /**
     * Say what this memory kept in mind
     * @param {*} request
     * @param {*} response
     */
    onRepeat(request, response) {
        if( hotMemory && hotMemory.saying ) {
            response.say(hotMemory.saying);
            response.send();
            memory = hotMemory;
        } else {
            response.say(`No me recuerdo lo que he dicho.`);
            response.send();
        }

        return response.shouldEndSession(false);
    },

    /** 
     * Execute action planed on user confirmation
     * @param {*} request
     * @param {*} response
     */
    onYes(request, response) {
        if( !hotMemory ) {
            response.say('A mi me gusta tu positivismo !');
            return response.shouldEndSession(false);
        } else {
            return hotMemory.onYes(request, response);
        }
        
    },

    /** 
     * Execute action planed on user refusal
     * @param {*} request
     * @param {*} response
     */
    onNo(request, response) {
        if( !hotMemory ) {
            response.say('No ? Porqué');
            return response.shouldEndSession(false);
        } else {
            return hotMemory.onNo(request, response);
        }
    },
}