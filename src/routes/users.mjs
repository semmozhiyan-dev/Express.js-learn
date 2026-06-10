import { Router } from "express";
import { getParamsId,getUserIndexById } from "../utils/middlewares.mjs";
import {users} from "../utils/constants.mjs"
import {createUserValidationSchema} from '../utils/validationSchema.mjs';
import { validationResult,matchedData,checkSchema } from "express-validator";
import cookieParser from "cookie-parser";
const router = Router();


router.get("/api/users",(req,res)=>{

    console.log(req.signedCookies);
    if(req.signedCookies.user && req.signedCookies.user === "Admin"){
        const {query:{filter,value}}= req;
        if(filter && value){
            return res.send(users.filter(((user)=>user[filter].toLowerCase().includes(value))));
        }    
        return res.send(users);

    }
    else{
        res.send({msg:"you are not Admin  / YOU DONT HAVE RIGHT COOKIE"});
    }


    
});

router.get("/api/users/:id",getParamsId,(req,res)=>{
    //console.log(req.params);
    const id= req.id;
    //const id=parseInt(req.params.id);
    //parseInt is used to convert string to int
    //console.log(id);
    //if(isNaN(id)){
        //return res.status(400).send({msg: "bad request,invalid id"})
    //}
    const user =users.find((user)=>user.id === id);
    //console.log(user);
    if(user){
        return res.send(user);
    }
    res.status(404).send({msg:"user not found"});
});

router.post("/api/users",
    //validation
    checkSchema(createUserValidationSchema),
    (req,res)=>{
    const result =validationResult(req);
    if(!result.isEmpty()){
        return res.status(400).send({error:result.array()});
    }
    
    
    //console.log(result);
    //console.log(req['express-validator#contexts']);
    const body =matchedData(req);
    const newUser={id:  users[users.length-1].id+1,...body};
    users.push(newUser);
    return res.status(201).send(newUser);
    });

router.put("/api/users/:id",getUserIndexById,(req,res)=>{
    const userIndex = req.userIndex;

    //console.log(req);
    //const id=parseInt(req.params.id);
    //if(isNaN(id)){
        //return res.status(400).send({msg: "bad request,invalid id"})
    //}
    //const userIndex =users.findIndex((user)=>user.id === id);
    //if(userIndex == -1){
        //return res.status(404).send({msg:"user not found"});

    //}
    const {body}  = req;
    users[userIndex]={id: id, ...body};
    return res.status(200).send({msg: "user updated"});
});

router.patch("/api/users/:id", (req,res)=>{
    const userIndex = req.userIndex;
    //const id=parseInt(req.params.id);
    //if(isNaN(id)){
        //return res.status(400).send({msg: "bad request,invalid id"})
    //}
    //const userIndex =users.findIndex((user)=>user.id === id);
    //if(userIndex == -1){
        //return res.status(404).send({msg:"user not found"});

    //}
    const {body}  = req;
    users[userIndex]={...users[userIndex], ...body};
    return res.sendStatus(200);
});

router.delete("/api/users/:id",getUserIndexById,(req,res)=>{
    const userIndex = req.userIndex;
    console.log(userIndex);
    //const id=parseInt(req.params.id);
    //if(isNaN(id)){
        //return res.status(400).send({msg: "bad request,invalid id"})
    //}
    //const userIndex =users.findIndex((user)=>user.id === id);
    //if(userIndex == -1){
        //return res.status(404).send({msg:"user not found"});

    //}
    users.splice(userIndex, 1);
    res.sendStatus(200);
});



export default router;
