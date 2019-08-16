/**
 * **Controller**
 * @abstract
 * @class Controller
 */
const Controller = class {

    constructor(name) {
        this.name = name;
    }

    
    /**
     * Controller's entrypoint, allowing it to perform its action
     * @param {*} request 
     * @param {*} response 
     */
    main(request, response) {
        throw Error(`Function "main" is not implemented for controller ${this.name} !`)
    }

    yes(user, slots) {
        throw Error(`Function "yes" is not implemented for controller ${this.name} !`)
    }

    no(user, slots) {
        throw Error(`Function "no" is not implemented for controller ${this.name} !`)
    }

}

module.exports = Controller;