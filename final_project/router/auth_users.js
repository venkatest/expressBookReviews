const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 

    const pattern = /^[a-zA-Z0-9_]+$/;

    if (pattern.test(username)) {
        console.log("Valid username");
        return true
    } else {
        console.log("Invalid username");
        return false
    }

}

const authenticatedUser = (username, password) => {
    console.log({users})
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  console.log({username})
  console.log({password})
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in " + accessToken);
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const filteredValue = Object.values(books).filter(x=>x.isbn === isbn)
    filteredValue.reviews= {"review1" : req.body.review}
    return res.status(200).json({ message: "review added successfully", "book": filteredValue});
});



regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const filteredValue = Object.values(books).filter(x=>x.isbn === isbn)
  filteredValue.reviews= {}
  return res.status(200).json({ message: "review removed successfully", "book": filteredValue});
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
