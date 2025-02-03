/*
 * Title: Routes
 * Description: Application Routes
 * Author: Sanjida
 * Date: 2/2/2025
 *
 */

// dependencies
const {sampleHandler} = require('./handlers/routesHandlers/sampleHandler')

// module scaffolding
const routes ={
    sample : sampleHandler
}

module.exports = routes

