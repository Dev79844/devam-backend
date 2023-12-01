const express = require('express')
const {addPhone,getPhones,getSoldPhones,deleteDevice,updateDevice,sellPhone, getPhone, dashboard} = require('../controllers/deviceControllers')
const {auth} = require('../middlewares/authMiddleware')

const router = express.Router()

router.post("/phone",auth,addPhone)
router.get("/phone",getPhones)
router.get("/phone/sold",auth,getSoldPhones)
router.route("/phone/:id").delete(auth,deleteDevice).put(auth,updateDevice).post(auth,sellPhone).get(getPhone)
router.get("/dashboard",auth,dashboard)

module.exports = router