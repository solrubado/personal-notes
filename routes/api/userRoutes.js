
const mongoose = require('mongoose');
const passport = require('passport');

const router = require('express').Router();
const auth = require('../../routes/auth');
const Users = mongoose.model('Users');

//POST new user route (optional, everyone has access)
router.post('/users', auth.optional, (req, res, next) => {
    const { username, email, password }  = req.body;
    console.log(req.body)

    if(!email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if(!password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    const finalUser = new Users(req.body);

    finalUser.setPassword(password);

    return finalUser.save()
        .then(() => res.json({ user: finalUser.toAuthJSON() }))
        .catch(()=> res.send("Error while creating user"));
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
    const { email, password }  = req.body;
    console.log(email, password)

    if(!email) {
        return res.status(422).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if(!password) {
        return res.status(422).json({
            errors: {
                password: 'is required',
            },
        });
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) {
            return next(err);
        }

        if(passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.json({ user: user.toAuthJSON() });
        }

        return res.status(400).send(info);
    })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/me', auth.required, (req, res, next) => {
    const { payload: { id } } = req;
    return Users.findById(id)
        .then((user) => {
            if(!user) {
                return res.sendStatus(400);
            }

            return res.json({ user: user.toAuthJSON() });
        });
});


module.exports = router;
