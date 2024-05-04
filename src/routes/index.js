const studentRouter = require('./student')

const route = (app) => {
    app.use('/', studentRouter)
}

module.exports = route