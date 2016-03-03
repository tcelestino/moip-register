(function () {
  'use strict';
  var form = document.querySelector('.form');
  form.addEventListener('submit', function (evt) {
    var fields = this.elements;
    Moip.Forms.init(fields);
    evt.preventDefault();
  }, true);
}());
