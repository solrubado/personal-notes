let mongoose = require("mongoose");
let User = require('../models/userModel');
let PersonalNote = require('../models/personalNotesModel');


//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
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
                    res.should.have.status(404);
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
                    res.should.have.status(404);
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
        it('it should not LOGIN a user without email field', (done) => {
            let user = {
                password:"test123"
            }
            chai.request(server)
                .post('/api/login/')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('email').eql('is required');
                    done();
                });
        });

        it('it should not LOGIN a user without password field', (done) => {
            let user = {
                email:"sol@gmail.com"
            }
            chai.request(server)
                .post('/api/login/')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('password').eql('is required');
                    done();
                });
        });

        // it('it should LOGIN an user ', (done) => {
        //     let user = {
        //         password: "test123",
        //         email: "sol@gmail.com"
        //     }
        //     chai.request(server)
        //         .post('/api/login/')
        //         .send(user)
        //         .end((err, res) => {
        //             console.log(res.body)
        //             res.should.have.status(200);
        //             res.body.should.be.a('object');
        //             res.body.user.should.have.property('token');
        //             done();
        //         });
        // });

    });

    /*
* Test the CURRENT user route
*/

    describe('get the current user', () => {
        it('it should not get the current user without email field', (done) => {
            let user = {
                password:"test123"
            }
            chai.request(server)
                .post('/api/login/')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('email').eql('is required');
                    done();
                });
        });

    });


});


