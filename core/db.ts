import mongoose from 'mongoose';

mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/story_back', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(()=> console.log("DataBase is started"))

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

export { db, mongoose };
