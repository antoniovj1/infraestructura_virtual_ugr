var bodyParser = require('body-parser');
var Session	   = require('../models/training_session');
var Exercise   = require('../models/exercise');
var Movement   = require('../models/movement');
var User  	   = require('../models/user');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');


module.exports = function(app, express) {

    var apiRouter = express.Router();
    // /training/session/
    // -------------------
    apiRouter.route('/training/session/')

    // ===== POST =======
    .post(function(req, res){
        User.findOne({username: req.decoded.username}, '_id').exec()
        .then(function(user){
            var session = new Session();
            session.time = req.body.time;
            session.user = user._id;
            return session.save();
        })
        .then(function(session){
            return User
            .findOneAndUpdate({username: req.decoded.username},
                {$push: {sessions: session._id}});
            })
            .then(function () {
                res.json({ message: 'ok'});
            })
            .catch(function(err){
                res.send(err);
            });
        })

    // ===== GET =======
    .get(function(req, res) {

        User.findOne({username: req.decoded.username}, '_id').exec()
        .then(function(user){
            return Session.find({user:user._id});
        })
        .then(function(sessions){
            res.json(sessions);
        })
        .catch(function(err){
            res.send(err);
        });
    })

    // /training/session/byId/:id_session
    // -------------------
    apiRouter.route('/training/session/byId/:id_session')
    // ===== GET =======
    .get(function(req, res) {

        Session.findById(req.params.id_session)
        .populate('exercises')
        .exec()
        .then(function(session){
            return  Session.populate(
                session,
                {path: 'exercises.movement', model: 'Movement'},
                function(err,session){
                    if(err) throw err;
                    return session;
                }
            )
        })
        .then(function (session) {
            res.json({ message: 'ok' ,session});
        })
        .catch(function (err) {
            res.send(err);
        });
    })


    // ===== DELETE =======
    .delete(function(req, res) {
        Session.findById(req.params.id_session).exec()
        .then(function(session){
            return session.remove();
        })
        .then(function(session){
            res.json({ message: 'ok' });
        })
        .catch(function(err){
            res.send(err);
        });
    });

    return apiRouter;
};
