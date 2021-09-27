const config = require('./config/config.json');
const mongoose = require('mongoose');
const bot = require('./modules/bot-module');
const express = require('express');
const app = express();

mongoose.connect(config.DBUrl);
mongoose.connection.on('connected', () => {
    console.log('conection established');
    bot.launch();
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => console.log(`[SERVER] listening ob port ${PORT}`))
