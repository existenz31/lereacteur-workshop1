module.exports = (mongoose, Mongoose) => {
  const schema = Mongoose.Schema({
    'firstName': String,
    'lastName': String,
    'email': String,
    'dob': Date,
    'avatar': String,
    'rentals': { type: [Mongoose.Schema.Types.ObjectId], ref: 'usersMoviesRentals' },
    'reviews': { type: [Mongoose.Schema.Types.ObjectId], ref: 'usersMoviesReviews' },
    'files': { type: [Mongoose.Schema.Types.ObjectId], ref: 'files' },
    'status': {
      type: String,
      enum : ['PENDING','APPROUVED','REJECTED'],
      default: 'PENDING'
    },  
    'stripeId': Number,
  }, {
    timestamps: true,
  });

  return mongoose.model('users', schema, 'users');
}