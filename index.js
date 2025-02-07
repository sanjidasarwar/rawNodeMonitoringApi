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


// app object - module scaffolding
const app ={}

data.delete('test', 'newfile', (err)=>{
    console.log('error is', err);
    
} )

// configuration
app.config ={
    port:3000
}

// create server
app.createServer = () =>{
    const server = http.createServer(handleReqRes)
    server.listen(app.config.port, ()=>{
        console.log(`Listing to port ${app.config.port}`);

    })
}

// start the server
app.createServer();
