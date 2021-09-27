const config = require('.././config/config.json');

const exchange_api = config.exchangeApiKey;

const fetch = require('node-fetch')

const mongoose = require('mongoose');
const { Schema } = mongoose;

const currenciesSchema = new Schema({
    name: String,
    currencies: Array
});

async function request(url, method = 'GET', body = null, headers = {}) {
    try {
        const response = await fetch(url, { method, body, headers });
        if (!response.ok) {
            throw new Error(data.message || '[ERROR]: Bad request')
        }
        return await response.json();
    } catch (err) {
        console.log(err.message)
    }
};

const currenciesModel = mongoose.model('Currencies', currenciesSchema);
currenciesModel.getLatestCurrencies = async () => {
    let db_data = await currenciesModel.findOne({ name: 'Currencies' }).exec();
    if (db_data) {
        console.log('Model found');
        let date = db_data.currencies[db_data.currencies.length - 1].timestamp;
        if ((Date.now() - date) > 600000) {
            console.log('requesting new data');
            let response = await request(exchange_api);
            db_data.currencies.push(response);
            console.log(`response: ${JSON.stringify(response.rates)}`)
            db_data.currencies[db_data.currencies.length - 1].timestamp = Date.now();
            db_data.save();
        }
        return db_data.currencies[db_data.currencies.length - 1];
    } else {
        console.log('Creating new model');
        let response = await request(exchange_api);
        console.log(`Response: ${response}`);
        let currencies = [response]
        let new_data = new currenciesModel({name: 'Currencies', currencies});
        new_data.currencies[0].timestamp = Date.now();
        await new_data.save();
        return new_data;
    }
}

currenciesModel.getCurrencies = async () => {
    let db_data = await currenciesModel.findOne({ name: 'Currencies' }).exec();
    if (!db_data) {
        return false;
    }
    return db_data;
}

module.exports = currenciesModel;