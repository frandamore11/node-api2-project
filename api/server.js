// implement your server here
// require your posts router and connect it here
const express = require('express')
const Post = require('./posts/posts-model')
const server = express()
server.use(express.json())

server.put('/api/posts/:id', async (req, res) => {
    try {
        const possiblePost = await Post.findById(req.params.id)
        if (!possiblePost) {
            return res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        } else {
            if(!req.body.title || !req.body.contents) {
                res.status(400).json({
                    message:'Please provide title and contents for the post'
                })
            } else {
                const updatedPost = await Post.update(
                    req.params.id, 
                    req.body)
                res.status(200).json({updatedPost})
            }
        }
    } catch (err) {
        res.status(500).json({
            message:'error updating user',
            err: err.message,
            stack: err.stack
        })
    }
})

server.delete('/api/posts/:id', async (req, res) => {
    try {
        // First get the post
        const post = await Post.findById(req.params.id)
        
        if (!post) {
            return res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        }
        
        // Delete the post (we don't need to store the result since it's just a count)
        await Post.remove(req.params.id)
        
        // Return the post we found earlier
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting the post',
            error: err.message
        })
    }
})

server.post('/api/posts', (req,res) => {
    const post = req.body
    if(!post.title || !post.contents) {
        res.status(400).json({
            message:'Please provide title and contents for the post'
        }) // Removed extra parenthesis
    } else {
        Post.insert(post)
            .then(createdPost => {
                res.status(201).json(createdPost) // Fixed parenthesis placement
            })
            .catch(err => {
                res.status(500).json({
                    message:'error creating post',
                    err:err.message,
                    stack: err.stack
                })
            })
    }
})

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

server.get('/api/posts/:id', (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (!post) {
          return res.status(404).json({
            message: 'The post with the specified ID does not exist'
          })
        }
        res.json(post)
      })
      .catch(err => {
        res.status(500).json({
          message: 'Error getting post',
          err: err.message,
          stack: err.stack
        })
      })
  })

// In server.js file 
server.get('/api/posts/:id/comments', (req, res) => {
    Post.findPostComments(req.params.id)  // This function needs to be added to your model
      .then(comments => {
        if (!comments || comments.length === 0) {
          return res.status(404).json({
            message: 'The post with the specified ID does not exist'
          })
        }
        res.json(comments)
      })
      .catch(err => {
        res.status(500).json({
          message: 'Error getting comments',
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