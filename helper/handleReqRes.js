/*
 * Title: Handle Request Response
 * Description: Handle Resquest and response
 * Author: Sanjida
 * Date: 2/2/2025
 *
 */

// dependencies
const { StringDecoder } = require('string_decoder');
const routes = require('../route')
const {notFoundHandler} = require('../handlers/routesHandlers/notFoundHandler')

// modue scaffolding
const handler = {};


handler.handleReqRes =(req, res)=>{
    const fullUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathName = fullUrl.pathname
    const trimedPathName = pathName.replace(/^\/+|\/+$/g, '')
    const method = req.method.toLowerCase()
    const queryStringObject = fullUrl.searchParams
    const headersObj = req.headers
    const requstedProperties ={
        fullUrl,
        pathName,
        trimedPathName,
        method,
        queryStringObject,
        headersObj
    }

    const decoder = new StringDecoder()
    let realData=''

    const routesHandlers = routes[trimedPathName] ? routes[trimedPathName] : notFoundHandler

    routesHandlers(requstedProperties, (statusCode, payload)=>{
        statusCode = typeof(statusCode) ==='number' ? statusCode : 500
        payload = typeof(payload) ==='object' ? payload : {}

        const payloadString = JSON.stringify(payload)

        // return the final response
        res.writeHead(statusCode);
        res.end(payloadString);
    })
    

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
