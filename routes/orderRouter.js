const express=require('express');
const router=express.Router();
const Order=require('../models/orderModel');
const errorHandeler=require('../middlwares/notFoundError');

router.post('/',errorHandeler(async(req,res)=>{
    let order=new Order({
        orderNumber:req.body.orderNumber,
        status:req.body.status,
        shipmentInfo:req.body.shipmentInfo,
        discount:req.body.discount,
        totalCost:req.body.totalCost
    })
    let newOrder=await order.save();
    res.send(newOrder);
}));
router.get('/',errorHandeler(async(req,res)=>{
    let order=await Order.find();
    res.send(order)
}));
router.put('/:id',errorHandeler(async(req,res)=>{
    let Updatedorder=await Order.findById(req.params.id);
    
    Updatedorder.status=req.body.status
    Updatedorder.shipmentInfo=req.body.shipmentInfo
    Updatedorder.discount=req.body.discount
    Updatedorder.totalCost=req.body.totalCost


    let Updated=await Updatedorder.save();

    res.send(Updated);

}));
router.delete('/:id',errorHandeler(async(req,res)=>{
    let deletedorder=await Order.findByIdAndRemove(req.params.id);
    res.send(deletedorder);
}));
module.exports=router;