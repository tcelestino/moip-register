/* jshint newcap: false */

(function () {
  'use strict';

  var form = document.querySelector('.form');
  var celMask = ['+99(99)9999-99999', '+99(99)99999-9999'];
  var cel = document.getElementById('cel');

  VMasker(document.getElementById('cpf')).maskPattern('999.999.999-99');
  VMasker(cel).maskPattern(celMask[0]);

  cel.addEventListener('input',
    Moip.Helpers.maskInput.bind(undefined, celMask, 14),
    false);

  form.addEventListener('submit', function (evt) {
    Moip.Forms.init(this);
    evt.preventDefault();
  }, true);
}());
