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

// module scaffolding
const routes ={
    sample : sampleHandler,
    user: userHandler
}

module.exports = routes

