function cfoStore() {
    this.items = {};

    /**
    * Sets an item to the cfo store
    * @param {any} key
    * @param {any} value
    */
    this.setItem = function(key, value) {
        this.items[key] = value;
    }

    /**
    * Removes given key from the cfo store and returns true if item is delted
    * @param {any} key
    */
    this.removeItem = function(key) {
        if (this.items.hasOwnProperty(key)) {
            delete this.items[key];
            return true;
        }
        return false;
    }

    /**
    * Gets an item from the cfo store and returns the actual object if exists or else returns null
    * @param {any} key
    */
    this.getItem = function(key) {
        if (this.items.hasOwnProperty(key)) {
            return this.items[key];
        }
        return null;
    }
}