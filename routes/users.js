const express = require('express');
const { PermissionMiddlewareCreator } = require('forest-express-mongoose');
const { users, movies, usersMoviesRentals } = require('../models');
const mongoose = require('mongoose');
const P = require('bluebird');
const Liana = require('forest-express-mongoose');

const collectionName = 'users'
const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator(`${collectionName}`);

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

router.get(`/${collectionName}/status`, (req, res, next) => {
  let data = [
    "PENDING\\nBIS",
    "APPROUVED",
    "REJECTED"
  ];
  res.send({data});
});


module.exports = router;
