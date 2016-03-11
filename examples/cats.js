var hal = require('../src/hal.js');
var resourceWithoutSelf = new hal.Resource({name: "Cats"});
console.log(''+resourceWithoutSelf);