/*
 * Title: Sample Handler
 * Description: Sample Handler
 * Author: Sanjida
 * Date: 2/2/2025
 *
 */

// module scaffolding
const handler={}

handler.sampleHandler =(requstedProperties, callback)=>{
    callback(200, {
        message: 'This is a sample url',
    })

}

module.exports=handler


