const mongoose = require('mongoose')

const phoneSchema = new mongoose.Schema({
    model: String,
    condition: String,
    warranty: String,
    accessories: String,
    imei:{
        type:String,
        default: "N/A"
    },
    serial:{
        type:String,
        unique: false,
        default: "N/A"
    },
    details: {
        type:String,
        default: "N/A"
    },
    store:{
        type:String,
        required:true
    },
    nlc:{
        type:Number,
        required:true
    },
    sale:{
        type:Number,
        default:0
    },
    diff:{
        type:Number,
        default: 0
    },
    modeOfPayment:{
        type:String
    },
    dateOfSale:Date,
    vendor:String,
    images:[
        {
            key:{
                type:String
            },
            url:{
                type:String
            }
        }
    ],
    customerName:{
        type:String,
    },
    customerPhone:{
        type:String,
    },
    customerDocument:[{
        key:{
            type:String,
        },
        url:{
            type:String,
        }
    }],
    isSold: {
        type: Boolean,
        default: false
    },
    remarks:{
        type:String,
        default:"N/A"
    }
}, {timestamps: true})


phoneSchema.post('findByIdAndUpdate', function(next){
    if(this._update.sale > 0){
        this.diff = Number(this._update.sale-this.nlc)
    }
    next();
})

const Phone = mongoose.model('Phone', phoneSchema)

module.exports = Phone