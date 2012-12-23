var hal = require('../src/hal.js');
var resource = new hal.Resource({name: "Orders"}, '/orders')
	.link('orders', '/orders/1')
	.link('orders', '/orders/2')
	.embed('orders', new hal.Resource({name:"Order 1"}, '/orders/1') )
	.embed('orders', new hal.Resource({name:"Order 2"}, '/orders/2') );
console.log(''+resource);
