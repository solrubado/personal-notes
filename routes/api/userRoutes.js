const mongoose = require('mongoose');
const passport = require('passport');

const router = require('express').Router();
const auth = require('../../routes/auth');
const Users = mongoose.model('Users');

//POST new user (optional, everyone has access)
router.post('/users', auth.optional, async (req, res, next) => {
    const {password} = req.body;

    //save new user
    const finalUser = new Users(req.body);

    finalUser.setPassword(password);

    try {
        await finalUser.save()
        return res.json({
            user: finalUser.toAuthJSON()
        })
    }
    catch (e) {
        return res.status(400).json(e)
    }
});

//POST login (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
    const {email, password} = req.body;

    //check if the user sent email and password
    if (!email) {
        return res.status(400).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!password) {
        return res.status(400).json({
            errors: {
                password: 'is required',
            },
        });
    }

    //authenticate user
    return passport.authenticate('local', {session: false}, (err, passportUser, info) => {
        if (err) {
            return next(err);
        }

        if (passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.status(200).json({user: user.toAuthJSON()});
        }

        return res.status(400).send(info);
    })(req, res, next);
});

//GET current user (required, only authenticated users have access)
router.get('/me', auth.required, async (req, res, next) => {
    const {payload: {id}} = req;

    //check if there is an user with that id and return it as a json
    try {
        let user = await Users.findById(id)
        return res.json({user: user.toAuthJSON()});
    } catch (e) {
        return res.status(400).send();
    }

});


module.exports = router;
