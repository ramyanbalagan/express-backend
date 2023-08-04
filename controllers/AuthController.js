const mongoose = require('mongoose')
const User = require('../models/LoginModel')
const { generateToken } = require('../middlewares/JWT')

exports.post_user = async (req, res) => {
    try {
        const userData = {
            email: req.body.email,
            password:  req.body.password
        }

        const user = await User.findOne({ email: userData.email });
        if(!user) {
            const newUser = new User({
                email: userData.email,
                password: userData.password
            })
            await newUser.save();
            const token = generateToken(newUser);
            return res.status(200).json({
                status: 'success',
                token: token
            })
        }

        if (userData.email === user.email && userData.password === user.password){
            const token = generateToken(user);
            return res.status(200).json({
                status: 'success',
                token: token,
            }) 
        } else {
            return res.status(404).json({
                status: 'failed',
                error: 'Invalid credential'
            })
        }

    } catch (error) {
        return res.status(404).json({
            status: 'failed',
            errors: error.message
        })
    }
} 

exports.get_user = async (req, res) => {
    try {
        const { _id } = req.params;
        let validId = mongoose.isObjectIdOrHexString(_id);
        if(!validId){
            return res.status(400).json({
                status:'failed',
                errors:'Invalid ID'
            })
        }
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).json({
                status: 'failed',
                errors: 'User not found'
            })
        }
        res.status(200).json({
            status: 'success',
            results: user
        })
    } catch (error) {
        return res.status(400).json({
            status: 'failed',
            errors: error.message
        })
    }
}
