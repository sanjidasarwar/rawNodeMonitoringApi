/*
 * Title: User Handler
 * Description: User Handler
 * Author: Sanjida
 * Date: 13/2/2025
 *
 */

// module scaffolding
const handler={}

handler.userHandler =(requstedProperties, callback)=>{
    callback(200, {
        message: 'This is a User url',
    })

}

module.exports=handler


