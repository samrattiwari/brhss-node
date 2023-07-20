const express = require('express')
const mongoose = require('mongoose')
app = express() //creating express instance
const Post = require('./model/post')
const upload = require('express-fileupload')

//database url
const dbURL = "mongodb+srv://tiwariswopnil35:swopnil20631219@cluster0.1xqebn7.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("connection to mongodb successful");
        app.listen(4000, () => {
            console.log('listening on 4000');
        })
    })
    .catch((error) => {
        console.log("db connect failed:", error);
    })

app.set('view engine', 'ejs')



app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(upload())
//routes
//app.post() for post request
//app.get() FOR GET REQUEST
//home page
app.get('/', (req, res) => {

    var title = 'BRHSS Home'

    Post.find()
        .then((result) => {
            console.log(result);
            res.render('index', { title, posts: result })
        })
        .catch((error) => {
            console.log(error);
            res
        })
    //   res.render('index',{title,posts})
})
//route to createpost page
app.get('/posts/create', (req, res) => {
    let title = 'BRHSS-create new post'
    res.render('createPost', { title })
})
//route for store new post
app.post('/post', (req, res) => {
    if (req.files) {
        let file = req.files.image
        let fileName = "brhss" + file.name
        let fileURL = '/uploads' + fileName
        let fileuploadPath = './public' + fileURL
        console.log('Image file url:', fileURL),

            file.mv(fileuploadPath, (err) => {
                if (err) {
                    res.end(err.message)
                }
                else {
                    console.log('imageuploaded successfully.');
                    const post = new Post(req.body)
                    post.image = fileURL
                    post.save()
                        .then((result) => {
                            console.log("successfully saved");
                            res.redirect('/')
                        })
                        .catch((error) => {
                            console.log("cannot save post to mongo DB", error.message);
                        })
                }

            })
    }
    const post = new Post(req.body)

})

//route for show single post
app.get('/posts/:id', (req, res) => {
    title = 'Post details'


    let postId = req.params.id

    //retrieve single post from mongoDB
    Post.findById(postId)
        .then((result) => {
            res.render('post-details', { title, post: result })
        })
        .catch((error) => {
            res.end(error.message)
        })

})
//route for deleting post
app.delete('/posts/:id', (req, res) => {
    let postId = req.params.id
    Post.findByIdAndDelete(postId)
        .then((result) => {
            res.json({
                message: "successfully deleted post",
                redirect: "/"
            })
        })

})
//route for edit
app.get('/posts/:id/edit', (req, res) => {
    let postId = req.params.id
    let title = 'Update post.'
    Post.findById(postId)
        .then((result) => {
            res.render('update-post', { title, post: result })
        })
        .catch((error) => {
            res.end(error.message)
        })

})
//route for update post
app.put('/posts/:id', (req, res) => {
    let postId = req.params.id
    let post = req.body
    Post.findByIdAndUpdate(postId, post)
        .then((result) => {
            res.json({
                message: "successfully saved..",
                redirect: '/posts/' + postId
            })
        })
        .catch((error) => {
            res.status(500).end(error.message)
        })

})
app.get('/search', (req, res) => {
    let searchQuery = req.query.q
    let title = 'Search Results'
    console.log(req.query.q)

    Post.find({ $text: { $search: searchQuery } })
        .then((result) => {
            res.render('search', { title, posts: result })

        })
        .catch((error) => {
            res.end(error.message)
        })
})

//route to about
app.get('/about', (req, res) => {
    res.end('request for about home page')
    res.render('about')
})
app.use((req, res) => {
    res.end('404 not found..!!!!!!')
})




