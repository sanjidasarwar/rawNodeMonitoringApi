/*
 *Title: Not Found Handler
 * Description: 404 Not Found Handler
 * Author: Sanjida
 * Date: 2/2/2025
 *
 */

// dependencies


// modue scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: 'Your requested URL was not found!',
    });
};

module.exports = handler;
