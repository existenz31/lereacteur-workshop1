module.exports = (mongoose, Mongoose) => {
  const schema = Mongoose.Schema({
    'movieId': { type: Mongoose.Schema.Types.ObjectId, ref: 'movies' },
    'rental_date': Date,
    'rental_expiration_date': Date,
    'userId': { type: Mongoose.Schema.Types.ObjectId, ref: 'users' },
    'viewed': Boolean,
  }, {
    timestamps: true,
  });
  return mongoose.model('usersMoviesRentals', schema, 'users_movies_rentals');
}