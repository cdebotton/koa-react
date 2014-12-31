'use strict';

export default function(headerName) {
  return function *(next) {
    var start = new Date();
    yield next;
    var end = new Date();
    var time = end - start;

    this.set(headerName, `${time}ms`);
  };
};
