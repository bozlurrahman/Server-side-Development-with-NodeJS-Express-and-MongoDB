const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        favoriteIndex = favorites.map((favorite) => favorite.user._id.toString() ).indexOf(req.user._id.toString());
        if(favoriteIndex != -1){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites[favoriteIndex]);
        }else{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json([]);
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .then((favorites) => {
        favoriteIndex = favorites.map((favorite) => favorite.user._id.toString() ).indexOf(req.user._id.toString());
        if(favoriteIndex != -1){
            for(var i = (req.body.length - 1); i >= 0; i--){
                if(favorites[favoriteIndex].dishes.indexOf(req.body[i]._id.toString()) === -1){
                    favorites[favoriteIndex].dishes.push(req.body[i]._id);
                }
            }
            favorites[favoriteIndex].save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
        }else{
            Favorites.create({
                user: req.user._id
            })
            .then((favorite) => {
                for(var i = (req.body.length - 1); i >= 0; i--){
                    favorite.dishes.push(req.body[i]._id);
                }
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                });
            });
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .then((favorites) => {
        if(favorites != null){
            favoriteIndex = favorites.map((favorite) => favorite.user._id.toString() ).indexOf(req.user._id.toString());
            if(favoriteIndex != -1){
                Favorites.findByIdAndRemove(favorites[favoriteIndex]._id)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
            }else{
                err = new Error('Favorite not found');
                err.status = 404;
                next(err);
            }
        }else{
            err = new Error('Favorite not found');
            err.status = 404;
            next(err);
        }
    })
})

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .then((favorites) => {
        favoriteIndex = favorites.map((favorite) => favorite.user._id.toString() ).indexOf(req.user._id.toString());
        if(favoriteIndex != -1){
            if(favorites[favoriteIndex].dishes.indexOf(req.params.dishId) === -1){
                favorites[favoriteIndex].dishes.push(req.params.dishId);
            }
            favorites[favoriteIndex].save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        }else{
            Favorites.create({
                user: req.user._id
            })
            .then((favorite) => {
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                });
            });
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .then((favorites) => {
        if(favorites != null){
            favoriteIndex = favorites.map((favorite) => favorite.user._id.toString() ).indexOf(req.user._id.toString());
            if(favoriteIndex != -1){
                favorites[favoriteIndex].dishes.pull({ _id: req.params.dishId});
                favorites[favoriteIndex].save()
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
            }else{
                err = new Error('Favorite not found');
                err.status = 404;
                next(err);
            }
        }else{
            err = new Error('Favorite not found');
            err.status = 404;
            next(err);
        }
    })
})

module.exports = favoriteRouter;