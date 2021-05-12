module.exports = (mongoose, Mongoose) => {
    const schema = Mongoose.Schema({
    'name': String,
    'dob': Date,
    'picture': String,
    'nationality': {
      type: String,
      enum : ['American','Canadian','French','Irish','English','Italian','Australian'],
      default: 'American'
    },  
    'address': {
      'street': String,
      'zip': String,
      'city': String
    },
    'movies': { type: [Mongoose.Schema.Types.ObjectId], ref: 'movies' },
    'progress': Number, 
  }, {
    timestamps: true,
  });
  return mongoose.model('directors', schema, 'directors');
};
