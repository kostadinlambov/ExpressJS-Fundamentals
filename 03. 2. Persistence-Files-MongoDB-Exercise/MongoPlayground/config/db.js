const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

require('../models/ImageSchema');
require('../models/TagSchema');

//localhost connectionString
const connectionString = 'mongodb://localhost:27017/mongoplayground';

//mLab connectionString
//const connectionString = 'mongodb://root:attfsp201080@ds147190.mlab.com:47190/mongoplayground';

module.exports = mongoose.connect(connectionString)