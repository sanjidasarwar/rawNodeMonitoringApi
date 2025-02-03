/*
 * Title: Handle Request Response
 * Description: Handle Resquest and response
 * Author: Sanjida
 * Date: 2/2/2025
 *
 */

// dependencies
const { StringDecoder } = require('string_decoder');

// modue scaffolding
const handler = {};


handler.handleReqRes =(req, res)=>{
    const fullUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathName = fullUrl.pathname
    const trimedPathName = pathName.replace(/^\/+|\/+$/g, '')
    const method = req.method.toLowerCase()
    const queryStringObject = fullUrl.searchParams
    const headersObj = req.headers
    const decoder = new StringDecoder()
    let realData=''

    req.on('data', (buffer)=>{
        realData += decoder.write(buffer)
    })

    req.on('end', ()=>{
        realData += decoder.end()

        console.log(realData);
        // response handle
        res.end('Hello world')
        
    })
    
    
}


module.exports = handler;
