const { parseJSON, createRandomString } = require("../../helper/utilities");
const data = require('../../lib/data');
const tokenHandler = require("./tokenHandler");
const {maxCheck} = require('../../helper/environment')

// module scafollding
const handler ={}

handler.checkHandler=(requstedProperties, callback)=>{
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if(acceptedMethods.indexOf(requstedProperties.method) > -1){
        handler._check[requstedProperties.method](requstedProperties, callback)

    }else{
        callback(405)
    }
}

handler._check={}

handler._check.post = (requstedProperties, callback)=>{
    
    const protocol =typeof requstedProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requstedProperties.body.protocol) >-1 ? requstedProperties.body.protocol : false

    const url = typeof requstedProperties.body.url ==='string' && requstedProperties.body.url.trim().length >0 ? requstedProperties.body.url : false

    const method = typeof requstedProperties.body.method ==='string' && ['get', 'post', 'put', 'delete'].indexOf(requstedProperties.body.method) >-1 ? requstedProperties.body.method : false

    const successCode = Array.isArray(requstedProperties.body.successCode) ? requstedProperties.body.successCode : false

    const timeoutSeconds = typeof requstedProperties.body.timeoutSeconds === 'number' && requstedProperties.body.timeoutSeconds % 1 === 0 && requstedProperties.body.timeoutSeconds >=1 && requstedProperties.body.timeoutSeconds<=5 ? requstedProperties.body.timeoutSeconds :false
    
    
    if(protocol && url && method && successCode && timeoutSeconds){
        const token = typeof requstedProperties.headersObj.token ==='string' ? requstedProperties.headersObj.token : false        
        
        data.read('tokens', token, (tokenErr, tokenData)=>{
            if(tokenErr){
                return callback(403, {
                    error: 'Authentication Problem, No token found'
                })
            }

            const userPhone = parseJSON(tokenData).phone

            tokenHandler._token.varify(token, userPhone, (isTokenValid)=>{
                if(!isTokenValid){
                    return callback(403, {
                        error: 'Authentication Problem, token not valid'
                    })
                }

                data.read('users', userPhone, (userErr, userData)=>{
                    if(userErr){
                        return callback(403, {
                            error: 'Authentication Problem'
                        })
                    }

                    const userObject = parseJSON(userData)
                    const userChecks = Array.isArray(userObject.checks) ? userObject.checks : []

                    if (userChecks.length >= maxCheck) {
                        return callback(401, { error: 'User has reached the max check limit!' });
                    }

                    const checkId = createRandomString(15)
                    const checkObject ={
                        checkId,
                        userPhone,
                        protocol,
                        url,
                        method,
                        successCode,
                        timeoutSeconds
                    }

                    data.createFile('checks', checkId, checkObject, (createErr)=>{
                        if(createErr){
                            return callback(500, { error: 'Error while saving the check!' });
                        }

                        userObject.checks = userChecks;
                        userObject.checks.push(checkId);

                        data.update('users', userPhone, userObject, (updateErr)=>{
                            if(updateErr){
                                return callback(500, {
                                    error:
                                        'There was a problem in the server side!',
                                });
                            }

                            callback(200, checkObject);
                        })

                    })
                })
            })

        })

    }else{
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
    
}

handler._check.get =(requstedProperties, callback)=>{
    const id =typeof requstedProperties.queryStringObject.get('id')==='string' && requstedProperties.queryStringObject.get('id').trim().length ==15 ? requstedProperties.queryStringObject.get('id') :false

    if(id){
        data.read('checks', id, (readErr, checkData)=>{
            if(readErr){
                return  callback(500, {
                    error: 'You have a problem in your request',
                });
            }

            const token = typeof requstedProperties.headersObj.token === 'string'
                ? requstedProperties.headersObj.token
                : false;
            
            const checkDataObject = parseJSON(checkData)

            tokenHandler._token.varify(token, checkDataObject.userPhone, (isvalid)=>{
                    if(!isvalid){
                        return  callback(403, {
                            error: 'Authentication failure!',
                        });
                    }

                    data.read(callback(200, checkDataObject))
            })
        })

    }else{
        callback(400, {
            error: 'You have a problem in your request',
        })
    }
}

