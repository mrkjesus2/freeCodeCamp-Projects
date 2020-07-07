'use strict'

const mongoose = require('mongoose')

let issueSchema = new mongoose.Schema({
    'issue_title': {type: String, required: true, unique: true},
    'issue_text': {type: String, required: true},
    'created_by': {type: String, required: true},
    'assigned_to': String,
    'status_text': String,
    'created_on': Date,
    'updated_on': Date,
    'open': Boolean
})

let projectSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    issues: [issueSchema]
})

module.exports = mongoose.model('Project', projectSchema)