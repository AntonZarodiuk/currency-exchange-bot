const config = require('./config/config.json');
const mongoose = require('mongoose');
const bot = require('./modules/bot-module');

mongoose.connect(config.DBUrl);
mongoose.connection.on('connected', () => {
    console.log('conection established');
    bot.launch();
})
