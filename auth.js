const express=require('express');
const bcrypt=require('bcrypt');
const fs=require('fs-extra');

const router=express.Router();

const file='users.json';

router.post('/signup',async(req,res)=>{

  try {
    const {name,email,password}=req.body;

    if (!name || !email || !password) {
      return res.send("Name, email and password are all required");
    }

    let users=[];

    if(await fs.pathExists(file))
      users=await fs.readJson(file);

    const exists=users.find(x=>x.email.toLowerCase()===email.toLowerCase());

    if(exists)
      return res.send("User already exists");

    const hash=await bcrypt.hash(password,10);

    users.push({
      name,
      email,
      password:hash
    });

    await fs.writeJson(file,users);

    res.redirect('/login');

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).send("Something went wrong during signup. Please try again.");
  }

});

router.post('/login',async(req,res)=>{

  try {
    const {email,password}=req.body;

    if (!email || !password) {
      return res.send("Email and password are required");
    }

    let users=[];

    if(await fs.pathExists(file))
      users=await fs.readJson(file);

    const user=users.find(x=>x.email.toLowerCase()===email.toLowerCase());

    if(!user)
      return res.send("User not found");

    const valid=await bcrypt.compare(password,user.password);

    if(!valid)
      return res.send("Invalid Password");

    // Only store what's needed in the session - never store the password hash.
    req.session.user = {
      name: user.name,
      email: user.email
    };

    res.redirect('/dashboard');

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send("Something went wrong during login. Please try again.");
  }

});

module.exports=router;
