// dependencies
const { compareHashPassword, parseJSON, createToken } = require('../../helper/utilities');
const data = require('../../lib/data')

// module scafollding
const handler={}

handler.tokenHandler = (requstedProperties, callback)=>{
    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    if(acceptedMethods.indexOf(requstedProperties.method)> -1){
        handler._token[requstedProperties.method](requstedProperties, callback)
    }else{
        callback(405,{
            error:'requested method not allowed'
        })
    }
}

handler._token={}

handler._token.post =async (requstedProperties, callback)=>{
    // check valid phone and password
    const phone = typeof requstedProperties.body.phone ==='string' && requstedProperties.body.phone.trim().length === 11 ? requstedProperties.body.phone : false

    const password = typeof requstedProperties.body.password ==='string' && requstedProperties.body.password.trim().length > 0 ? requstedProperties.body.password : false

    // check is the user valid
    data.read('users', phone, async (noUserFoundErr, userData)=>{
        if(noUserFoundErr){
            return callback(500, {
                 error: 'There was a problem in server side!'
             })
         }

         try{
             const parsedUserData = parseJSON(userData)
             const passwordMatched  = await compareHashPassword(password, parsedUserData.password)    

            if(phone === parsedUserData.phone && passwordMatched){
                
                const tokenId = createToken(10)
                
                const tokenData={
                    tokenId,
                    phone,
                    expiryDate: Date.now()*60*60*1000
                }
                data.createFile('tokens', tokenId, tokenData,(createError)=>{
                    if(createError){
                        callback(500, {
                            error: 'There was a problem in server side!'
                        })
                    }else{
                        callback(200, {
                            message: 'Token was created successfully!',
                        });
                    }
                } )
            }else{
                callback(500, { error: 'There was a problem in server side!' });

            }

         }catch (error) {
                callback(500, { error: 'There was a problem in server side!' });
        }

        
    })
}

handler._token.get = (requstedProperties, callback)=>{
    const tokenId =typeof requstedProperties.queryStringObject.get('id') ==='string' && requstedProperties.queryStringObject.get('id').trim().length>0 ? requstedProperties.queryStringObject.get('id') : false

    

    if(tokenId){
        data.read('tokens', tokenId, (err, tokenData)=>{
            
            if(err){
                callback(500, { error: 'There was a problem in server side!'})
            }

            callback(200, parseJSON(tokenData))
        })
    }else{
        callback(400, {
            error: 'You have a problem in your request!',
        });
    }
    
}


module.exports=handler