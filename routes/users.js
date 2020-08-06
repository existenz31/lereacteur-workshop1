const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-mongoose');
const { users, movies, usersMoviesRentals } = require('../models');
const mongoose = require('mongoose');
const P = require('bluebird');
const Liana = require('forest-express-mongoose');
const cloudinary = require('cloudinary').v2;

const collectionName = 'users'
const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(`${collectionName}`);
const recordsGetter = new RecordsGetter(users);

// This file contains the logic of every route in Forest Admin for the collection :
// - Native routes are already generated but can be extended/overriden - Learn how to extend a route here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/extend-a-route
// - Smart action routes will need to be added as you create new Smart Actions - Learn how to create a Smart Action here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/actions/create-and-manage-smart-actions

// Create a Record
router.post(`/${collectionName}`, permissionMiddlewareCreator.create(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#create-a-record
  next();
});

// Update a Record
router.put(`/${collectionName}/:recordId`, permissionMiddlewareCreator.update(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#update-a-record
  next();
});

// Delete a Record
router.delete(`/${collectionName}/:recordId`, permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-record
  next();
});

// Get a list of Records
router.get(`/${collectionName}`, permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-list-of-records
  next();
});

// Get a number of Records
router.get(`/${collectionName}/count`, permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-number-of-records
  next();
});

// Get a Record
router.get(`/${collectionName}/:recordId`, permissionMiddlewareCreator.details(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-record
  next();
});

// Export a list of Records
router.get(`/${collectionName}.csv`, permissionMiddlewareCreator.export(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#export-a-list-of-records
  next();
});

// Delete a list of Records
router.delete(`/${collectionName}`, permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-list-of-records
  next();
});

/*************************************************************************************************
 * Implementation of the Smart Action accept user
 *************************************************************************************************/

router.post('/actions/accept-user', permissionMiddlewareCreator.smartAction(), (req, res) => {
  return recordsGetter.getIdsFromRequest(req)
    .then((userIds) => {
      return users
        .update({ _id: userIds }, { $set: { status: 'ACCEPTED' } })
        .then(() => {
          res.send({ success: 'User is now accepted!' });
        });
    });
});

/*************************************************************************************************
 * Implementation of the Smart Action upload file
 *************************************************************************************************/

router.post('/actions/upload-file', permissionMiddlewareCreator.smartAction(), (req, res) => {
  // Get the current user id
  const userId = req.body.data.attributes.ids[0];

  // Get the values of the input fields entered by the user.
  const attrs = req.body.data.attributes.values;
  const idDocument = attrs.file;
  const fileName = attrs.fileName;

  cloudinary.uploader.upload(idDocument)
    .then((result) => {
      files.create({
        entity_id: { _id: userId },
        name: fileName,
        type: result.resource_type,
        url: result.url,
      });
    })
    .then(() => res.send({ success: 'File uploaded' }));
});

/*************************************************************************************************
 * Implementation of the Smart Relationship between Users to Movies Through MoviesRentals
 *************************************************************************************************/
router.get(`/${collectionName}/:recordId/relationships/moviesRentals`, (req, res, next) => {
  let limit = parseInt(req.query.page.size) || 10;
  let offset = (parseInt(req.query.page.number) - 1) * limit;
  let recordId = req.params.recordId;

  let dataQuery = movies.aggregate([
    {
      $lookup: {
        from: "users_movies_rentals",
        localField: "_id",
        foreignField: "movieId",
        as: "moviesRentals"
      }
    },
    {$match:{"moviesRentals.userId": new mongoose.Types.ObjectId(recordId)}},
    {$unwind: "$moviesRentals"},
    {$sort: {"moviesRentals.rental_date": -1}},
    {$limit: limit},
    {$skip: offset},
    {$project: { "moviesRentals": 0 } }
  ]);

  let countQuery = usersMoviesRentals.aggregate([
    {$match:{"userId": new mongoose.Types.ObjectId(recordId)}},
    {
      $group: {
        _id: null,
        "nbRentals":{$sum:1}
      }
  }
]);

  return P
  .all([
    countQuery,
    dataQuery
  ])
  .spread((countResult, records) => {
    var nbRentals = 0;
    if (countResult && countResult.length > 0 ) nbRentals = countResult[0].nbRentals;
    return new Liana.ResourceSerializer(Liana, movies, records, null, {
      count: nbRentals
    }).perform();
  })
  .then((serializedData) => {
    res.send(serializedData);
  })
  .catch((err) => next(err));

});

module.exports = router;
