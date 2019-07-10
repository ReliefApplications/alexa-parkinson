
/**
 * Function that checks if a function is valid to be called
 * @param {Function} func - Function to check
 */
function isValidFunction(func) {
    return func !== undefined && (func instanceof Function);
}

module.exports.trees = (function () {

    /**
     * Encodes a specifix state of the discussion
     * @constructor
     * @param {Object} actions - Functions to execute in various contexts. 'main' is mandatory.
     */
    function /** @class */ State(actions) {

        if (!isValidFunction(actions['main'])) {
            throw "Main function not specified!";
        }

        this.actions = actions;
        this.children = {};
    }



    State.prototype.setAction =
        /**
         * @param {Function} callback - change the main function of the node
         */
        function (callback) {
            this.action = callback;
        }


    State.prototype.addChild =
        /**
         * 
         * @param {string} hash - The "name" of the node into the tree (used to choose one between more children) 
         * @param {State} node - The actual node object
         */
        function (hash, node) {
            if (node instanceof StateTree) {
                this.children[hash] = node.rootNode
            } else {
                this.children[hash] = node;
            }
            return this;
        }

    State.prototype.do =
        /**
         * Executes one action of the node.
         * @param {string} name - Name of the action
         * @param {Array} params - Array of parameters to pass to the function
         */
        function (name, params) {
            if (isValidFunction(this.actions[name])) {
                return this.actions[name](params);
            }
            return null;
        }

    State.prototype.mainAction =
        /**
         * Executes the 'main' function. A 'façade' for 'State.prototype.do' 
         * @param {Array} params - Parameters to pass to an Array 
         */
        function (params) {
            return this.do('main', params)
        }

    State.prototype.saidYes =
        /**
         * Executes the 'yes' function of the node.
         * @param {Array} params - Parameters to pass to the 'yes' function of the node 
         */
        function (params) {
            // this.yes(request, response);
            this.do('yes', params)
        }

    State.prototype.saidNo =
        /**
         * Executes the 'no' function of the node.
         * @param {Array} params - Parameters to pass to the 'no' function of the node 
         */

        function (params) {
            this.do('no', params);
        }

    State.prototype.didNotUnderstand =
        /**
         * Executes the 'didNotUnderstand' function of the node.
         * @param {Array} params - Parameters to pass to the 'didNotUnderstand' function of the node 
         */
        function (params) {
            // this.didNotUnderstand(params);
            this.do('didNotUnderstand', params);
        }

    /**
     * Dialogue tree
     * @param {Function} rootCallback - Callback of root node 
     */
    function /** @class */ StateTree(rootCallback) {
        this.rootNode = new State(rootCallback);
        this.currentNode = this.rootNode;
        // this.nodes = {}
    }

    /**
     * @param {string} stateName - Name of the child intent
     * @param {State} state - State associated with the stateName
     */
    StateTree.prototype.addIntentAction = function (stateName, state) {
        this.rootNode.addChild(stateName, state);
        return this;
    }

    StateTree.prototype.navigateTo = function (stateName, ...params) {
        // Take what is supposed to be the next node
        // response.say("Before nextnode");
        let nextNode = this.currentNode.children[stateName.toString()];
        // If it's not a child
        if (nextNode === undefined) {
            this.currentNode = this.rootNode;
            nextNode = this.currentNode.children[stateName.toString()];
            // console.log("After check", nextNode);
        } else if (nextNode instanceof StateTree) {
            nextNode = nextNode.rootNode;
            nextNode = this.currentNode.children[stateName.toString()];
        }

        this.currentNode = nextNode;

        return this.currentNode.mainAction(params);
    }

    StateTree.prototype.setRootAction = function (callback) {
        this.rootNode.setAction(callback);
    }

    StateTree.prototype.start = function () {
        this.rootNode.mainAction();
    }

    StateTree.prototype.saidYes = function (...params) { this.currentNode.saidYes(params); }
    StateTree.prototype.saidNo = function (...params) { this.currentNode.saidNo(params); }
    StateTree.prototype.didNotUnderstand = function (...params) { this.currentNode.didNotUnderstand(params); }


    return {
        State: State,
        StateTree: StateTree
    };

})()
