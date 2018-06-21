const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const editSchema = new mongoose.Schema({
author: {type:ObjectId,ref:'User',required:true},
content: {type: String, required: [true, "Content is required"]},
creationDate: {type: Date, default: Date.now},
article: { type: ObjectId, ref: 'Artile',  required: true }
}, { usePushEach: true })

const Edit = mongoose.model('Edit', editSchema);

module.exports = Edit;