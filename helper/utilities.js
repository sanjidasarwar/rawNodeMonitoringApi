// dependencies
const bcrypt = require('bcrypt');

// module scaffolding
const utilities ={}

utilities.parseJSON =(jsonString)=>{
    let output

    try{
        output = JSON.parse(jsonString)
    }catch{
        output={}
    }

    return output
}

utilities.hashPassword=async(password)=>{
    const saltRounds = 10;
    const newPassword= await bcrypt.hash(password, saltRounds)
    return newPassword
}

module.exports= utilities