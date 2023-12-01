const Phone = require('../models/deviceSchema');
const { uploadImages } = require('../utils/uploadImages');
const {uploadDocs} = require('../utils/uploadDocs');
const { s3Client } = require('../utils/s3Client');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

exports.addPhone = async(req,res) => {
    try {

        let {model,condition,warranty,accessories,imei,serialNo,details,store,nlc,customerName,customerPhone} = req.body

        let imageAr, docArr
        if(req.files){
            if(req.files.images) imageAr = await uploadImages(res,req.files.images)
            if(req.files.customerDocument) docArr = await uploadDocs(res,req.files.customerDocument)
        }

        await Phone.create({
            model,
            condition,
            warranty,
            accessories,
            imei,
            serial:serialNo,
            details,
            store,
            nlc,
            customerName,
            customerPhone,
            images: imageAr,
            customerDocument: docArr
        })

        res.status(200).send("Added Phone")
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

exports.getPhones = async(req,res) => {
    try {
        const devices = await Phone.find({isSold: false}).sort({createdAt:-1})
        res.status(200).json(devices)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

exports.getSoldPhones = async(req,res) => {
    try {
        const devices = await Phone.find({isSold: true}).sort({createdAt:-1})
        res.status(200).json(devices)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

exports.deleteDevice = async(req,res) => {
    try {
        const id = req.params.id 
        const device = await Phone.findById(id)
        if(device.images){
            try {
                device.images.forEach(async(image) => {
                    let params = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key:image.key
                    }
                    const command = new DeleteObjectCommand(params)
                    await s3Client.send(command)
                    // console.log(data);
                });
            } catch (error) {
                return res.status(500).json(error.message)
            }
        }

        if(device.customerDocument){
            try {
                device.customerDocument.forEach(async(doc) => {
                    let params = {
                        Bucket:process.env.AWS_BUCKET_NAME,
                        Key:doc.key
                    }
                    const command = new DeleteObjectCommand(params)
                    await s3Client.send(command)
                })
            } catch (error) {
                return res.status(500).json(error.message)
            }
        }
        await Phone.findByIdAndDelete(id)

        res.status(200).send("Device deleted")
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

exports.updateDevice = async(req,res) => {
    try {
        const {id} = req.params
        await Phone.findByIdAndUpdate(id,req.body,{
            new:true,
            useFindAndModify:false,
        })

        res.status(200).send("Device updated")
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

exports.sellPhone = async(req,res) => {
    try {
        const {id} = req.params 
        const {vendor,dateOfSale,sale,remarks} = req.body 
        const device = await Phone.findById(id)

        if(!device){
            res.status(400).send("Device not found")
        }

        device.vendor = vendor
        device.dateOfSale = dateOfSale
        device.sale = sale 
        device.remarks = remarks ? (remarks.length > 0 ? remarks : "") : ""
        device.isSold = true
        device.diff = Math.abs(sale - device.nlc)

        await device.save()

        res.status(200).send("Sale recorded")
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

exports.getPhone = async(req,res) => {
    try {
        const {id} = req.params 
        const device = await Phone.findById(id)
        if(!device){
            return res.status(400).send("Device not found")
        }

        res.status(200).json(device)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

exports.dashboard = async(req,res) => {
    try {
        const devices = await Phone.find({}).sort({createdAt: -1})

        let profit = 0, soldPhones = 0, availablePhones=0

        devices.forEach((device) => {
            profit += device.diff
            if(device.isSold){
                soldPhones += 1
            }else{
                availablePhones += 1
            }
        })

        res.status(200).json({
            "top5":devices.slice(0,4),
            "availablePhones": availablePhones,
            "soldPhones": soldPhones,
            "profit": profit
        })
    } catch (error) {
        return res.status(500).json(error.message)
    }
}