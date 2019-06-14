let mongoose = require("mongoose");
let User = require('../models/userModel');
let PersonalNote = require('../models/personalNotesModel');
let Note = mongoose.model('Note');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);


/*
*
* TEST THE USER ROUTES
*
* */


describe('User', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
            done();
        });
    });

    /*
     * Test the POST user route
     */

    describe('create a new user', () => {
        it('it should not POST a user without password field', (done) => {
            let user = {
                username: "solrubado",
                first_name: "Maria Sol",
                last_name: "Rubado",
                email: "sol@gmail.com"
            }
            chai.request(server)
                .post('/api/users/')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('password');
                    res.body.errors.password.should.have.property('kind').eql('required');
                    done();
                });
        });

        it('it should not POST a user without email field', (done) => {
            let user = {
                username: "solrubado",
                first_name: "Maria Sol",
                last_name: "Rubado",
                password: "test123"
            }
            chai.request(server)
                .post('/api/users/')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('email');
                    res.body.errors.email.should.have.property('kind').eql('required');
                    done();
                });
        });

        it('it should POST an user ', (done) => {
            let user = {
                username: "solrubado",
                first_name: "Maria Sol",
                last_name: "Rubado",
                password: "test123",
                email: "sol@gmail.com"
            }
            chai.request(server)
                .post('/api/users/')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.user.should.have.property('username');
                    res.body.user.should.have.property('first_name');
                    res.body.user.should.have.property('last_name');
                    res.body.user.should.have.property('email');
                    res.body.user.should.have.property('token');
                    done();
                });
        });

    });

    /*
  * Test the LOGIN user route
  */

    describe('login a user', () => {

        before(function (done) {
            let user = {
                username: "solrubado",
                first_name: "Maria Sol",
                last_name: "Rubado",
                password: "test123",
                email: "sol@gmail.com"
            }
            chai.request(server)
                .post('/api/users/')
                .send(user)
                .end((err, res) => {
                    done();
                });
        });

        it('it should not LOGIN a user without email field', (done) => {
            let user = {
                password: "test123"
            }
            chai.request(server)
                .post('/api/login/')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('email').eql('is required');
                    done();
                });
        });

        it('it should not LOGIN a user without password field', (done) => {
            let user = {
                email: "sol@gmail.com"
            }
            chai.request(server)
                .post('/api/login/')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('password').eql('is required');
                    done();
                });
        });


        it('it should LOGIN an user ', (done) => {

            let user = {
                password: "test123",
                email: "sol@gmail.com"
            }
            chai.request(server)
                .post('/api/login/')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.user.should.have.property('token');
                    done();
                });
        });

    });

    /*
* Test the CURRENT user route
*/

    describe('get the current user', () => {
        let token = ''

        before(function (done) {
            let user = {
                username: "solrubado",
                first_name: "Maria Sol",
                last_name: "Rubado",
                password: "test123",
                email: "sol@gmail.com"
            }
            chai.request(server)
                .post('/api/users/')
                .send(user)
                .end((err, res) => {
                    token = res.body.user.token;
                    done();
                });
        });

        it('it should not get the current user without authorization header', (done) => {
            chai.request(server)
                .post('/api/me/')
                .end((err, res) => {
                    res.should.have.status(404);
                    done()
                });

        });


    });


});


/*
*
* TEST THE NOTES ROUTES
*
* */

describe('Notes', () => {
    beforeEach((done) => { //Before each test we empty the database
        PersonalNote.remove({}, (err) => {
            done();
        });
    });


    describe('notes routes', () => {
        let token = ''

        before(function (done) {
            let user = {
                username: "solrubado",
                first_name: "Maria Sol",
                last_name: "Rubado",
                password: "test123",
                email: "sol@gmail.com"
            }
            chai.request(server)
                .post('/api/users/')
                .send(user)
                .end((err, res) => {
                    token = res.body.user.token;
                    done();
                });
        });


        it('it should GET all the notes', (done) => {
            chai.request(server)
                .get('/api/notes/')
                .set('Authorization', 'Token ' + token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });

        it('it should not POST a note without text', (done) => {
            let note = {
                title: "Note"
            }

            chai.request(server)
                .post('/api/notes/')
                .set('Authorization', 'Token ' + token)
                .send(note)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('text')
                    done();
                });
        });

        it('it should POST a note ', (done) => {
            let note = {
                title: "note title",
                text: "note text",
            }
            chai.request(server)
                .post('/api/notes/')
                .set('Authorization', 'Token ' + token)
                .send(note)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('text');
                    res.body.should.have.property('status');
                    done();
                });
        });

        it('it should UPDATE a note ', (done) => {

            let noteId = ''

            before(function (done) {
                let note = {
                    title: "note title",
                    text: "note text",
                    status:'ongoing'
                }
                chai.request(server)
                    .post('/api/notes/')
                    .set('Authorization', 'Token ' + token)
                    .send(note)
                    .end((err, res) => {
                        noteId= res.body._id
                        done();
                    });
            })

            chai.request(server)
                .put('/api/notes/' + noteId)
                .set('Authorization', 'Token ' + token)
                .send({title: "Note Title", text: "Text", status: 'archived'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('archived');
                    done();
                });

        });

        it('it should DELETE note', async (done) => {
            let note = new Note({title: "Note Title", text: "Text", status: 'ongoing'})
            try {
                await note.save((err, note) => {
                    chai.request(server)
                        .delete('/api/notes/' + note._id)
                        .set('Authorization', 'Token ' + token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                });
            }
            catch (e) {
                console.log(e)
            }
        });

    });
});


