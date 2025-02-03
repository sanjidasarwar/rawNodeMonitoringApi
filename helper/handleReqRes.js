/*
 * Title: Handle Request Response
 * Description: Handle Resquest and response
 * Author: Sanjida
 * Date: 2/2/2025
 *
 */

// dependencies
// const url = require('url')

// modue scaffolding
const handler = {};


handler.handleReqRes =(req, res)=>{
    const fullUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathName = fullUrl.pathname
    const trimedPathName = pathName.replace(/^\/+|\/+$/g, '')
    const method = req.method.toLowerCase()
    const queryStringObject = fullUrl.searchParams
    const headersObj = req.headers
    
    
    // response handle
    res.end('Hello world')
}


module.exports = handler;
