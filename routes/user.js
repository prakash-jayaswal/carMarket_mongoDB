const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const auth = require('../middleware/auth');

const dotenv = require('dotenv');
dotenv.config();

router.post('/register',UserController.register_user);
    
router.post('/login',UserController.login_user);

router.get("/confirmation/:token",UserController.confirmation);
router.post("/confirmation/:token",UserController.confirmation);

router.get("/profile/:userId",auth,UserController.profile);

router.post("/changepassword", auth, UserController.change_Password);

router.delete('/logout',auth,UserController.logout_user);

//for delete the user via id
router.delete('/:userId',auth,UserController.delete_user);

module.exports = router;