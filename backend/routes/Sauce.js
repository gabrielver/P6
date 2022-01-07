const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/Sauce');
const auth = require('../middlewear/auth');
const multer = require('../middlewear/multer-config');

router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, sauceCtrl.updateSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;