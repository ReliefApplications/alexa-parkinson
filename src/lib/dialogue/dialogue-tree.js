module.exports.trees = (function () {

    /**
     * Encodes a specifix state of the discussion
     * @constructor
     * @param {Function} callback - Function to execute when entering the state
     * @param {Function} yes - Function to execute when answering 'yes'
     * @param {Function} no - Function to execute when answering 'no'
     * @param {Function} didNotUnderstand - Function to execute when answering 'don't understand'
     */
    function State(callback, yes, no, didNotUnderstand) {

        /** */
        this.yes = yes instanceof Function ? yes : () => {};
        this.no = no instanceof Function ? no : () => {};
        this.didNotUnderstand = didNotUnderstand instanceof Function ? didNotUnderstand : () => {};
        this.action = callback instanceof Function ? callback : () => {};

        this.children = {};
    }
    

    /**
     * @param {Function} callback - function to execute when entering the state
     */
    State.prototype.setAction = function (callback) {
        this.action = callback;
    }

    State.prototype.addChild = function (hash, node) {
        if (node instanceof StateTree) {
            this.children[hash] = node.rootNode
        } else {
            this.children[hash] = node;
        }
        return this;
    }

    State.prototype.do = function (request, response, ...params) {
        return this.action(request, response);
    }

    State.prototype.saidYes = function(request, response) {
        this.yes(request, response);
    }

    State.prototype.saidNo = function(request, response) {
        this.no(request, response);
    }

    State.prototype.didNotUnderstand = function(request, response) {
        this.didNotUnderstand(request, response);
    }

    /**
     * Wrapper for the tree of states
     * @param {Function} rootCallback - Callback of root node 
     */
    function StateTree(rootCallback) {
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

    StateTree.prototype.navigateTo = function (stateName, request, response) {
        // Take what is supposed to be the next node
        // response.say("Before nextnode");
        let nextNode = this.currentNode.children[stateName.toString()];
        // If it's not a child
        if (nextNode === undefined) {
            // response.say("Inside if");
            
            // Should be a in-order search
            this.currentNode = this.rootNode;
            nextNode = this.currentNode.children[stateName.toString()];
            // console.log("After check", nextNode);
        } else if (nextNode instanceof StateTree) {
            nextNode = nextNode.rootNode;
            nextNode = this.currentNode.children[stateName.toString()];
        }
        this.currentNode = nextNode;
        // If nextNode is still undefined, it's not a child of the root node
        return this.currentNode.do(request, response);
    }

    StateTree.prototype.setRootAction = function (callback) {
        this.rootNode.setAction(callback);
    }

    StateTree.prototype.start = function () {
        this.rootNode.do();
    }

    StateTree.prototype.saidYes = function(request, response) { this.currentNode.saidYes(request, response); }
    StateTree.prototype.saidNo = function(request, response) { this.currentNode.saidNo(request, response); }
    StateTree.prototype.didNotUnderstand = function(request, response) { this.currentNode.didNotUnderstand(request, response); }
    

    return {
        State: State,
        StateTree: StateTree
    };

})()