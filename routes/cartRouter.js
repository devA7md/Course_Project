const express=require('express');
const router=express.Router();
const Cart=require('../models/cartModel');
const errorHandeler=require('../middlwares/notFoundError');
router.post('/',errorHandeler(async(req,res)=>{
    let cart=new Cart({
        quantity:req.body.quantity,
        totalCost:req.body.totalCost,
        product:req.body.product
    })
    let newcart=await cart.save();
    res.send(newcart);
}));

router.get('/',errorHandeler( async(req,res)=>{
    let cart=await Cart.find().populate('product');
    res.send(cart);

}));
router.put('/',errorHandeler(async(req,res)=>{
    let updatecart=await Cart.findByIdAndUpdate(req.params.id,req.body);
    res.send(updatecart);
}));
router.delete('/:id',errorHandeler(async(req,res)=>{
    let cartdelete=await Cart.findByIdAndRemove(req.params.id,req.body);
    res.send(cartdelete);
}));

module.exports=router;