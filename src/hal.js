/* Prototype HTTP REST server for Web Service */
"use strict";

/* Clone object */
function do_clone_obj(obj) {
	return JSON.parse(JSON.stringify(obj));
}

/** Constructor */
function HAL_Link(rel, uri) {
	var self = this;
	
	if(!(self instanceof HAL_Link)) {
		return new HAL_Link(rel, uri);
	}
	
	// 
	if(rel instanceof HAL_Link) {
		uri = rel;
		rel = uri.rel;
	}
	
	// uri is not an object
	if(uri === undefined) {
		throw new TypeError("uri required");
	}
	
	// uri is not an object
	if(typeof uri !== 'object') {
		self.href = ''+uri;
	} else {
	
		// Strings
		['rel', 'href', 'hreflang', 'title'].filter(function(key) {
			return uri.hasOwnProperty(key);
		}).forEach(function(key) {
			self[key] = ''+uri[key];
		});
		
		// Mix-types
		['name'].filter(function(key) {
			return uri.hasOwnProperty(key);
		}).forEach(function(key) {
			self[key] = uri[key];
		});
		
		// Booleans
		['templated'].filter(function(key) {
			return uri.hasOwnProperty(key) && (uri[key] === true);
		}).forEach(function(key) {
			self[key] = uri[key];
		});
	}
	
	if(rel) {
		self.rel = rel;
	}
	
}

/** Get JSON presentation */
HAL_Link.prototype.toJSON = function() {
	var self = this;
	var obj = {};
	Object.keys(self).forEach(function(key) {
		obj[key] = self[key];
	});
	delete obj.rel;
	return obj;
};

/** Constructor */
function HAL_Resource(obj, uri) {
	var self = this;
	
	if(!(self instanceof HAL_Resource)) {
		return new HAL_Resource(obj, uri);
	}
	
	if(obj instanceof HAL_Resource) {
		self._data = do_clone_obj(obj._data);
	} else if(obj instanceof Array) {
		throw new TypeError("Arrays are not supported!");
	} else if(typeof obj === 'object') {
		self._data = do_clone_obj(obj);
	} else {
		console.warn('Warning! HAL.Resource(obj, uri) called with obj of type ' + typeof obj + ' -- using empty object instead.');
		self._data = {};
	}
	
	if(typeof self._data._links !== 'object') {
		self._data._links = {};
	}
	
	if(typeof self._data._embedded !== 'object') {
		self._data._embedded = {};
	}
	
	if(uri !== undefined) {
		self._data._links.self = new HAL_Link("self", uri);
	}
	
	if(self._data._links.self === undefined) {
		throw new TypeError("HAL.Resource must have link relation to self!");
	}
	
	self._helpers = {
		'linkRelExists': Object.prototype.hasOwnProperty.bind(self._data._links),
		'embeddedRelExists': Object.prototype.hasOwnProperty.bind(self._data._embedded)
	};
}

/** Get the value of a property in the resource */
HAL_Resource.prototype.getProperty = function(key) {
	return this._data[key];
};

/** Set the value of a property in the resource */
HAL_Resource.prototype.setProperty = function(key, value) {
	this._data[key] = value;
};

/** Get links */
HAL_Resource.prototype.links = function() {
	var self = this;
	return self._data._links;
};

/** Get plain data */
HAL_Resource.prototype.data = function() {
	var self = this;
	var obj = do_clone_obj(self._data);
	delete obj._links;
	delete obj._embedded;
	return obj;
};

/** Add link
 * @param rel string Relation name
 * @param res array|HAL.Link New link to be added in _links. It will be copied.
 * @returns HAL.Resource Instance of itself to allow chaining methods
 * @todo Some of the functionality could be moved to helper function and shared with .add
 */
HAL_Resource.prototype.link = function(rel, uri) {
	var self = this,
	    links = self._data._links,
	    tmp;
	if(rel instanceof HAL_Link) {
		uri = new HAL_Link(rel, uri);
		rel = uri.rel;
	} else {
		rel = rel ? ''+rel : undefined;
		uri = (uri instanceof Array) ? uri.map(function(u) { return new HAL_Link(rel, u); }) : new HAL_Link(rel, uri);
	}
	if(!rel) {
		throw new TypeError("rel missing");
	}
	if(self._helpers.linkRelExists(rel)) {
		if(uri instanceof Array) {
			if(links[rel] instanceof Array) {
				links[rel].push.apply(links[rel], uri);
			} else {
				tmp = links[rel];
				links[rel] = [tmp].concat(uri);
			}
		} else {
			if(links[rel] instanceof Array) {
				links[rel].push(uri);
			} else {
				tmp = links[rel];
				links[rel] = [tmp, uri];
			}
		}
	} else {
		links[rel] = uri;
	}
	return self;
};

/** Add embedded resource
 * @param rel string Relation name
 * @param res array|HAL.Resource Resource to be added as embedded resource. It will be copied.
 * @returns HAL.Resource Instance of itself to allow chaining methods
 * @todo Some of the functionality could be moved to helper function and shared with .link
 */
HAL_Resource.prototype.embed = function(rel, res) {
	var self = this;
	var embedded = self._data._embedded;
	var tmp;
	rel = (rel ? ''+rel : undefined);
	if(!rel) {
		throw new TypeError("rel missing");
	}
	res = (res instanceof Array) ? res.map(function(u) { return new HAL_Resource(u); }) : new HAL_Resource(res);
	if(self._helpers.embeddedRelExists(rel)) {
		if(res instanceof Array) {
			if(embedded[rel] instanceof Array) {
				embedded[rel].push.apply(embedded[rel], res);
			} else {
				tmp = embedded[rel];
				embedded[rel] = [tmp].concat(res);
			}
		} else {
			if(embedded[rel] instanceof Array) {
				embedded[rel].push(res);
			} else {
				tmp = embedded[rel];
				embedded[rel] = [tmp, res];
			}
		}
	} else {
		embedded[rel] = res;
	}
	return self;
};

/** Get JSON presentation */
HAL_Resource.prototype.toJSON = function() {
	var self = this;
	var obj = do_clone_obj(self._data);
	if(Object.keys(obj._embedded).length === 0) {
		delete obj._embedded;
	}
	return obj;
};

/** Get string presentation */
HAL_Resource.prototype.toString = function() {
	var self = this;
	return JSON.stringify(self, null, 1);
};

/* Parse HAL resource */
HAL_Resource.parse = function(obj) {
	if(typeof obj === 'string') {
		return HAL_Resource.parse(JSON.parse(obj));
	}
	return new HAL_Resource(obj, ((obj && obj._links) ? obj._links.self : undefined) );
};

// Export
module.exports = {
	'Link': HAL_Link,
	'Resource': HAL_Resource
};

/* EOF */
