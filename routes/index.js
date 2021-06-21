var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userScheme = new Schema({username: String}, {versionKey: false});
const User = mongoose.model("User", userScheme);

const todoScheme = new Schema({text: String, username: String}, {versionKey: false});
const ToDo = mongoose.model("Comment", todoScheme);

/**
 * @swagger
 * /create?username={username}:
 *   post:
 *     summary: Creates the user
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The users username
 *     responses:
 *       200:
 *         description: Returns users data if created successfully
 */
router.post('/create', (req, res) => {
    //Пошук на співпадіння username
    User.findOne({username: req.query.username}, function (err, docs) {
        if (docs !== null) {
            res.sendStatus(403);
        } else {
            User.create({username: req.query.username}, function (err, doc) {
                res.send({
                    id: doc._id,
                    username: doc.username
                })
            });
        }
    });
});

/**
 * @swagger
 * /login?username={username}:
 *   post:
 *     summary: Log in the user
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The users username
 *     responses:
 *       200:
 *         description: Returns users data if log in successfully
 */
router.post('/login', (req, res) => {
    //Пошук на співпадіння username
    User.findOne({username: req.query.username}, function (err, docs) {
        if (docs === null) {
            res.sendStatus(403);
        } else {
            res.send({
                id: docs._id,
                username: docs.username
            });
        }
    });
});

/**
 * @swagger
 * /todos?username={username}:
 *   get:
 *     summary: Returns all users todos
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The users username
 *     responses:
 *       200:
 *         description: Returns all todos binded to users username
 */
router.get('/todos', (req, res) => {
    ToDo.find({username: req.query.username}, function (err, doc) {
        res.send(doc)
    });
});


/**
 * @swagger
 * /todo?username={username}&text={text}:
 *   post:
 *     summary: Creates a todo
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The users username
 *       - in: path
 *         name: text
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo text
 *     responses:
 *       200:
 *         description: Returns created todo
 */
router.post('/todo', (req, res) => {
    ToDo.create({text: req.query.text, username: req.query.username}, function (err, doc) {
        res.send({
            id: doc._id,
            text: doc.text
        })
    });
});

/**
 * @swagger
 * /todo?todoId={todoId}:
 *   delete:
 *     summary: Deletes a todo
 *     parameters:
 *       - in: path
 *         name: todoId
 *         schema:
 *           type: string
 *         required: true
 *         description: The todo id
 *     responses:
 *       200:
 *         description: Returns 200 if deleted
 */
router.delete('/todo', (req, res) => {
    ToDo.deleteOne({_id: req.query.todoId}, function (err, doc) {
        res.send(doc)
    });
});


module.exports = router;
