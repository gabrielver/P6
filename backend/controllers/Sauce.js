const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauce = (req, res ,next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }));
};

exports.createSauce = (req, res ,next) => {
    delete req.body._id;
    const sauce = new Sauce({
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};
    Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet mis a jour !'}))
    .catch(error => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message : 'deleted'}))
            .catch(error => res.status(400).json({error: error}));
        });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
   const likeObject = req.body.likes
   const user = req.body.userId
    Sauce.updateOne({ _id: req.params.id }, {likeObject, _id: req.params.id })
    .then(() => res.status(200).json({message : 'avis enregistré !'}))
    .catch(error => res.status(400).json({error: error}));
}