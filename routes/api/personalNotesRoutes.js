'use strict';

const mongoose = require('mongoose'),
    Note = mongoose.model('Note');
const auth = require('../../routes/auth');
const router = require('express').Router();

//GET all the notes made by the user
router.get('/', auth.required,  (req, res) => {
    const {status} = req.query
    const { payload: { id } } = req;

    //check if there is a status to filter in the query and find the notes with that status
    if (status) {
        Note.find({status, userId:id}, function (err, note) {
            if (err)
                res.status(400).send(err);
            res.json(note);
        });
    } else {
        //if there isn't a status show all the notes
        Note.find({userId:id}, function (err, note) {
            if (err)
                res.status(400).send(err);
            res.json(note);
        });
    }
});


router.post('/', auth.required, async (req, res) => {
    const {title, text, status} = req.body
    const { payload: { id } } = req;

    //create a new note with the data that comes in the body
    const new_note = new Note({title, text, status, userId:id});
    try {
        await new_note.save(function (err, note) {
            if (err)
                res.status(400).send(err);
            res.status(200).json(note);
        });
    }catch(error){
        res.send(error)
    }
});


router.get('/:noteId', auth.required, (req, res) => {
    const {noteId} = req.params;
    const { payload: { id } } = req;

    //find a note by the id sent in params
    Note.findById(noteId, function (err, note) {
        if (err)
            res.send(err);
        if(note.userId!==id)
            res.status(401).send("This note doesn't belong to this user")
        res.json(note);
    });
});


router.put('/:noteId', auth.required,  (req, res) => {
    const {noteId} = req.params;
    const { payload: { id } } = req;

    //find the note with that id and the user is the owner and update the values sent in body
    Note.findOneAndUpdate({_id: noteId, userId:id}, req.body, {
        new: true,
        useFindAndModify: false
    }, function (err, note) {
        if (err)
            res.status(400).send(err);
        if(note){
            res.json(note);
        }
    });
});


router.delete('/:noteId', auth.required,  async (req, res) => {
    const {noteId} = req.params

    //delete a note that has the id sent in params and the user is the owner
    try {
        await Note.deleteOne({
            _id: noteId,
            userId:id
        }, function (err) {
            if (err)
                res.status(400).send(err);
            res.json({message: 'Note successfully deleted'});
        });
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;
