const successResponse = (payload:{[key:string]:any}, statusCode:number, code:string)=>{
    return {
        status:"success",
        statusCode,
        code,
        payload 
    }
}



export{successResponse}