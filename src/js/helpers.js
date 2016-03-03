/* jshint newcap: false */
'use strict';
var Moip = window.Moip || {};

Moip.Helpers = (function () {
  return {
    maskInput: function (masks, max, event) {
      var input = event.target;
      var number = input.value.replace(/\D/g, '');
      var limit = input.value.length > max ? 1 : 0;

      VMasker(input).unMask();
      VMasker(input).maskPattern(masks[limit]);

      input.value = VMasker.toPattern(number, masks[limit]);
    }
  };
}());
