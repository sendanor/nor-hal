node-nor-hal
============

The library is an implementation of [http://stateless.co/hal_specification.html](Hypertext Application Language) for Node.js and JavaScript.

It has almost the same API as [https://npmjs.org/package/hal](naholyr/js-hal) and should be possible to drop in replace with it.

However this module differs from [https://npmjs.org/package/hal](naholyr/js-hal) in some features:

 * hal.Link and hal.Resource can be cloned by `var cloned_obj = new hal.Resource(obj);`
 * Our license is clearly declared as open source (MIT)
