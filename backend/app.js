const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const Sauce = require('./models/sauce');


mongoose.connect('mongodb+srv://gabriel:gabriel@cluster0.2fpqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.use(bodyParser.json())

//creation d'un compte
app.post('/api/auth/signup', (req, res, next) => {

 const user = new User({
     ...req.body
 });
 user.save()
  .then(() => res.status(201).json({ message: `création de l'utilisateur !`}))
  .catch(error => res.status(400).json({ error }));
  });

//Verification des informations d'identification
app.post('/api/auth/login', (req, res, next) => {
    delete req.body._id;
    User.findOne({_id: req.params.id})
     .then(() => res.status(201).json({ userId: req.params.id }))
     .catch(error => res.status(400).json({ error }));
     });

//renvois un tableau de toutes les sauces
app.get('/api/sauces', (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(201).json([sauces]))
    .catch(error => res.status(404).json({ error }));
  });
  

module.exports = app;