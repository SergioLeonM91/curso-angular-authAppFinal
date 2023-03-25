const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, login, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validateFields');
const { validateJWT } = require('../middlewares/validateJWT');

const router = Router();

// Create
router.post( '/new', [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'email is required').not().isEmpty(),
    check('email', 'email is not a valid email').isEmail(),
    check('password', 'password is required').not().isEmpty(),
    check('password', 'password need to have at least 6 characters').isLength({ min: 6 }),
    validateFields
], createUser);

// Login
router.post( '/', [
    check('email', 'email is required').not().isEmpty(),
    check('email', 'email is not a valid email').isEmail(),
    check('password', 'password is required').not().isEmpty(),
    check('password', 'password need to have at least 6 characters').isLength({ min: 6 }),
    validateFields
], login);

// Validate token
router.get( '/renew', [
    validateJWT
], renewToken);


module.exports = router;