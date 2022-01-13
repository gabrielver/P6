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
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
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
    const like = req.body.like
    const userId = req.body.userId
    console.log(req.params.id)
    // console.log(req.body.like)
    //console.log(req.body.userId)
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (like === 1) {
                console.log("liked")
                console.log(sauce.usersLiked.indexOf(userId));
                if (sauce.usersLiked.indexOf(userId) === -1) {
                    sauce.usersLiked.push(userId);
                    sauce.likes = sauce.usersLiked.length;
                    console.log(sauce)
                    sauce.save()
                        .then(() => res.status(200).json(sauce))
                        .catch(error => res.status(500).json({error: error}));
                }
            } else if (like === 0) {
                console.log("unliked")
                console.log(sauce.usersLiked.indexOf(userId));
                if (sauce.usersLiked.indexOf(userId) !== -1) {
                    sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId));
                    sauce.likes = sauce.usersLiked.length;
                }
                console.log(sauce.usersDisliked.indexOf(userId));
                if (sauce.usersDisliked.indexOf(userId) !== -1) {
                    sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId));
                    sauce.dislikes = sauce.usersDisliked.length;
                }

                sauce.save()
                    .then(() => res.status(200).json(sauce))
                    .catch(error => res.status(500).json({error: error}));
            } else if (like === -1) {
                console.log("disliked")
                console.log(sauce.usersDisliked.indexOf(userId));
                if (sauce.usersDisliked.indexOf(userId) === -1) {
                    sauce.usersDisliked.push(userId);
                    sauce.dislikes = sauce.usersLiked.length;
                    sauce.save()
                        .then(() => res.status(200).json(sauce))
                        .catch(error => res.status(500).json({error: error}));
                }
            }
        })
        .catch(error => res.status(404).json({error: error}));
}