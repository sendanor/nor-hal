node-nor-hal
============

The library is an implementation of [http://stateless.co/hal_specification.html](Hypertext Application Language) for Node.js and JavaScript.

It has almost the same API as [https://npmjs.org/package/hal](naholyr/js-hal) and should be possible to drop in replace with it.

However this module differs from [https://npmjs.org/package/hal](naholyr/js-hal) in some features:

 * hal.Link and hal.Resource can be cloned by `var cloned_obj = new hal.Resource(obj);`
 * Our license is clearly declared as open source (MIT)

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

