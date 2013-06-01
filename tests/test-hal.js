"use strict";

var coverage = require('./coverage.js');

//var HAL = require('hal');
var HAL = coverage.require('hal.js');

var vows = require('vows');
var assert = require('assert');

/* */
vows.describe('Testing HAL').addBatch({
	"HAL": {
		topic: HAL,
		'is object': function(hal) { assert.isObject(hal); },
		'.Link is function': function(hal) { assert.isFunction(hal.Link); },
		'.Resource is function': function(hal) { assert.isFunction(hal.Resource); }
	},
	"HAL.Link('self', '/orders')": {
		topic: HAL.Link('self', '/orders'),
		"is object": function(link) { assert.isObject(link); },
		"is HAL.Link": function(link) { assert.instanceOf(link, HAL.Link); },
		".rel equals 'self'": function(link) { assert.equal(link.rel, 'self'); },
		".href equals /orders": function(link) { assert.equal(link.href, '/orders'); },
		".name is undefined": function(link) { assert.isUndefined(link.name); }
	},
	"new HAL.Link('self') throws TypeError": function() {
		assert.throws(function () {
			return new HAL.Link('self');
		}, TypeError);
	},
	"new HAL.Link('self', '/orders')": {
		topic: new HAL.Link('self', '/orders'),
		"is object": function(link) { assert.isObject(link); },
		"is HAL.Link": function(link) { assert.instanceOf(link, HAL.Link); },
		".rel equals 'self'": function(link) { assert.equal(link.rel, 'self'); },
		".href equals /orders": function(link) { assert.equal(link.href, '/orders'); },
		".name is undefined": function(link) { assert.isUndefined(link.name); }
	},
	"new HAL.Link({'self', href: '/orders', title: 'Orders'})": {
		topic: new HAL.Link('self', {href: '/orders', title: 'Orders'}),
		"is object": function(link) { assert.isObject(link); },
		"is HAL.Link": function(link) { assert.instanceOf(link, HAL.Link); },
		".href equals '/orders'": function(link) { assert.equal(link.href, '/orders'); },
		".title equals 'Orders'": function(link) { assert.equal(link.title, 'Orders'); },
		".name is undefined": function(link) { assert.isUndefined(link.name); },
		".rel is 'self'": function(link) { assert.equal(link.rel, 'self'); },
		".hreflang is undefined": function(link) { assert.isUndefined(link.hreflang); },
		".templated is undefined": function(link) { assert.isUndefined(link.templated); }
	},
	"new HAL.Link({'self', href: '/orders{?id}', title: 'Order', templated:true})": {
		topic: new HAL.Link('self', {href: '/orders{?id}', title: 'Order', templated:true}),
		"is object": function(link) { assert.isObject(link); },
		"is HAL.Link": function(link) { assert.instanceOf(link, HAL.Link); },
		".href equals '/orders{?id}'": function(link) { assert.equal(link.href, '/orders{?id}'); },
		".title equals 'Orders'": function(link) { assert.equal(link.title, 'Order'); },
		".name is undefined": function(link) { assert.isUndefined(link.name); },
		".rel is 'self'": function(link) { assert.equal(link.rel, 'self'); },
		".hreflang is undefined": function(link) { assert.isUndefined(link.hreflang); },
		".templated is true": function(link) { assert.isTrue(link.templated); },
		"and new link using original object": {
			topic: function (link) {
				return new HAL.Link(link);
			},
			"is object": function(link) { assert.isObject(link); },
			"is not original": function(link, orig) {
				assert.instanceOf(orig, HAL.Link);
				assert.notEqual(link, orig);
			},
			"is HAL.Link": function(link) { assert.instanceOf(link, HAL.Link); },
			".href equals '/orders{?id}'": function(link) { assert.equal(link.href, '/orders{?id}'); },
			".title equals 'Orders'": function(link) { assert.equal(link.title, 'Order'); },
			".name is undefined": function(link) { assert.isUndefined(link.name); },
			".rel equals 'self'": function(link) { assert.equal(link.rel, 'self'); },
			".hreflang is undefined": function(link) { assert.isUndefined(link.hreflang); },
			".templated is true": function(link) { assert.isTrue(link.templated); }
		}
	},
	"new HAL.Resource({'name':'Item', 'sum':12.34}, '/order/1')": {
		topic: new HAL.Resource({'name':'Item', 'sum':12.34}, '/order/1'),
		"is object": function(res) { assert.isObject(res); },
		"is HAL.Resource": function(res) { assert.instanceOf(res, HAL.Resource); },
		".data()": {
			topic: function(res) { return res.data(); },
			"is object": function(o) { assert.isObject(o); },
			"Object.keys(o).toString() is 'name,sum'": function(o) { assert.strictEqual(Object.keys(o).toString(), 'name,sum'); },
			"JSON.stringify(o)": function(o) { assert.strictEqual(JSON.stringify(o), '{"name":"Item","sum":12.34}'); }
		},
		".links()": {
			topic: function(res) { return res.links(); },
			"is object": function(o) { assert.isObject(o); },
			".self is object": function(o) { assert.isObject(o.self); },
			".self.href is '/order/1'": function(o) { assert.equal(o.self.href, '/order/1'); }
		},
		".toJSON()": {
			topic: function(res) { return res.toJSON(); },
			"is object": function(o) { assert.isObject(o); },
			".name is 'Item'": function(o) { assert.equal(o.name, 'Item'); },
			".sum is 12.34": function(o) { assert.equal(o.sum, 12.34); },
			"._links is object": function(o) { assert.isObject(o._links); },
			"._links.self is object": function(o) { assert.isObject(o._links.self); },
			"._links.self.href is '/order/1'": function(o) { assert.equal(o._links.self.href, '/order/1'); }
		},
		".link() throws TypeError": function(res) {
			assert.throws(function () {
				return res.link();
			}, TypeError);
		},
		".link('', '/orders') throws TypeError": function(res) {
			assert.throws(function () {
				return res.link('', '/orders');
			}, TypeError);
		},
		".link('orders', '/orders')": {
			topic: function(res) { return HAL.Resource(res).link('orders', '/orders'); },
			"is object": function(res) { assert.isObject(res); },
			"is HAL.Resource": function(res) { assert.instanceOf(res, HAL.Resource); },
			".toJSON()": {
				topic: function(res) { return res.toJSON(); },
				"is object": function(o) { assert.isObject(o); },
				".name is 'Item'": function(o) { assert.equal(o.name, 'Item'); },
				".sum is 12.34": function(o) { assert.equal(o.sum, 12.34); },
				"._links is object": function(o) { assert.isObject(o._links); },
				"._links.self is object": function(o) { assert.isObject(o._links.self); },
				"._links.self.href is '/order/1'": function(o) { assert.equal(o._links.self.href, '/order/1'); },
				"._links.orders is object": function(o) { assert.isObject(o._links.orders); },
				"._links.orders.href is '/orders'": function(o) { assert.equal(o._links.orders.href, '/orders'); }
			},
			".link('orders', '/orders2')": {
				topic: function(res) { return HAL.Resource(res).link('orders', '/orders2'); },
				"is object": function(res) { assert.isObject(res); },
				"is HAL.Resource": function(res) { assert.instanceOf(res, HAL.Resource); },
				".toJSON()": {
					topic: function(res) { return res.toJSON(); },
					"is object": function(o) { assert.isObject(o); },
					".name is 'Item'": function(o) { assert.equal(o.name, 'Item'); },
					".sum is 12.34": function(o) { assert.equal(o.sum, 12.34); },
					"._links is object": function(o) { assert.isObject(o._links); },
					"._links.self is object": function(o) { assert.isObject(o._links.self); },
					"._links.self.href is '/order/1'": function(o) { assert.equal(o._links.self.href, '/order/1'); },
					"._links.orders is array": function(o) { assert.isArray(o._links.orders); },
					"._links.orders[0].href is '/orders'": function(o) { assert.equal(o._links.orders[0].href, '/orders'); },
					"._links.orders[1].href is '/orders2'": function(o) { assert.equal(o._links.orders[1].href, '/orders2'); }
				},
				".parse()": {
					topic: function(res) { return HAL.Resource.parse( JSON.stringify(res) ); },
					"is object": function(res) { assert.isObject(res); },
					"is HAL.Resource": function(res) { assert.instanceOf(res, HAL.Resource); },
					".toJSON()": {
						topic: function(res) { return res.toJSON(); },
						"is object": function(o) { assert.isObject(o); },
						".name is 'Item'": function(o) { assert.equal(o.name, 'Item'); },
						".sum is 12.34": function(o) { assert.equal(o.sum, 12.34); },
						"._links is object": function(o) { assert.isObject(o._links); },
						"._links.self is object": function(o) { assert.isObject(o._links.self); },
						"._links.self.href is '/order/1'": function(o) { assert.equal(o._links.self.href, '/order/1'); },
						"._links.orders is array": function(o) { assert.isArray(o._links.orders); },
						"._links.orders[0].href is '/orders'": function(o) { assert.equal(o._links.orders[0].href, '/orders'); },
						"._links.orders[1].href is '/orders2'": function(o) { assert.equal(o._links.orders[1].href, '/orders2'); }
					}
				}
			},
			".link('orders', ['/orders2', '/orders3'])": {
				topic: function(res) { return HAL.Resource(res).link('orders', ['/orders2', '/orders3']); },
				"is object": function(res) { assert.isObject(res); },
				"is HAL.Resource": function(res) { assert.instanceOf(res, HAL.Resource); },
				".toJSON()": {
					topic: function(res) { return res.toJSON(); },
					"is object": function(o) { assert.isObject(o); },
					".name is 'Item'": function(o) { assert.equal(o.name, 'Item'); },
					".sum is 12.34": function(o) { assert.equal(o.sum, 12.34); },
					"._links is object": function(o) { assert.isObject(o._links); },
					"._links.self is object": function(o) { assert.isObject(o._links.self); },
					"._links.self.href is '/order/1'": function(o) { assert.equal(o._links.self.href, '/order/1'); },
					"._links.orders is array": function(o) { assert.isArray(o._links.orders); },
					"._links.orders[0].href is '/orders'": function(o) { assert.equal(o._links.orders[0].href, '/orders'); },
					"._links.orders[1].href is '/orders2'": function(o) { assert.equal(o._links.orders[1].href, '/orders2'); },
					"._links.orders[2].href is '/orders3'": function(o) { assert.equal(o._links.orders[2].href, '/orders3'); }
				},
				".parse()": {
					topic: function(res) { return HAL.Resource.parse( JSON.stringify(res) ); },
					"is object": function(res) { assert.isObject(res); },
					"is HAL.Resource": function(res) { assert.instanceOf(res, HAL.Resource); },
					".toJSON()": {
						topic: function(res) { return res.toJSON(); },
						"is object": function(o) { assert.isObject(o); },
						".name is 'Item'": function(o) { assert.equal(o.name, 'Item'); },
						".sum is 12.34": function(o) { assert.equal(o.sum, 12.34); },
						"._links is object": function(o) { assert.isObject(o._links); },
						"._links.self is object": function(o) { assert.isObject(o._links.self); },
						"._links.self.href is '/order/1'": function(o) { assert.equal(o._links.self.href, '/order/1'); },
						"._links.orders is array": function(o) { assert.isArray(o._links.orders); },
						"._links.orders[0].href is '/orders'": function(o) { assert.equal(o._links.orders[0].href, '/orders'); },
						"._links.orders[1].href is '/orders2'": function(o) { assert.equal(o._links.orders[1].href, '/orders2'); },
						"._links.orders[2].href is '/orders3'": function(o) { assert.equal(o._links.orders[2].href, '/orders3'); }
					}
				},

				/* Test for .link() with link array against link array */
				".link('orders', ['/orders4', '/orders5'])": {
					topic: function(res) { return HAL.Resource(res).link('orders', ['/orders4', '/orders5']); },
					"is object": function(res) { assert.isObject(res); },
					"is HAL.Resource": function(res) { assert.instanceOf(res, HAL.Resource); },
					".toJSON()": {
						topic: function(res) { return res.toJSON(); },
						"is object": function(o) { assert.isObject(o); },
						".name is 'Item'": function(o) { assert.equal(o.name, 'Item'); },
						".sum is 12.34": function(o) { assert.equal(o.sum, 12.34); },
						"._links is object": function(o) { assert.isObject(o._links); },
						"._links.self is object": function(o) { assert.isObject(o._links.self); },
						"._links.self.href is '/order/1'": function(o) { assert.equal(o._links.self.href, '/order/1'); },
						"._links.orders is array": function(o) { assert.isArray(o._links.orders); },
						"._links.orders[0].href is '/orders'": function(o) { assert.equal(o._links.orders[0].href, '/orders'); },
						"._links.orders[1].href is '/orders2'": function(o) { assert.equal(o._links.orders[1].href, '/orders2'); },
						"._links.orders[2].href is '/orders3'": function(o) { assert.equal(o._links.orders[2].href, '/orders3'); },
						"._links.orders[3].href is '/orders4'": function(o) { assert.equal(o._links.orders[3].href, '/orders4'); },
						"._links.orders[4].href is '/orders5'": function(o) { assert.equal(o._links.orders[4].href, '/orders5'); }
					},
					".parse()": {
						topic: function(res) { return HAL.Resource.parse( JSON.stringify(res) ); },
						"is object": function(res) { assert.isObject(res); },
						"is HAL.Resource": function(res) { assert.instanceOf(res, HAL.Resource); },
						".toJSON()": {
							topic: function(res) { return res.toJSON(); },
							"is object": function(o) { assert.isObject(o); },
							".name is 'Item'": function(o) { assert.equal(o.name, 'Item'); },
							".sum is 12.34": function(o) { assert.equal(o.sum, 12.34); },
							"._links is object": function(o) { assert.isObject(o._links); },
							"._links.self is object": function(o) { assert.isObject(o._links.self); },
							"._links.self.href is '/order/1'": function(o) { assert.equal(o._links.self.href, '/order/1'); },
							"._links.orders is array": function(o) { assert.isArray(o._links.orders); },
							"._links.orders[0].href is '/orders'": function(o) { assert.equal(o._links.orders[0].href, '/orders'); },
							"._links.orders[1].href is '/orders2'": function(o) { assert.equal(o._links.orders[1].href, '/orders2'); },
							"._links.orders[2].href is '/orders3'": function(o) { assert.equal(o._links.orders[2].href, '/orders3'); },
							"._links.orders[3].href is '/orders4'": function(o) { assert.equal(o._links.orders[3].href, '/orders4'); },
							"._links.orders[4].href is '/orders5'": function(o) { assert.equal(o._links.orders[4].href, '/orders5'); }
						}
					}
				},

				/* Test for .link() when _links is an array but new uri is not */
				".link('orders', '/orders4')": {
					topic: function(res) { return HAL.Resource(res).link('orders', '/orders4'); },
					"is object": function(res) { assert.isObject(res); },
					"is HAL.Resource": function(res) { assert.instanceOf(res, HAL.Resource); },
					".toJSON()": {
						topic: function(res) { return res.toJSON(); },
						"is object": function(o) { assert.isObject(o); },
						".name is 'Item'": function(o) { assert.equal(o.name, 'Item'); },
						".sum is 12.34": function(o) { assert.equal(o.sum, 12.34); },
						"._links is object": function(o) { assert.isObject(o._links); },
						"._links.self is object": function(o) { assert.isObject(o._links.self); },
						"._links.self.href is '/order/1'": function(o) { assert.equal(o._links.self.href, '/order/1'); },
						"._links.orders is array": function(o) { assert.isArray(o._links.orders); },
						"._links.orders[0].href is '/orders'": function(o) { assert.equal(o._links.orders[0].href, '/orders'); },
						"._links.orders[1].href is '/orders2'": function(o) { assert.equal(o._links.orders[1].href, '/orders2'); },
						"._links.orders[2].href is '/orders3'": function(o) { assert.equal(o._links.orders[2].href, '/orders3'); },
						"._links.orders[3].href is '/orders4'": function(o) { assert.equal(o._links.orders[3].href, '/orders4'); }
					},
					".parse()": {
						topic: function(res) { return HAL.Resource.parse( JSON.stringify(res) ); },
						"is object": function(res) { assert.isObject(res); },
						"is HAL.Resource": function(res) { assert.instanceOf(res, HAL.Resource); },
						".toJSON()": {
							topic: function(res) { return res.toJSON(); },
							"is object": function(o) { assert.isObject(o); },
							".name is 'Item'": function(o) { assert.equal(o.name, 'Item'); },
							".sum is 12.34": function(o) { assert.equal(o.sum, 12.34); },
							"._links is object": function(o) { assert.isObject(o._links); },
							"._links.self is object": function(o) { assert.isObject(o._links.self); },
							"._links.self.href is '/order/1'": function(o) { assert.equal(o._links.self.href, '/order/1'); },
							"._links.orders is array": function(o) { assert.isArray(o._links.orders); },
							"._links.orders[0].href is '/orders'": function(o) { assert.equal(o._links.orders[0].href, '/orders'); },
							"._links.orders[1].href is '/orders2'": function(o) { assert.equal(o._links.orders[1].href, '/orders2'); },
							"._links.orders[2].href is '/orders3'": function(o) { assert.equal(o._links.orders[2].href, '/orders3'); },
							"._links.orders[3].href is '/orders4'": function(o) { assert.equal(o._links.orders[3].href, '/orders4'); }
						}
					}
				}

			}
		}
	},
	"new HAL.Resource({'name':'Orders'}, '/orders')": {
		topic: function() {
			return new HAL.Resource({'name':'Orders'}, '/orders')
				.embed("orders", HAL.Resource({'name':'Item 1', 'sum':12.34, 'amount':2}, '/order/1'))
				.embed("orders", HAL.Resource({'name':'Item 2', 'sum':43.21, 'amount':1}, '/order/2'));
		},
		"is object": function(res) { assert.isObject(res); },
		"is HAL.Resource": function(res) { assert.instanceOf(res, HAL.Resource); },
		".embed() throws TypeError": function(res) {
			assert.throws(function () {
				return res.embed();
			}, TypeError);
		},
		".embed('', '/orders') throws TypeError": function(res) {
			assert.throws(function () {
				return res.embed('', '/orders/3');
			}, TypeError);
		},
		".toJSON()": {
			topic: function(res) { return res.toJSON(); },
			"is object": function(o) { assert.isObject(o); },
			".name is 'Orders'": function(o) { assert.equal(o.name, 'Orders'); },
			"._links is object": function(o) { assert.isObject(o._links); },
			"._links keys length": function(o) { assert.lengthOf(Object.keys(o._links), 1); },
			"._links.self is object": function(o) { assert.isObject(o._links.self); },
			"._links.self.href is '/orders'": function(o) { assert.equal(o._links.self.href, '/orders'); },
			"._embedded is object": function(o) { assert.isObject(o._embedded); },
			"._embedded keys length": function(o) { assert.lengthOf(Object.keys(o._embedded), 1); },
			"._embedded.orders keys length": function(o) { assert.lengthOf(o._embedded.orders, 2); },
			"._embedded.orders[0].toJSON()": function(o) {
				assert.equal(JSON.stringify(o._embedded.orders[0]), 
					'{"name":"Item 1","sum":12.34,"amount":2,"_links":{"self":{"href":"/order/1"}}}');
			},
			"._embedded.orders[1].toJSON()": function(o) {
				assert.equal(JSON.stringify(o._embedded.orders[1]), 
					'{"name":"Item 2","sum":43.21,"amount":1,"_links":{"self":{"href":"/order/2"}}}');
			}
		}
	},
	"new HAL.Resource({'name':'Orders'}, '/orders') with 4 x .embeds": {
		topic: function() {
			return new HAL.Resource({'name':'Orders'}, '/orders')
				.embed("orders", HAL.Resource({'name':'Item 1', 'sum':12.34, 'amount':2}, '/order/1'))
				.embed("orders", HAL.Resource({'name':'Item 2', 'sum':43.21, 'amount':1}, '/order/2'))
				.embed("orders", [ HAL.Resource({'name':'Item 3', 'sum':10.12, 'amount':10}, '/order/3'),
				                 HAL.Resource({'name':'Item 4', 'sum':999.912, 'amount':3}, '/order/4') ]);
		},
		"is object": function(res) { assert.isObject(res); },
		"is HAL.Resource": function(res) { assert.instanceOf(res, HAL.Resource); },
		".embed() throws TypeError": function(res) {
			assert.throws(function () {
				return res.embed();
			}, TypeError);
		},
		".embed('', '/orders') throws TypeError": function(res) {
			assert.throws(function () {
				return res.embed('', '/orders/3');
			}, TypeError);
		},
		".toJSON()": {
			topic: function(res) { return res.toJSON(); },
			"is object": function(o) { assert.isObject(o); },
			".name is 'Orders'": function(o) { assert.equal(o.name, 'Orders'); },
			"._links is object": function(o) { assert.isObject(o._links); },
			"._links keys length": function(o) { assert.lengthOf(Object.keys(o._links), 1); },
			"._links.self is object": function(o) { assert.isObject(o._links.self); },
			"._links.self.href is '/orders'": function(o) { assert.equal(o._links.self.href, '/orders'); },
			"._embedded is object": function(o) { assert.isObject(o._embedded); },
			"._embedded keys length": function(o) { assert.lengthOf(Object.keys(o._embedded), 1); },
			"._embedded.orders keys length": function(o) { assert.lengthOf(o._embedded.orders, 4); },
			"._embedded.orders[0].toJSON()": function(o) {
				assert.equal(JSON.stringify(o._embedded.orders[0]), 
					'{"name":"Item 1","sum":12.34,"amount":2,"_links":{"self":{"href":"/order/1"}}}');
			},
			"._embedded.orders[1].toJSON()": function(o) {
				assert.equal(JSON.stringify(o._embedded.orders[1]), 
					'{"name":"Item 2","sum":43.21,"amount":1,"_links":{"self":{"href":"/order/2"}}}');
			},
			"._embedded.orders[2].toJSON()": function(o) {
				assert.equal(JSON.stringify(o._embedded.orders[2]), 
					'{"name":"Item 3","sum":10.12,"amount":10,"_links":{"self":{"href":"/order/3"}}}');
			},
			"._embedded.orders[3].toJSON()": function(o) {
				assert.equal(JSON.stringify(o._embedded.orders[3]), 
					'{"name":"Item 4","sum":999.912,"amount":3,"_links":{"self":{"href":"/order/4"}}}');
			}
		}
	},
	"new HAL.Resource({'name':'Orders'}, '/orders') with 3 x .embeds (single vs array)": {
		topic: function() {
			return new HAL.Resource({'name':'Orders'}, '/orders')
				.embed("orders", HAL.Resource({'name':'Item 1', 'sum':12.34, 'amount':2}, '/order/1'))
				.embed("orders", [ HAL.Resource({'name':'Item 3', 'sum':10.12, 'amount':10}, '/order/3'),
				                 HAL.Resource({'name':'Item 4', 'sum':999.912, 'amount':3}, '/order/4') ]);
		},
		"is object": function(res) { assert.isObject(res); },
		"is HAL.Resource": function(res) { assert.instanceOf(res, HAL.Resource); },
		".embed() throws TypeError": function(res) {
			assert.throws(function () {
				return res.embed();
			}, TypeError);
		},
		".embed('', '/orders') throws TypeError": function(res) {
			assert.throws(function () {
				return res.embed('', '/orders/3');
			}, TypeError);
		},
		".toJSON()": {
			topic: function(res) { return res.toJSON(); },
			"is object": function(o) { assert.isObject(o); },
			".name is 'Orders'": function(o) { assert.equal(o.name, 'Orders'); },
			"._links is object": function(o) { assert.isObject(o._links); },
			"._links keys length": function(o) { assert.lengthOf(Object.keys(o._links), 1); },
			"._links.self is object": function(o) { assert.isObject(o._links.self); },
			"._links.self.href is '/orders'": function(o) { assert.equal(o._links.self.href, '/orders'); },
			"._embedded is object": function(o) { assert.isObject(o._embedded); },
			"._embedded keys length": function(o) { assert.lengthOf(Object.keys(o._embedded), 1); },
			"._embedded.orders keys length": function(o) { assert.lengthOf(o._embedded.orders, 3); },
			"._embedded.orders[0].toJSON()": function(o) {
				assert.equal(JSON.stringify(o._embedded.orders[0]), 
					'{"name":"Item 1","sum":12.34,"amount":2,"_links":{"self":{"href":"/order/1"}}}');
			},
			"._embedded.orders[1].toJSON()": function(o) {
				assert.equal(JSON.stringify(o._embedded.orders[1]), 
					'{"name":"Item 3","sum":10.12,"amount":10,"_links":{"self":{"href":"/order/3"}}}');
			},
			"._embedded.orders[2].toJSON()": function(o) {
				assert.equal(JSON.stringify(o._embedded.orders[2]), 
					'{"name":"Item 4","sum":999.912,"amount":3,"_links":{"self":{"href":"/order/4"}}}');
			}
		}
	},
	"new HAL.Resource({'name':'Orders'}, '/orders') with 3 x .embeds (array vs single)": {
		topic: function() {
			return new HAL.Resource({'name':'Orders'}, '/orders')
				.embed("orders", [ HAL.Resource({'name':'Item 3', 'sum':10.12, 'amount':10}, '/order/3'),
				                 HAL.Resource({'name':'Item 4', 'sum':999.912, 'amount':3}, '/order/4') ])
				.embed("orders", HAL.Resource({'name':'Item 1', 'sum':12.34, 'amount':2}, '/order/1'));
		},
		"is object": function(res) { assert.isObject(res); },
		"is HAL.Resource": function(res) { assert.instanceOf(res, HAL.Resource); },
		".embed() throws TypeError": function(res) {
			assert.throws(function () {
				return res.embed();
			}, TypeError);
		},
		".embed('', '/orders') throws TypeError": function(res) {
			assert.throws(function () {
				return res.embed('', '/orders/3');
			}, TypeError);
		},
		".toJSON()": {
			topic: function(res) { return res.toJSON(); },
			"is object": function(o) { assert.isObject(o); },
			".name is 'Orders'": function(o) { assert.equal(o.name, 'Orders'); },
			"._links is object": function(o) { assert.isObject(o._links); },
			"._links keys length": function(o) { assert.lengthOf(Object.keys(o._links), 1); },
			"._links.self is object": function(o) { assert.isObject(o._links.self); },
			"._links.self.href is '/orders'": function(o) { assert.equal(o._links.self.href, '/orders'); },
			"._embedded is object": function(o) { assert.isObject(o._embedded); },
			"._embedded keys length": function(o) { assert.lengthOf(Object.keys(o._embedded), 1); },
			"._embedded.orders keys length": function(o) { assert.lengthOf(o._embedded.orders, 3); },
			"._embedded.orders[0].toJSON()": function(o) {
				assert.equal(JSON.stringify(o._embedded.orders[0]), 
					'{"name":"Item 3","sum":10.12,"amount":10,"_links":{"self":{"href":"/order/3"}}}');
			},
			"._embedded.orders[1].toJSON()": function(o) {
				assert.equal(JSON.stringify(o._embedded.orders[1]), 
					'{"name":"Item 4","sum":999.912,"amount":3,"_links":{"self":{"href":"/order/4"}}}');
			},
			"._embedded.orders[2].toJSON()": function(o) {
				assert.equal(JSON.stringify(o._embedded.orders[2]), 
					'{"name":"Item 1","sum":12.34,"amount":2,"_links":{"self":{"href":"/order/1"}}}');
			}
		}
	},
	"new HAL.Resource(['Hello', 'World'], '/orders') throws TypeError": function() {
		assert.throws(function () {
			return new HAL.Resource(['Hello', 'World'], '/orders');
		}, TypeError);
	},
	"new HAL.Resource({'name':'Something') throws TypeError": function() {
		assert.throws(function () {
			return new HAL.Resource({'name': 'Something'});
		}, TypeError);
	},
	"new HAL.Resource('Hello world', '/orders')": {
		topic: function() {
			return new HAL.Resource('Hello World', '/orders');
		},
		"is object": function(res) { assert.isObject(res); },
		"is HAL.Resource": function(res) { assert.instanceOf(res, HAL.Resource); },
		".toJSON()": {
			topic: function(res) { return res.toJSON(); },
			"is object": function(o) { assert.isObject(o); },
			"Object.keys(o).toString() is '_links'": function(o) { assert.equal(Object.keys(o).toString(), '_links'); },
			"._links is object": function(o) { assert.isObject(o._links); },
			"._links keys length": function(o) { assert.lengthOf(Object.keys(o._links), 1); },
			"._links.self is object": function(o) { assert.isObject(o._links.self); },
			"._links.self.href is '/orders'": function(o) { assert.equal(o._links.self.href, '/orders'); },
			"._embedded is undefined": function(o) { assert.isUndefined(o._embedded); },
		},
		".data()": {
			topic: function(res) { return res.data(); },
			"is object": function(o) { assert.isObject(o); },
			"Object.keys(o).toString() is ''": function(o) { assert.strictEqual(Object.keys(o).toString(), ''); },
		},
		".toString()": {
			topic: function(res) { return res.toString(); },
			"is string": function(o) { assert.isString(o); },
			"string content valid": function(str) {
				assert.strictEqual(str, '{\n'+
					' "_links": {\n'+
					'  "self": {\n'+
					'   "href": "/orders"\n'+
					'  }\n'+
					' }\n'+
					'}');
			}
		}
	}
}).export(module);

/* EOF */
