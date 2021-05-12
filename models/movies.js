module.exports = (mongoose, Mongoose) => {
  const schema = Mongoose.Schema({
    'actors': [String],
    'countries': [String],
    'director':   { type: Mongoose.Schema.Types.ObjectId, ref: 'directors' },
    'genre': {
      type: String,
      enum : ['Sci-Fi','Comedy','Drama','Action','Romance','Fantasy','Adventure','Horror','War','Western'],
      default: 'Sci-Fi'
    },  
    'imdb': {
      'id': String,
      'rating': Number,
      'votes': Number,
      'misc': [String],
    },
    'metacritic': Number,
    'plot': String,
    'poster': String,
    'rated': String,
    'runtime': Number,
    'title': String,
    'year': Number,
    'tags': [String],

  }, {
    timestamps: true,
  });
  return mongoose.model('movies', schema, 'movies');
}
