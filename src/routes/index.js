const recordRouter = require('./record')
const accountRouter = require('./account')
const chartRouter = require('./chart')

const route = (app) => {
    app.use('/record', recordRouter)
    app.use('/account', accountRouter)
    app.use('/chart', chartRouter)
}

module.exports = route