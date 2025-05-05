// implement your server here
// require your posts router and connect it here
const express = require('express')
const Post = require('./posts/posts-model')
const server = express()

server.get('/api/posts', (req,res) => {
    Post.find()
    .then(posts => {
        res.json(posts)
    })
    .catch(err => {
        res.status(500).json({
            message:'error getting posts',
            err: err.message, 
            stack: err.stack
        })
    })
})

server.get('/api/posts/:id', (req,res) => {
    Post.findById(req.params.id)
    .then(post => {
        res.json(post)
    })
    .catch(err => {
        res.status(500).json({
            message:'error getting posts',
            err: err.message, 
            stack: err.stack
        })
    })
})

// server.use('*', (req, res) => {
//     res.status(404).json({
//         message:"not found"
//     })
// })

module.exports = server;