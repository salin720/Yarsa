import mongoose from 'mongoose';
const orderSchema=new mongoose.Schema({user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},items:[{product:String,name:String,image:String,size:String,quantity:Number,price:Number}],address:Object,amount:Number,paymentMethod:String,payment:{type:Boolean,default:false},paymentId:String,receiptNo:String,status:{type:String,default:'Order Placed'},date:{type:Date,default:Date.now}},{timestamps:true});
export default mongoose.model('Order',orderSchema);
