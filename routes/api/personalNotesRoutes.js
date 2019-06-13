'use strict';
module.exports = function(app) {
    const personalNotesList = require('../../controllers/personalNotesController');

    // personal notes Routes
    app.route('/api/notes')
        .get(personalNotesList.list_all_notes)
        .post(personalNotesList.create_a_note);


    app.route('/api/notes/:noteId')
        .get(personalNotesList.read_a_note)
        .put(personalNotesList.update_a_note)
        .delete(personalNotesList.delete_a_note);
};

'use strict';

const mongoose = require('mongoose'),
    Note = mongoose.model('Note');
const auth = require('../../routes/auth');
const router = require('express').Router();

router.get('/', auth.required,  (req, res) => {
    const {status} = req.query
    //check if there is a status to filter in the query and find the notes with that status
    if (status) {
        Note.find({status}, function (err, note) {
            if (err)
                res.send(err);
            res.json(note);
        });
    } else {
        //if there isn't a status show all the notes
        Note.find({}, function (err, note) {
            if (err)
                res.send(err);
            res.json(note);
        });
    }
});


router.post('/', auth.required, async (req, res) => {
    const {body} = req
    //create a new note with the data that comes in the body

    const new_note = new Note(body);
    try {
        await new_note.save(function (err, note) {
            if (err)
                res.send(err);
            res.json(note);
        });
    }catch(error){
        res.send(error)
    }
});


router.post('/', auth.required, (req, res) => {
    const {noteId} = req.params;

    //find a note by the id sent in params
    Note.findById(noteId, function (err, note) {
        if (err)
            res.send(err);
        res.json(note);
    });
});


router.post('/:id', auth.required,  (req, res) => {
    const {noteId} = req.params;

    //find the note with that id and update the values sent in body
    Note.findOneAndUpdate({_id: noteId}, req.body, {
        new: true,
        useFindAndModify: false
    }, function (err, note) {
        if (err)
            res.send(err);
        res.json(note);
    });
});


router.delete('/:id', auth.required,  async (req, res) => {
    const {noteId} = req.params

    //delete a note that has the id sent in params
    try {
        await Note.deleteOne({
            _id: noteId
        }, function (err) {
            if (err)
                res.send(err);
            res.json({message: 'Note successfully deleted'});
        });
    } catch (error) {
        res.send(error);
    }
});

module.exports = router;