handler._check.put =(requstedProperties, callback) =>{
    const protocol =typeof requstedProperties.body.protocol === 'string' && ['http', 'https'].indexOf(requstedProperties.body.protocol) >-1 ? requstedProperties.body.protocol : false

    const url = typeof requstedProperties.body.url ==='string' && requstedProperties.body.url.trim().length >0 ? requstedProperties.body.url : false

    const method = typeof requstedProperties.body.method ==='string' && ['get', 'post', 'put', 'delete'].indexOf(requstedProperties.body.method) >-1 ? requstedProperties.body.method : false

    const successCode = Array.isArray(requstedProperties.body.successCode) ? requstedProperties.body.successCode : false

    const timeoutSeconds = typeof requstedProperties.body.timeoutSeconds === 'number' && requstedProperties.body.timeoutSeconds % 1 === 0 && requstedProperties.body.timeoutSeconds >=1 && requstedProperties.body.timeoutSeconds<=5 ? requstedProperties.body.timeoutSeconds :false

    const id =typeof requstedProperties.queryStringObject.get('id')==='string' && requstedProperties.queryStringObject.get('id').trim().length ==15 ? requstedProperties.queryStringObject.get('id') :false

    if(id){
        data.read('checks', id, (readErr, checkData)=>{
            if(readErr){
                return  callback(500, {
                    error: 'You have a problem in your request',
                });
            }

            const token = typeof requstedProperties.headersObj.token === 'string'
            ? requstedProperties.headersObj.token
            : false;
        
        const checkDataObject = parseJSON(checkData)

        tokenHandler._token.varify(token, checkDataObject.userPhone, (isvalid)=>{
                if(!isvalid){
                    return   callback(403, {
                        error: 'Authentication failure!',
                    });
                }

                if(protocol){
                    checkDataObject.protocol = protocol
                }
                if(url){
                    checkDataObject.url = url
                }
                if(method){
                    checkDataObject.method = method
                }
                if(successCode){
                    checkDataObject.successCode = successCode
                }
                if(timeoutSeconds){
                    checkDataObject.timeoutSeconds = timeoutSeconds
                }

                data.update('checks', id, checkDataObject, (updateErr)=>{
                    if(updateErr){
                        return callback(500, {
                            error: 'There was a server side error!',
                        });
                    }
                    callback(200, {
                        message:'Successfully updated check'
                    })
                })
        })

        })
    }else{
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
}

handler._check.delete = (requestedProperties, callback) => {
    const id = typeof requestedProperties.queryStringObject.get('id') === 'string' &&
        requestedProperties.queryStringObject.get('id').trim().length == 15
            ? requestedProperties.queryStringObject.get('id')
            : false;

    if (!id) {
        return callback(400, { error: 'Invalid or missing ID.' });
    }

    data.read('checks', id, (readErr, checkData) => {
        if (readErr || !checkData) {
            return callback(500, { error: 'Check not found or read error!' });
        }

        const token =
            typeof requestedProperties.headersObj.token === 'string'
                ? requestedProperties.headersObj.token
                : false;

        const checkDataObject = parseJSON(checkData);

        tokenHandler._token.varify(token, checkDataObject.userPhone, (isValid) => {
            if (!isValid) {
                return callback(403, { error: 'Authentication failure!' });
            }

            // Delete the check
            data.delete('checks', id, (deleteErr) => {
                if (deleteErr) {
                    return callback(500, { error: 'Failed to delete check!' });
                }

                // Read user data
                data.read('users', checkDataObject.userPhone, (userErr, userData) => {
                    if (userErr || !userData) {
                        return callback(500, { error: 'User not found!' });
                    }

                    const userDataObject = parseJSON(userData);
                    const userChecks = Array.isArray(userDataObject.checks)
                        ? userDataObject.checks
                        : [];

                    const checkPosition = userChecks.indexOf(id);
                    if (checkPosition > -1) {
                        // Remove the check ID from user's checks array
                        userChecks.splice(checkPosition, 1);
                        userDataObject.checks = userChecks;

                        // Update the user data
                        data.update('users', checkDataObject.userPhone, userDataObject, (updateErr) => {
                            if (updateErr) {
                                return callback(500, { error: 'Failed to update user data!' });
                            }

                            callback(200, { message: 'Check deleted successfully!' });
                        });
                    } else {
                        callback(500, { error: 'Check ID not found in user data!' });
                    }
                });
            });
        });
    });
};

module.exports= handler
