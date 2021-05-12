module.exports = (mongoose, Mongoose) => {
  const schema = Mongoose.Schema({
    'movieId': { type: Mongoose.Schema.Types.ObjectId, ref: 'movies' },
    'review': String,
    'userId': { type: Mongoose.Schema.Types.ObjectId, ref: 'users' },
    'stars': Number,
    
  }, {
    timestamps: true,
  });
  return mongoose.model('usersMoviesReviews', schema, 'users_movies_reviews');
}