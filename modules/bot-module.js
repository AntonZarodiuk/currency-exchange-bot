const { Telegraf } = require('telegraf')
const currencies = require('./currencies-module')
const ChangeBaseCurrency = require('./data-procesing-module');
const config = require('.././config/config.json');
const { format } = require('date-fns');

const bot = new Telegraf(process.env.BOT_TOKEN = config.botToken);

bot.start((ctx) => ctx.reply(`Welcome!\n
This bot provides currency exchange. Base currency is USD.\n
Use /help command to see the list of availible options.`));

bot.help((ctx) => ctx.reply(`Use /list command to see latest rates and availible currencies\n
Use /exchange to convert currencies: for example type "/exchange 10 USD to CAD"\n
Use /history to see currencies for last 7 days, for example: "/history CAD/USD" will show you CAD to USD rate`));

bot.command('list', async (ctx) => {
    let data = await currencies.getLatestCurrencies();
    data = ChangeBaseCurrency(data);
    let response = [];
    for (key in data.rates) {
        if (key === 'USD') continue;
        response.push(`${key}: ${(data.rates[key]).toFixed(2)}`)
    }
    ctx.reply(`Currencies: \n${response.join('\n')}`)
});

bot.command('exchange', async (ctx) => {
    let arr = ctx.message.text.split(' ');
    arr[1] = parseFloat(arr[1]);
    let data = await currencies.getLatestCurrencies();
    data = ChangeBaseCurrency(data);
    let exchange = ((arr[1]*data.rates[arr[4]])/data.rates[arr[2]]).toFixed(2)
    if (!exchange || !data.rates[arr[4]] || (!data.rates[arr[2]])) {
        return ctx.reply('Oops! something went wrong! See /help');
    }
    ctx.reply(`${exchange} ${arr[4]}`) 
})

bot.command('history', async (ctx) => {
    let arr = ctx.message.text.split(' ');
    if (!arr[1]) {
        return ctx.reply('Oops! something went wrong! See /help')
    }
    arr = arr[1].split('/');
    if (arr.length !== 2) {
        return ctx.reply('Oops! something went wrong! See /help')
    }
    let data = await currencies.getCurrencies();
    if (!data) {
        return ctx.reply('No data availible');
    };
    let response = [];
    let now = new Date();
    for (element of data.currencies.reverse()) {
        let date = new Date(element.timestamp)
        if (now.getDate() - date.getDate() > 7) {
            break;
        }
        date = format(date, 'yyyy-MM-dd HH:mm');
        let rate = ((element.rates[arr[0]])/(element.rates[arr[1]])).toFixed(2);
        response.push(`${date}: ${rate}`)
    }
    ctx.reply(`${response.reverse().join('\n')}`);
})

module.exports = bot;