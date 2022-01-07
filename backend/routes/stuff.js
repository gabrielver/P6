const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');
const auth = require('../middlewear/auth');
const multer = require('../middlewear/multer-config');

router.get('/', auth, stuffCtrl.getAllSauce);
router.post('/', auth, multer, stuffCtrl.createSauce);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.put('/:id', auth, stuffCtrl.updateSauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce);

module.exports = router;