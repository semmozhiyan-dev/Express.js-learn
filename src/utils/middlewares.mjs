import {users} from "./constants.mjs"

export const getUserIndexById = (req, res ,next)=>{
    const id=parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).send({msg: "bad request,invalid id"})
    }
    const userIndex =users.findIndex((user)=>user.id === id);
    if(userIndex == -1){
        return res.status(404).send({msg:"user not found"});

    }
    req.userIndex=userIndex;
    next();

}
 
//another middleware function 
export const getParamsId=(req,res,next)=>{
    const id=parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).send({msg: "bad request,invalid id"})
    }
    req.id= id;
    next();
}