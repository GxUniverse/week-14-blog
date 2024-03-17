const express = require('express');
const router =  express.Router();
const Post = require('../models/Post');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const adminLayout = '../views/layouts/admidn';
const jwtSecret = process.env.JWT_Secretpoj

//log in for admin

const authMiddleware = (req, res, next ) => {
  const token = req.cookies.token;

  if(!token) {
    return res.status(401).json( { message: 'Unauthorized'} );
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch(error) {
    res.status(401).json( { message: 'Unauthorized'} );
  }
}


router.get('/admin', async (req, res) => {
 
    try {
        
    const locals = {
        title: Admin,
        description: "this ones a lil difffff"
    }
  
      res.render('admin/index', {
        locals,
        layout: adminLayout
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });

  router.post('/admin', async (req, res) => {
    try{
    const {username, password} = req.body;
    const user = await User.findOne( { username } );

    if (!user) {
      return res.status(401).json( { message: 'Invalidcredentials' } );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      return res.status(401).json( { message: 'invalid token'})
    }
    const token = jwt.sign({userId: user_Id})
    res.cookie('token', token, { httpOnly: true});
    res.redirect('/dashboard');

    } catch (error) {
      console.log(error);
    }
  });


  //admin register
  router.post('/register', async (req, res) => {
    try{
    const {username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password:hashedPassword });
    res.status(201).json({message: 'User Created', user });
    } catch (error) {
      if(error.code === 11000) {
        res.status(409).json({ message: 'User already in use'});
      }
      res.status(500).json({ message: 'Internal server error'})
    }
  }catch (error){ 
      console.log(error);
    }
  });

  router.get('/dashboard', authmiddleware, async (req, res) => {
    res.render('admin/dashboard');

  });



module.exports = router;