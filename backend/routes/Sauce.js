const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/Sauce');
const auth = require('../middlewear/auth');
const multer = require('../middlewear/multer-config');

router.get('/',  sauceCtrl.getAllSauce);
router.post('/',  multer, sauceCtrl.createSauce);
router.get('/:id', sauceCtrl.getOneSauce);
router.put('/:id', sauceCtrl.updateSauce);
router.delete('/:id', sauceCtrl.deleteSauce);

module.exports = router;