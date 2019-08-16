/** Shape of data used to make dialogs, by keeping that last relevant answer for the skill */
const SkillMemory = class {
    /**
     * Memory of a request, allowing to dynamically answer.
     * @param {string} name name of the scenario called
     * @param {string} saying what answered Alexa when answering the scenario
     * @param {*} data saved data from response
     * @param {Function} onYes what the skill should do if the user confirm
     * @param {Function} onNo what the skill should do if the user refuse
     */
    constructor(name, saying, data, onYes, onNo) {
        this.name = name;
        this.saying = saying;
        this.data = data;
        this.onYes = onYes ? onYes : (req, res) => {};
        this.onNo = onNo ? onNo : (req, res) => {};
    }

    /** 
     * Execute action planed on user confirmation
     * @param {*} request
     * @param {*} response
     */
    onYes(request, response) {
        return this.onYes(request, response);
    }

    /** 
     * Execute action planed on user refusal
     * @param {*} request
     * @param {*} response
     */
    onNo(request, response) {
        return this.onNo(request, response);
    }
}

module.exports = SkillMemory;