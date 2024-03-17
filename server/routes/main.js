const express = require('express');
const router =  express.Router();
const Post = require('../models/Post');

// Get method
router.get('', async (req, res) => {

try{
    const locals = {
        title: "NodeJs Blog",
        description: "Simple blog created"
    }

    let perPage = 10;
    let page = req.query.page || 1;

    //fetch
    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page -perPage)
    .limit(perPage)
    .exec();

    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);


    res.render('index', { 
        locals, 
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null
    });

} catch (error) {

}
 
});



router.get('/blogs', (req, res) => {
    res.render('blogs');
});


router.get('/post/:id', async (req, res) => {
 
try {
    
    let slug = req.params.id;

const data = await Post.findById({_id: slug});

const locals = {
    title: data.title,
    description: "this ones a lil difffff"
}
res.render('index', { locals, data, currentRoute: `/post/${slug}` });
} catch (error){
    console.log(error);
}
});

router.post('/search', async (req, res) => {
 
    try {
        
    const locals = {
        title: data.title,
        description: "this ones a lil difffff"
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
          { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
        ]
      });
  
      res.render("search", {
        data,
        locals,
        currentRoute: '/'
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });
  
  router.get('/about', (req, res) => {
    res.render('about', {
      currentRoute: '/about'
    });
  });
  

module.exports = router;


// function insertPostData () {
//     Post.insertMany([
//         {
//             title: "Building a Blog",
//             body: "This is the body text"
//         },

// ])
// .then(() => {
//    console.log("Data inserted");
// }).catch((err) => {
//    console.log(err);
// });
// }

// insertPostData ();
