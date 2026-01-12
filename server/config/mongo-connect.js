const mongoose = require('mongoose');
const debug = require('debug')('development:MongoConnect');
const config = require('config');

mongoose
.connect(config.get("dbURI"))
.then(() => {
    debug('Connected to MongoDB');
}).catch((err) => {
    debug('Error connecting to MongoDB', err);
});

module.exports = mongoose.connection;