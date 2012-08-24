/**
 * Doubly linked list
 *
 * @author johnsonj me@justinjohnson.org
 * @version 20120723 johnsonj
 */
LinkedList = (function() {
	function Node(value) {
		this.value    = value;
		this.previous = null;
		this.next     = null;
	};

	function LinkedList() {
		this.head   = null;
		this.tail   = null;
		this.length = 0;
	};

	/**
	 * Remove the last item from the list and return its value
	 * @returns mixed
	 */
	LinkedList.prototype.pop = function() {
		var value;

		if ( this.isEmpty() ) {
			return;
		}

		value          = this.tail.value;
		this.tail      = this.tail.previous;
		this.tail.next = null;

		if  ( !--this.length ) {
			this.empty();
		}

		return value;
	};

	/**
	 * Remove the first item from the list and return its value
	 * @returns mixed
	 */
	LinkedList.prototype.shift = function() {
		var value;

		if ( this.isEmpty() ) {
			return;
		}

		value              = this.head.value;
		this.head          = this.head.next;
		this.head.previous = null;

		if  ( !--this.length ) {
			this.empty();
		}

		return value;
	};

	/**
	 * Add item on the end of the list
	 * @param mixed value
	 * @returns {LinkedList}
	 */
	LinkedList.prototype.push = function(value) {
		var newNode = new Node(value);

		if ( this.isEmpty() ) {
			this.head = newNode;
			this.tail = newNode;
		} else {
			this.tail.next   = newNode;
			newNode.previous = this.tail;
			this.tail        = newNode;
		}

		++this.length;

		return this;
	};

	/**
	 * Add item on the front of the list
	 * @param mixed value
	 * @returns {LinkedList}
	 */
	LinkedList.prototype.unshift = function(value) {
		var newNode = new Node(value);

		if ( this.isEmpty() ) {
			this.head = newNode;
			this.tail = newNode;
		} else {
			this.head.previous = newNode;
			newNode.next       = this.head;
			this.head          = newNode;
		}

		++this.length;

		return this;
	};

	/**
	 * Get the value of the item from the front of the list without removing it.
	 * @returns mixed {Boolean}
	 */
	LinkedList.prototype.peekHead = function() {
		return this.head && this.head.value;
	};

	/**
	 * Get the value of the item from the end of the list without removing it.
	 * @returns mixed {Boolean}
	 */
	LinkedList.prototype.peekTail = function() {
		return this.tail && this.tail.value;
	};

	/**
	 * Forward iteration.
	 * @param callback Callback takes args callback(nodeValue, index, linkedList)
	 * @returns {LinkedList}
	 */
	LinkedList.prototype.forEach = function(callback) {
		var i = 0, node = this.head;

		while ( node ) {
			callback(node.value, i++, this);
			node = node.next;
		}

		return this;
	};

	/**
	 * Reverse iteration.
	 * @param callback Callback takes args callback(nodeValue, index, linkedList)
	 * @returns {LinkedList}
	 */
	LinkedList.prototype.forEachReverse = function(callback) {
		var i = 0, node = this.tail;

		while ( node ) {
			callback(node.value, i++, this);
			node = node.previous;
		}

		return this;
	};

	/**
	 * Empty/destroy the current list.
	 * @returns {LinkedList}
	 */
	LinkedList.prototype.empty = function() {
		this.head   = null;
		this.tail   = null;
		this.length = 0;

		return this;
	};

	/**
	 * Is the current list empty?
	 * @returns {Boolean}
	 */
	LinkedList.prototype.isEmpty = function() {
		return !this.length;
	};

	/**
	 * Conver the list to a string.
	 * @returns {String}
	 */
	LinkedList.prototype.toString = function() {
		var str;

		this.forEach(function(value) {
			if ( str ) {
				str += ", " + value.toString();
			} else {
				str = value.toString();
			}
		});

		return str;
	};

	return LinkedList;
}());