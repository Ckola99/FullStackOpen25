const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

// Use the PORT from config.js and start the server
app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
