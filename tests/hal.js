"use strict";

var vows = require('vows');
var assert = require('assert');
var HAL = require('../src/hal.js');
//var HAL = require('hal');

/* */
vows.describe('Testing HAL').addBatch({
	"HAL": {
		topic: HAL,
		'is object': function(hal) { assert.isObject(hal); },
		'.Link is function': function(hal) { assert.isFunction(hal.Link); },
		'.Resource is function': function(hal) { assert.isFunction(hal.Resource); }
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
	}
}).export(module);

/* EOF */