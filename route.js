/*
 * Title: Routes
 * Description: Application Routes
 * Author: Sanjida
 * Date: 2/2/2025
 *
 */

// dependencies
const {sampleHandler} = require('./handlers/routesHandlers/sampleHandler')
const { userHandler } = require('./handlers/routesHandlers/userHandler')
const { tokenHandler } = require('./handlers/routesHandlers/tokenHandler')

// module scaffolding
const routes ={
    sample : sampleHandler,
    user: userHandler,
    token:tokenHandler,
}

module.exports = routes

