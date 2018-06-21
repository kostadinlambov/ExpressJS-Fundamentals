const mongoose = require('mongoose');

module.exports = (settings) => {
    mongoose.connect(
        settings.db , err => {
            if (err) {
                console.log(err);
                return;
            }
    
            console.log('MongoDb up and running...')
        })
}