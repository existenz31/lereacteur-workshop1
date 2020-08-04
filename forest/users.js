const { collection } = require('forest-express-mongoose');

// This file allows you to add to your Forest UI:
// - Smart actions: https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions
// - Smart fields: https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields
// - Smart relationships: https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship
// - Smart segments: https://docs.forestadmin.com/documentation/reference-guide/segments/smart-segments
collection('users', {
  actions: [],
  fields: [{
    field: 'fullName',
    type: 'String',
    get: (user) => {
      return user.firstName + ' ' + user.lastName;
    },
    set: (user, fullName) => {
      let names = fullName.split(' ');
      user.firstName = names[0];
      user.lastName = names[1];

      return user;
    }
  }],
  segments: [],
});
