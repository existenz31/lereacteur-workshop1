const { collection } = require('forest-express-mongoose');
const {usersMoviesRentals, usersMoviesReviews} = require('../models');
const mongoose = require('mongoose');

// This file allows you to add to your Forest UI:
// - Smart actions: https://docs.forestadmin.com/documentation/reference-guide/actions/create-and-manage-smart-actions
// - Smart fields: https://docs.forestadmin.com/documentation/reference-guide/fields/create-and-manage-smart-fields
// - Smart relationships: https://docs.forestadmin.com/documentation/reference-guide/relationships/create-a-smart-relationship
// - Smart segments: https://docs.forestadmin.com/documentation/reference-guide/segments/smart-segments
collection('users', {
  actions: [
    {
      name: 'Approuve User',
    },
    {
      name: 'Reject User',
    },
    {
      name: 'Upload File',
      type: 'single',
      fields: [{
        field: 'fileName',
        type: 'String',
      }, {
        field: 'file',
        widget: 'file picker',
      }],
    },
  ],
/*************************************************************************************************
 * Implementation of the Smart Fields: fullName (First + Last Name) & gradeReviews (Average)
 *************************************************************************************************/
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
    },
  }, {
    field: 'nbRentals',
    type: 'Number',
    get: function (user) {
      return usersMoviesRentals
        .aggregate([
          {$match:{ "userId": new mongoose.Types.ObjectId(user._id)}},
          {
            $group :
              {
                _id : "$userId",
                count: { $sum: 1 }
              }
           }
        ])
        .then((result) => {
          if (result && result.length > 0) { return result[0].count; }
          return 0;
        });
    }
  }, {
    field: 'gradeReviews',
    type: 'Number',
    get: function (user) {
      return usersMoviesReviews
        .aggregate([
          {$match:{ "userId": new mongoose.Types.ObjectId(user._id)}},
          {
            $group :
              {
                _id : "$userId",
                avg: { $avg: "$stars" }
              }
           }
        ])
        .then((result) => {
          if (result && result.length > 0) { 
            return result[0].avg.toFixed(2); 
          }
          return 0;
        });
    }
  }, {
    field: 'moviesRentals',
    type: ['String'],
    reference: 'movies._id'
  }],
  segments: [],
});
