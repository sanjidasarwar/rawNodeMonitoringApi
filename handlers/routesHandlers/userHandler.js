/*
 * Title: User Handler
 * Description: User Handler
 * Author: Sanjida
 * Date: 13/2/2025
 *
 */
// dependecies
const data = require('../../lib/data')
const {hashPassword, parseJSON} = require('../../helper/utilities');
const tokenHandler =require('../../handlers/routesHandlers/tokenHandler')

// module scaffolding
const handler={}

handler.userHandler =(requstedProperties, callback)=>{
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requstedProperties.method)>-1){
        handler._users[requstedProperties.method](requstedProperties,callback)
    }else{
        callback(405);
    }

}


handler._users={}

handler._users.post=async (requstedProperties, callback)=>{
    
    const firstName =typeof requstedProperties.body.firstName ==='string' && requstedProperties.body.firstName.trim().length > 0 ? requstedProperties.body.firstName : false

    const lastName =typeof requstedProperties.body.lastName ==='string' && requstedProperties.body.lastName.trim().length > 0 ? requstedProperties.body.lastName : false

    const password =typeof requstedProperties.body.password ==='string' && requstedProperties.body.password.trim().length > 0 ? requstedProperties.body.password : false

    const phone =typeof requstedProperties.body.phone ==='string' && requstedProperties.body.phone.trim().length === 11 ? requstedProperties.body.phone : false

    const tosAgreement =typeof requstedProperties.body.tosAgreement ==='boolean' && requstedProperties.body.tosAgreement ? requstedProperties.body.tosAgreement : false

    if(firstName && lastName && password && phone && tosAgreement){
         // make sure that the user doesn't already exists
         data.read('users', phone,async  (noUserFoundErr)=>{
            if(!noUserFoundErr){
               return callback(500, {
                    error: 'There was a problem in server side!'
                })
            }

            try {
                const hashedPassword = await hashPassword(password);

                const userObject ={
                    firstName,
                    lastName,
                    phone,
                    password :hashedPassword,
                    tosAgreement
                }
                
    
                data.createFile('users', phone, userObject, (createErr)=>{
                    if(createErr){
                        return callback(500, { error: 'Could not create user!' });
                    }
    
                    callback(200, {
                        message: 'User was created successfully!',
                    });
                })
            } catch (error) {
                callback(500, { error: 'Password hashing failed!' });
            }
         })

    }else{
        callback(400,{
            error: 'You have a problem in your request'
        })
    }
}

handler._users.get=(requstedProperties, callback)=>{
    const phone =typeof requstedProperties.queryStringObject.get('phone')==='string' && requstedProperties.queryStringObject.get('phone').trim().length ==11 ? requstedProperties.queryStringObject.get('phone') :false
    
    if(phone){
        const token = typeof requstedProperties.headersObj.token ==='string' ? requstedProperties.headersObj.token : false

        tokenHandler._token.varify(token,phone, (valid)=>{
            if(valid){
                data.read('users', phone, (readErr, data)=>{
                    if(readErr){
                        return  callback(404, {
                            error: 'Error in reading data',
                        });
                    }            
        
                    const user ={...parseJSON(data)}
                    delete user.password;
                    callback(200, user);
        
        
                })
            }else{
                callback(403, {
                    error: 'Authentication failure!',
                });
            }
        } )

    }else{
        callback(404, {
            error: 'Requested user was not found!',
        });
    }

    
    
}

handler._users.put=async (requstedProperties, callback)=>{
    
    const firstName =typeof requstedProperties.body.firstName ==='string' && requstedProperties.body.firstName.trim().length > 0 ? requstedProperties.body.firstName : false

    const lastName =typeof requstedProperties.body.lastName ==='string' && requstedProperties.body.lastName.trim().length > 0 ? requstedProperties.body.lastName : false

    const password =typeof requstedProperties.body.password ==='string' && requstedProperties.body.password.trim().length > 0 ? requstedProperties.body.password : false

    const phone =typeof requstedProperties.body.phone ==='string' && requstedProperties.body.phone.trim().length === 11 ? requstedProperties.body.phone : false

    if(phone){
        if(firstName || lastName || password){

            const token = typeof requstedProperties.headersObj.token ==='string' ? requstedProperties.headersObj.token : false

            tokenHandler._token.varify(token,phone, (valid)=>{
                if(valid){
                    data.read('users', phone,async (readErr, userData)=>{
                        if(readErr){
                            return callback(400, {
                                error: 'you have a problem in read data'
                            })
                        }
        
                        const user ={...parseJSON(userData)}
        
                        if(firstName){
                            user.firstName =firstName
                        }
                        if(lastName){
                            user.lastName =lastName
                        }
                        if(password){
                            try{
                             const hashedPassword = await hashPassword(password);
                             user.password =hashedPassword
                            }catch(err){
                                callback(500, { error: 'Password hashing failed!' });
        
                            }
                        }
        
                        data.update('users', phone, user, (updateErr)=>{
                            if(updateErr){
                                return callback(400, {
                                    error: 'error in update user data'
                                })
                            }
        
                            callback(200, {
                                message: 'User was updated successfully!',
                            });
                        })
                    })
                }else{
                    callback(403, {
                        error: 'Authentication failure!',
                    });
                }
            } )

        }else {
            callback(400, {
                error: 'You have a problem in your request!',
            });
        }

    }else{
        callback(400, {
            error: 'Invalid phone number. Please try again!',
        });
    }

}

handler._users.delete= (requstedProperties, callback)=>{
    const phone =typeof requstedProperties.body.phone ==='string' && requstedProperties.body.phone.trim().length === 11 ? requstedProperties.body.phone : false

    if(phone){
        const token = typeof requstedProperties.headersObj.token ==='string' ? requstedProperties.headersObj.token : false

        tokenHandler._token.varify(token,phone, (valid)=>{
            if(valid){
                data.read('users', phone, (readErr)=>{
                    if(readErr){
                        return callback(400, {
                            error: 'Error in read data'
                        })
                    }
                    data.delete('users', phone, (deleteErr)=>{
                        if(deleteErr){
                            return callback(400, {
                                error: 'Error in delete data'
                            })
                        }else{
                            callback(200, {
                                message: 'User is successfully deleted!',
                            });
                        }
        
                    })
                })
            }else{
                callback(403, {
                    error: 'Authentication failure!',
                });
            }
        } )
      
    }else{
        callback(400, {
            error: 'Invalid phone number. Please try again!',
        });
    }
}

module.exports=handler


