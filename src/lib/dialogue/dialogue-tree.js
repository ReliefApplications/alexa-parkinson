module.exports.trees = (function () {

    /**
     * Encodes a specifix state of the discussion
     * @constructor
     * @param {Function} callback - Function to execute when entering the state
     * @param {Function} yes - Function to execute when answering 'yes'
     * @param {Function} no - Function to execute when answering 'no'
     * @param {Function} nocomprendo - Function to execute when answering 'don't understand'
     */
    function State(callback, yes, no, nocomprendo) {

        this.yes = yes instanceof Function ? yes : () => {};
        this.no = no instanceof Function ? no : () => {};
        this.nocomprendo = nocomprendo instanceof Function ? nocomprendo : () => {};
        this.action = callback instanceof Function ? callback : () => {};

        this.children = {};

        // Useful?
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

        State.prototype.do = function (...params) {
            this.action(params);
        }

        State.prototype.saidYes = function() {
            this.yes();
        }

        State.prototype.saidNo = function() {
            this.no();
        }

        State.prototype.didntUnderstood = function() {
            this.nocomprendo();
        }
    }

    /**
     * Wrapper for the tree of states
     * @param {Function} rootCallback - Callback of root node 
     */
    function StateTree(rootCallback) {
        this.rootNode = new State(rootCallback);
        this.currentNode = this.rootNode;
        // this.nodes = {}

        StateTree.prototype.addIntentAction = function (hash, node) {
            this.rootNode.addChild(hash, node);
            return this;
        }

        StateTree.prototype.navigateTo = function (hash, ...params) {
            // Take what is supposed to be the next node
            let nextNode = this.currentNode.children[hash.toString()];
            // If it's not a child
            if (nextNode === undefined) {
                // Should be a in-order search
                this.currentNode = this.rootNode;
                nextNode = this.currentNode.children[hash.toString()];
                // console.log("After check", nextNode);
            } else if (nextNode instanceof StateTree) {
                nextNode = nextNode.rootNode;
                nextNode = this.currentNode.children[hash.toString()];
            }

            // If nextNode is still undefined, it's not a child of the root node
            this.currentNode = nextNode;
            this.currentNode.do(params);
        }

        StateTree.prototype.setRootAction = function (callback) {
            this.rootNode.setAction(callback);
        }

        StateTree.prototype.start = function () {
            debugger;
            this.rootNode.do();
        }

        StateTree.prototype.saidYes = function() { this.currentNode.saidYes(); }
        StateTree.prototype.saidYes = function() { this.currentNode.saidNo(); }
        StateTree.prototype.didntUnderstood = function() { this.currentNode.didntUnderstood(); }
    }

    return {
        State: State,
        StateTree: StateTree
    };
})()