const loginController = require("../controller/login.js");
const signupController = require("../controller/signup.js");
const extractingController = require("../controller/extracting.js");
const tweetController = require("../controller/tweets.js");
const commentController = require("../controller/comments.js");

const express = require("express");
const app = express();
// const multer = require('multer');
// const fs = require('fs');

// const upload = multer({dest: "uploads/",
//     limits: {
//       fieldSize: 50 * 1024 * 1024 // 10MB
//     }
//   });

app.post("/admin/login", loginController.adminLogin);
app.post("/user/login", loginController.userLogin);

// app.post('/user/signup',upload.array('image'), signupController.userSignup);
app.post("/user/signup", signupController.userSignup);
app.post("/user/edit/:id", signupController.editUser);
app.post("/user/check", signupController.checkUser);
app.post('/user/background/:id', signupController.updateBackground);

app.get("/admin/allusers", extractingController.getAllUsers);
app.get("/auser/:id", extractingController.getAUser);
app.post("/user", extractingController.getUserByName);
app.get("/tweets/all", extractingController.getTweets);
app.get("/tweet/:id", extractingController.getATweet);

app.post("/tweet/post", tweetController.tweetPost);
app.post("/tweet/edit/:id", tweetController.editTweet);
// app.put("/tweet/:id", tweetController.updatelike);
app.get("/user/tweets/:id", tweetController.getUserTweets);
app.post("/getTweet", tweetController.getTweetByCategory);
app.post('/like/:id', tweetController.storeLike);

app.post("/postcomment", commentController.postComment);
app.post("/editcomment/:id", commentController.editComment);
app.get("/comments/:id", commentController.getComments);
app.get('/comment/del/:id', commentController.deleteComment);


module.exports = app;
