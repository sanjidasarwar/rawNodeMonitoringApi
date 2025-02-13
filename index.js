/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Sanjida
 * Date: 2/2/2025
 *
 */

// dependencies
const http = require("http");
const {handleReqRes} = require('./helper/handleReqRes')
const data =require('./lib/data')
const environment = require('./helper/environment')


// app object - module scaffolding
const app ={}

// create server
app.createServer = () =>{
    const server = http.createServer(handleReqRes)
    server.listen(3000, ()=>{        
        console.log(`Listing to port ${environment.port}`);

    })
}

// start the server
app.createServer();
