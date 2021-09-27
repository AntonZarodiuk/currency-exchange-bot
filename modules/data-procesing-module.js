function ChangeBaseCurrency(data) {
    console.log(`Fetched data: ${JSON.stringify(data.rates)}`)
    let USD = data.rates.USD;
    for (key in data.rates) {
        data.rates[key] /= USD;
        console.log(data.rates[key])
    };
    console.log(`Refactored data: ${JSON.stringify(data.rates)}`)
    return data;
}

module.exports = ChangeBaseCurrency;