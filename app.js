//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "This is a collabarative site for developers and coders who often and obviously get stuck at a point during their development journey.This platform can help those who are seeking answers and those who are able to give correct answers."
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-yash:Yash123@cluster0-1lje1.mongodb.net/stackalertDB", {useNewUrlParser: true});

const postSchema = {
  name: String,
  question: String,
  answer: String
};

const questionSchema = {
  person: String,
  question: String
};

const Question = mongoose.model("Question", questionSchema);

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/answer", function(req, res){
  res.render("answer");
});

app.get("/question", function(req, res){
  Question.find({}, function(err, questions){
    res.render("question", {
      questions: questions
    });
  });
});


app.get("/ask", function(req, res){
  res.render("ask");
})

app.get("/resource", function(req, res){
  res.render("resource");
})

app.post("/answer", function(req, res){
  const post = new Post({
    name: req.body.personName,
    question: req.body.questionName,
    answer: req.body.answerName
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});

app.post("/question", function(req, res){
  const question = new Question({
    person: req.body.yourName,
    question: req.body.questionName
  });
  question.save(function(err){
    if(!err){
      res.redirect("/question");
    }
  });
});

app.post("/answerNow", function(req, res){
  const ques = req.body.button;
  res.render("answerNow", {question: ques})
});

app.post("/yourAnswer", function(req, res){
  const post = new Post({
    name: req.body.personName,
    question: req.body.button,
    answer: req.body.answerName
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});


app.post("/post", function(req, res){
  const question = req.body.button;
  res.render("improve", {question: question});
});

app.post("/improve", function(req,res){
  const post = new Post({
    name: req.body.personName,
    question: req.body.button,
    answer: req.body.answerName
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });
});


app.get("/posts/:postId", function(req, res){
  const requestedId = req.params.postId;
  Post.findOne({_id: requestedId}, function(err, post){
    res.render("post", {
      name: post.name,
      title: post.question,
      content: post.answer
    });
  });
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
