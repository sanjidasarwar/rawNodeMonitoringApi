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
const {parseJSON} = require('./utilities')

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

    req.on('data', (buffer)=>{
        realData += decoder.write(buffer)
    })

    req.on('end', ()=>{
        realData += decoder.end()

        requstedProperties.body=parseJSON(realData)

        const routesHandlers = routes[trimedPathName] ? routes[trimedPathName] : notFoundHandler

        routesHandlers(requstedProperties, (statusCode, payload)=>{
            if (res.headersSent) {
                return; // Do not send the response again
            }
            statusCode = typeof(statusCode) ==='number' ? statusCode : 500
            payload = typeof(payload) ==='object' ? payload : {}
    
            const payloadString = JSON.stringify(payload)
    
            // return the final response
            // res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        })
        console.log(realData);
        
    })
    
    
}


module.exports = handler;
