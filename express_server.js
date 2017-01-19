const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')


app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

/*app.use(express.session({

}))
*/
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomNumber = () => {
  return Math.floor((Math.random()) * 1e10).toString(32);
}

const users = {}

// GET
app.get("/", (req, res) => {
  let templateVars = { url: urlDatabase, username: req.cookies["username"]};
  res.render('index', templateVars);
});

app.get('/urls', (req,res) => {
  let templateVars = { url: urlDatabase, username: req.cookies["username"]};
  console.log(templateVars);
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, username: req.cookies["username"]};
  if (urlDatabase.hasOwnProperty(req.params.id)){
    templateVars.longURL = urlDatabase[req.params.id];
  } else templateVars.longURL = "Url not in database."
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // let longURL = ...
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.get('/register', (req, res) => {
  let templateVars = { shortURL: req.params.id, username: req.cookies["username"]};
  res.render('register');
})

// POST

// Delete url
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect('/urls')
});

// Create URL
app.post("/urls", (req, res) => {
  let newID = generateRandomNumber()
  console.log(newID + ':' + req.body.longURL);  // debug statement to see POST parameters
  urlDatabase[newID] = req.body.longURL
  console.log(urlDatabase);
  res.redirect('/urls')
});

// Update URL
app.post("/urls/:id/update", (req, res) => {
  console.log(req.body);
  urlDatabase[req.params.id] = req.body.newURL;
  res.redirect('/urls');         // Respond with 'Ok' (we will replace this)
});

// Login
app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  // res.send('Hello', req.body.username)
  res.redirect('/urls');
});

// Register
app.post('/register', (req, res) => {
  res.cookie('username', req.body.email);
  res.cookie('password', req.body.password)
  res.redirect('/urls');
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
