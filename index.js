const express = require('express')
const serverless = require('serverless-http');

const {v4 : uuid} = require('uuid')

const app = express()
app.use(express.json())

const db = new Map()

app.get('/', (req, res) => {
    res.send(Array.from(db.values()))
})

app.get('/:id', (req, res) => {
    res.send(db.get(req.params.id))
})

app.post('/', (req, res) => {
    const id = uuid();
    const task = {
        ...req.body,
        completed: false,
        id,
        url: `${req.protocol}://${req.get('host')}/todos/${id}`
    };
    db.set(id, task)
    res.send(task)
})

app.patch('/:id', (req, res) => {
    const task = {...db.get(req.params.id), ...req.body}
    db.set(req.params.id, task)
    res.send(task)
})

app.delete('/', (req, res) => {
    db.clear()
    res.send(Array.from(db.values()))
})

app.delete('/:id', (req, res) => {
    const task = db.get(req.params.id)
    db.delete(req.params.id)
    res.send(task)
})

module.exports.handler = serverless(app)

