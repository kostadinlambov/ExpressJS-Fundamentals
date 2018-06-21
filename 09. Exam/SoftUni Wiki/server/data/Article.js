const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const editsSchema = mongoose.model('Edit').schema

const articleSchema = new mongoose.Schema({
title: {type: String, required: [true, "Title is required"]},
lockedStatus: {type: Boolean, default: false},
// creationDate: {type: Date, default: Date.now},
// edits: [{ type: ObjectId, ref: 'Edit',  required: [true, "Edit is required"] }]
edits: [editsSchema]
// comments:[commentSchema]
}, { usePushEach: true })

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;