'use strict';
var Moip = window.Moip || {};
Moip.Forms = (function () {

  var component = {

    initialize: function (input) {
      this.inputs = input;
      var values = this.serialize(this.inputs);
      console.log(values);
      //this.sendData(values);
    },

    ajax: function () {
      return new XMLHttpRequest();
    },

    serialize: function (field) {
      var name = this.splitData(field.name.value, ' ');
      var phone = _.remove(this.splitData(field.cel.value, /\D+/));
      return {
        'email': {
          'address': field.email.value
        },
        'person': {
          'name': name[0],
          'lastName': name[1],
          'taxDocument': {
            'type': 'CPF',
            'number': field.cpf.value
          },
          'birthDate': '1980-01-01',
          'phone': {
            'countryCode': phone[0],
            'areaCode': phone[1],
            'number': phone[2] + phone[3]
          }
        },
        'type': 'MERCHANT'
      };
    },

    sendData: function (data) {
      var request = this.ajax();
      var url = 'http://private-anon-68c2e22ee-testemoip.apiary-mock.com/v2/accounts';

      request.open('POST', url);
      request.setRequestHeader('Content-Type', 'application/json');

      request.onreadystatechange = this.stateRequest;

      request.send(JSON.stringify(data));

    },

    stateRequest: function () {
      if (this.readyState === 4) {
        if (this.status === 201) {
          console.log('Passou!');
        }
      }
    },

    splitData: function (field, expr) {
      return field.split(expr);
    },
  };


  return {
    init: function (fields) {
      component.initialize(fields);
    },

    agreeTerms: function (checkbox) {
      component.validate(checkbox);
    }
  };
}());
