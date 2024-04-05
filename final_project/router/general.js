const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }


  async function getbooks(type="", value=""){
    let result = []
    if(type == ""){
        result = books
    }
    else if(type == "author")
    {
        result = Object.values(books).filter(x => x.author === author);
    }
    else if(type == "title")
    {
        result = Object.values(books).filter(x => x.author === author);
    }
    else if(type == "isbn")
    {
        result = Object.values(books).filter(x => x.author === author);
    }
  }

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            console.log(req.body);
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json({ "books": books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn
    const filteredValues = await getbooks("isbn",isbn );
    return res.status(300).json({ "results": filteredValues });
});

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    const author = req.params.author
   
    const filteredValues = await getbooks("author",author );
    return res.status(300).json({ "results": filteredValues });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {

    const title = req.params.title

    const filteredValues = await getbooks("title",title );
    return res.status(300).json({ "results": filteredValues });
});

//  Get book review
public_users.get('/review/:isbn',async  function (req, res) {
    const isbn = req.params.isbn

    const filteredValues = await getbooks("isbn",isbn );
    return res.status(300).json({ "results": filteredValues });
});

module.exports.general = public_users;
