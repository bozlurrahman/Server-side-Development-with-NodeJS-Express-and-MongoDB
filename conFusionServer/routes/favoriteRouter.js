const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({"user": req.user._id})
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({"user": req.user._id})
            .then((favorite) => {
                if (favorite != null) {
                    for (const id of req.body) {
                        if (favorite.dishes.indexOf(id._id) === -1) {
                            favorite.dishes.push(id._id);
                        }
                    }
                    favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                    })
                    .catch((err) => next(err));
                }
                else {
                    for (i = 0; i < req.body.length; i++ )
                        if (favorite.dishes.indexOf(req.body[i]._id) < 0)                                  
                            favorite.dishes.push(req.body[i]);
                    favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                    })
                    .catch((err) => {
                        return next(err);
                    });
                }
            })
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({"user": req.user._id}).remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .then((err) => next(err))
    });


favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req,res,next) => {
        Favorites.findOne({user: req.user._id})
        .then((favorites) => {
            if (!favorites) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({"exists": false, "favorites": favorites});
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({"exists": true, "favorites": favorites});
                }
            }

        }, (err) => next(err))
        .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({"user": req.user._id})
        .then((favorite) => {
            if (favorite) {
                if (favorite.dishes.indexOf(req.params.dishId) === -1) {
                    favorite.dishes.push(req.params.dishId);
                    favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                    })
                    .catch((err) => next(err));
                }
                else {
                    err = new Error(`Dish ${req.params.dishId} already in favorites.`)
                    err.status = 404;
                    return next(err);
                }
            }
            else {
                Favorites.create({
                    user: req.user._id,
                    dishes: [req.params.dishId]
                })
                .then((favorite) => {
                    Favorites.findById(favorite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    })
                })
                .catch((err) => next(err));
            }
        })
        .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites/${req.params.dishId}`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({"user": req.user._id})
        .then((favorite) => {
            if (favorite.dishes.indexOf(req.params.dishId) === -1) {
                err = new Error(`Dish ${req.params.dishId} not in favorite.`)
                err.status = 404;
                return next(err);
            }
            else {
                favorite.dishes = favorite.dishes.filter(id => id != req.params.dishId)
                favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                    })
                    .catch((err) => next(err));
            }
        })
        .catch((err) => next(err));
    });


module.exports = favoriteRouter;