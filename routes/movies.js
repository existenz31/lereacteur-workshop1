const express = require('express');
const { PermissionMiddlewareCreator, RecordGetter } = require('forest-express-mongoose');
const { movies } = require('../models');

const collectionName = 'movies'
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

const QueryBuilder = require('forest-express-mongoose/dist/services/query-builder');
const mongoose = require ('mongoose');
const options = {
  mongoose,
  connections: [mongoose],
};

// Get a list of Records
router.get(`/${collectionName}`, permissionMiddlewareCreator.list(), (request, response, next) => {
  const qb = new QueryBuilder(movies, { timezone: 'Europe/Paris' }, options);
  const prevFunction = qb.addSortToQuery;
  qb.addSortToQuery = function (jsonQuery) {
    var order = params.sort.startsWith('-') ? -1 : 1;
    var sortParam = order > 0 ? params.sort : params.sort.substring(1);
    jsonQuery.push({
      $sort: (0, _defineProperty2["default"])({}, sortParam, order)
    });
    return _this;
  };

  if (request.query?.sort?.endsWith('uniqNumber')) {
    request.query.sort = request.query.sort.replace(/([-]?)uniqNumber/, '$1metadata.uniqNumber')
  }
  next();
  // .then(() => {
  //   qb.addSortToQuery = prevFunction
  // });
});

// Get a number of Records
router.get(`/${collectionName}/count`, permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-number-of-records
  next();
});

// Get a Record
router.get(`/${collectionName}/:recordId(?!count)`, permissionMiddlewareCreator.details(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-record
//  next();
  const recordGetter = new RecordGetter(movies);
  recordGetter.get(request.params.recordId)
    .then(record => recordGetter.serialize(record))
    .then(recordSerialized => response.send(recordSerialized))
    .catch(next);
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

module.exports = router;
