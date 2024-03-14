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



router.get('/about', (req, res) => {
    res.render('about');
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
