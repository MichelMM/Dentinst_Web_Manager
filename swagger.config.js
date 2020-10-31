// swagger.config.js
module.exports = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            "title": "Dentist web manager",
            "description": "",
            "version": "1.0.0",
            "servers": [ /*server_path*/ ]
        }
    },
    apis: ['index.js', 'routes/api.js']
}