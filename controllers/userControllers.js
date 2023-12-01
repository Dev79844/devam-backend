const User = require('../models/userSchema')
const bcrypt = require('bcryptjs')
const cookieToken = require('../utils/cookieToken')

exports.signup = async(req,res) => {
    try {
        const {username,password} = req.body

        if(!username || !password){
            res.send("Enter username and password")
        }

        const hashedPass = await bcrypt.hash(password, 10)

        const user = await User.create({
            username,
            password: hashedPass
        })

        res.status(200).json(user)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

exports.login = async(req,res) => {
    try {
        const {username,password} = req.body
        if(!username || !password){
            res.send("Enter username and password")
        }

        const user = await User.findOne({username})

        if(!user) res.send("User does not exist!")

        cookieToken(user,res)

    } catch (error) {
        return res.status(500).json(error.message)
    }
}

exports.logout = async(req,res) => {
    try {
        res.cookie('jwt',null).status(200).send("User logout")
    } catch (error) {
        return res.status(500).json(error.message)
    }
}