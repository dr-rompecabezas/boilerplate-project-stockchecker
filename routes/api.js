'use strict';
const fetch = require('node-fetch');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stocks = []
      if (typeof(req.query.stock) == 'string') {
        stocks.push(req.query.stock)
      } else if (typeof(req.query.stock) == 'object') {
        stocks = req.query.stock
      }

      if (stocks.length == 1) {
        const apiQuery = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/" + stocks[0] + "/quote"
        fetch(apiQuery)
        .then(res => res.json())
        .then(data => {
          const responseObj = {
            "stockData": {
              "stock": data.symbol,
              "price": data.latestPrice,
              "likes": null
            }
          }
          res.send(responseObj)
        })
        .catch(err => {
          res.send(err)
        })
      } else if (stocks.length == 2) {
        const apiQuery1 = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/" + stocks[0] + "/quote"
        const apiQuery2 = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/" + stocks[1] + "/quote"
        const responseObj = {"stockData": []}
        fetch(apiQuery1)
        .then(res => res.json())
        .then(data => {
          const responseObj1 = {
            "stock": data.symbol,
            "price": data.latestPrice,
            "rel_likes": null
          }
          responseObj.stockData.push(responseObj1)
        })
        .catch(err => {
          res.send(err)
        })
        fetch(apiQuery2)
        .then(res => res.json())
        .then(data => {
          const responseObj2 = {
            "stock": data.symbol,
            "price": data.latestPrice,
            "rel_likes": null
          }
          responseObj.stockData.push(responseObj2)
          res.send(responseObj)
        })
        .catch(err => {
          res.send(err)
        })
      }
      
    });
    
};
