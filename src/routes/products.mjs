import { Router } from "express";
import { getParamsId } from "../utils/middlewares.mjs";
import {products} from "../utils/constants.mjs";


const router = Router();

router.get("/api/products",(req,res)=>{
    req.session.visited = true;
    console.log(req.session.id);
    const {query:{filter,value}}= req;
    console.log(filter,value);
    if(filter && value){
        return res.send(products.filter(((product)=>product[filter].toString().toLowerCase().includes(value.toLowerCase()))));
    }    
    return res.send(products);
});

router.get("/api/products/:id",getParamsId,(req,res)=>{
    //console.log(req.params);
    const id= req.id;
    //const id=parseInt(req.params.id);
    //parseInt is used to convert string to int
    //console.log(id);
    //if(isNaN(id)){
        //return res.status(400).send({msg: "bad request,invalid id"})
    //}
    const product =products.find((product)=>product.id === id);
    //console.log(product);
    if(product){
        return res.send(product);
    }
    res.status(404).send({msg:"product not found"});
});




export default router;