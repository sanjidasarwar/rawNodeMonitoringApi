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

utilities.compareHashPassword=async(password, hashedPassword)=>{
    const passwordMatched = await bcrypt.compare(password, hashedPassword)
    return passwordMatched
}

utilities.createRandomString = (strLength) =>{
    let length =typeof strLength ==='number' && strLength >0 ? strLength : false
    
    if(length){
        const possibleCharacters ='abcdefghijklmnopqrstuvwxyz1234567890';
        let output=''
        for(let i=0; i<=length; i++){
            output += possibleCharacters.charAt(Math.floor(Math.random()*possibleCharacters.length))
        }
        return output
    }else{
        return false
    }



}

module.exports= utilities