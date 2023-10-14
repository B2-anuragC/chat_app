const mongoose = require('mongoose');

const db_connection = async (return_db_intance=false) => {
  try {
    const mongoURI = 'mongodb://0.0.0.0:27017/MyChat';
    mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;

    db.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    db.once('open', () => {
      console.log('Connected to MongoDB database');
    });
    if(return_db_intance === true) return db;
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'DB connection failed.' });
  }
};

module.exports = db_connection;

