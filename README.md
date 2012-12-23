node-nor-hal
============

The library is an implementation of [Hypertext Application Language](http://stateless.co/hal_specification.html) for Node.js and JavaScript.

It has almost the same API as [naholyr/js-hal](https://npmjs.org/package/hal) and should be possible to drop in replace with it.

However this module differs from [naholyr/js-hal](https://npmjs.org/package/hal) in some features:

 * `hal.Link` and `hal.Resource` can be cloned using constructor: `var cloned_obj = new hal.Resource(obj);`
 * Both `hal.Resource.link(rel, array)` and `hal.Resource.embed(rel, array)` can be called with an array of links or resources
 * Our license is clearly open source (MIT)

License
-------

It's open source, MIT.

Installation
------------

You can install it simply from NPM:

	npm install nor-hal

Usage
-----

```javascript
var hal = require('../src/hal.js');
var resource = new hal.Resource({name: "Orders"}, '/orders')
	.link('orders', '/orders/1')
	.link('orders', '/orders/2')
	.embed('orders', new hal.Resource({name:"Order 1"}, '/orders/1') )
	.embed('orders', new hal.Resource({name:"Order 2"}, '/orders/2') );
console.log(''+resource);
```

Resulting output is:

```javascript
{
 "name": "Orders",
 "_links": {
  "self": {"href": "/orders"},
  "orders": [
   {"href": "/orders/1"},
   {"href": "/orders/2"}
  ]
 },
 "_embedded": {
  "orders": [
   {
    "name": "Order 1",
    "_links": {"self": {"href": "/orders/1"}}
   },
   {
    "name": "Order 2",
    "_links": {"self": {"href": "/orders/2"}}
   }
  ]
 }
}
```

