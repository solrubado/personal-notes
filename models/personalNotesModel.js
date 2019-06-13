'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const NoteSchema = new Schema({
    title: {
        type: String
    },
    text: {
        type: String,
        required: 'Please enter the name of the note'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    userId: {
        type:String
    },
    status: {
        type: [{
            type: String,
            enum: ['ongoing', 'archived']
        }],
        default: ['ongoing']
    }
});

module.exports = mongoose.model('Note', NoteSchema);