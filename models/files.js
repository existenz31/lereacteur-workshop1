module.exports = (mongoose, Mongoose) => {
  const schema = Mongoose.Schema({
    'entity_id': { type: Mongoose.Schema.Types.ObjectId, ref: 'users' },
    'name': String,
    'size': Number,
    'type': String,
    'url': String,
  }, {
    timestamps: true,
  });

  return mongoose.model('files', schema, 'files');
};
