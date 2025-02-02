'use strict';
const { response } = require('express');
const fetch = require('node-fetch');
const StockModel = require('../models/stock.model.js')

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res) {
      const ip = req.ip
      let stocks = []
      if (typeof (req.query.stock) == 'string') {
        stocks.push(req.query.stock)
      } else if (typeof (req.query.stock) == 'object') {
        stocks = req.query.stock
      }
      if (stocks.length == 1) {
        const apiQuery = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/" + stocks[0] + "/quote"
        // GET single stock requested
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
            StockModel.findOne({ stock: data.symbol }, async function (err, doc) {
              if (err) { console.log(err) }
              if (!doc && req.query.like) {
                // console.log("no doc; like requested")
                StockModel.create({ stock: data.symbol, ip: ip, likes: 1 }, function (err, doc) {
                  if (err) { console.log(err) }
                  // console.log("new doc with ip and likes created")
                  responseObj.stockData.likes = doc.likes
                })
              } else if (!doc && !req.query.like) {
                // console.log("no doc found and no like requested")
                StockModel.create({ stock: data.symbol, likes: 0 }, function (err, doc) {
                  if (err) { console.log(err) }
                  // console.log("new doc with zero likes and empty ip array created")
                  responseObj.stockData.likes = doc.likes
                })
              } else if (doc && req.query.like) {
                // console.log("doc found; like requested; checking if ip is in doc...")
                if (!doc.ip.includes(ip)) {
                  // console.log("doc does not include requesting ip; updating doc with new ip and valid like...")
                  doc.ip.push(ip)
                  doc.likes++
                  await doc.save(function (err, doc) {
                    if (err) { console.log(err) }
                    // console.log("doc updated with new ip and new like")
                    responseObj.stockData.likes = doc.likes
                  })
                } else {
                  // console.log("doc already includes ip; responding with existing likes")
                  responseObj.stockData.likes = doc.likes
                }
              } else if (doc && !req.query.like) {
                // console.log("doc found, no like requested")
                responseObj.stockData.likes = doc.likes
              } else {
                console.log("Something went wrong! This code shouldn't run.")
              }
              // console.log("responseObj at end of findOne callback: ", responseObj)
              res.send(responseObj)
            })
            // console.log("responseObj at end of proxy data fetch callback: ", responseObj)
          })
          .catch(err => {
            res.send(err)
          })
      } else if (stocks.length == 2) {
        const apiQuery1 = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/" + stocks[0] + "/quote"
        const apiQuery2 = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/" + stocks[1] + "/quote"
        const compareResponseObj = { "stockData": [] }
        let stock1Likes, stock2Likes
        // GET first of two stocks requested
        fetch(apiQuery1)
          .then(res => res.json())
          .then(data => {
            const responseObj1 = {
              "stock": data.symbol,
              "price": data.latestPrice,
              "rel_likes": null
            }
            StockModel.findOne({ stock: data.symbol }, async function (err, doc) {
              if (err) { console.log(err) }
              if (!doc && req.query.like) {
                // console.log("no doc1; like requested")
                StockModel.create({ stock: data.symbol, ip: ip, likes: 1 }, function (err, doc) {
                  if (err) { console.log(err) }
                  // console.log("new doc1 with ip and likes created")
                  stock1Likes = doc.likes
                })
              } else if (!doc && !req.query.like) {
                // console.log("no doc1 found and no like requested")
                StockModel.create({ stock: data.symbol, likes: 0 }, function (err, doc) {
                  if (err) { console.log(err) }
                  // console.log("new doc1 with zero likes and empty ip array created")
                  stock1Likes = doc.likes
                })
              } else if (doc && req.query.like) {
                // console.log("doc1 found; like requested; checking if ip is in doc...")
                if (!doc.ip.includes(ip)) {
                  // console.log("doc1 does not include requesting ip; updating doc with new ip and valid like...")
                  doc.ip.push(ip)
                  doc.likes++
                  await doc.save(function (err, doc) {
                    if (err) { console.log(err) }
                    // console.log("doc1 updated with new ip and new like")
                    stock1Likes = doc.likes
                  })
                } else {
                  // console.log("doc1 already includes ip; responding with existing likes")
                  stock1Likes = doc.likes
                }
              } else if (doc && !req.query.like) {
                // console.log("doc1 found, no like requested")
                stock1Likes = doc.likes
              } else {
                console.log("Something went wrong! This code shouldn't run.")
              }
              // console.log("responseObj1 at end of findOne callback: ", responseObj1)
              compareResponseObj.stockData.push(responseObj1)
              // console.log("compareResponseObj after pushing responseObj1: ", compareResponseObj)
            })
          })
          .catch(err => {
            res.send(err)
          })
        // GET second of two stocks requested
        fetch(apiQuery2)
          .then(res => res.json())
          .then(data => {
            const responseObj2 = {
              "stock": data.symbol,
              "price": data.latestPrice,
              "rel_likes": null
            }
            StockModel.findOne({ stock: data.symbol }, async function (err, doc) {
              if (err) { console.log(err) }
              if (!doc && req.query.like) {
                // console.log("no doc2; like requested")
                StockModel.create({ stock: data.symbol, ip: ip, likes: 1 }, function (err, doc) {
                  if (err) { console.log(err) }
                  // console.log("new doc2 with ip and likes created")
                  stock2Likes = doc.likes
                })
              } else if (!doc && !req.query.like) {
                // console.log("no doc2 found and no like requested")
                StockModel.create({ stock: data.symbol, likes: 0 }, function (err, doc) {
                  if (err) { console.log(err) }
                  // console.log("new doc2 with zero likes and empty ip array created")
                  stock2Likes = doc.likes
                })
              } else if (doc && req.query.like) {
                // console.log("doc2 found; like requested; checking if ip is in doc...")
                if (!doc.ip.includes(ip)) {
                  // console.log("doc2 does not include requesting ip; updating doc with new ip and valid like...")
                  doc.ip.push(ip)
                  doc.likes++
                  await doc.save(function (err, doc) {
                    if (err) { console.log(err) }
                    // console.log("doc2 updated with new ip and new like")
                    stock2Likes = doc.likes
                  })
                } else {
                  // console.log("doc2 already includes ip; responding with existing likes")
                  stock2Likes = doc.likes
                }
              } else if (doc && !req.query.like) {
                // console.log("doc2 found, no like requested")
                stock2Likes = doc.likes
              } else {
                console.log("Something went wrong! This code shouldn't run.")
              }
              // console.log("responseObj2 at end of findOne callback: ", responseObj2)
              compareResponseObj.stockData.push(responseObj2)
              // console.log("compareResponseObj after pushing responseObj2: ", compareResponseObj)
              compareResponseObj.stockData[0].rel_likes = stock1Likes - stock2Likes
              compareResponseObj.stockData[1].rel_likes = stock2Likes - stock1Likes
              // console.log("compareResponseObj after rel_likes calculation: ", compareResponseObj)
              res.send(compareResponseObj)
            })
          })
          .catch(err => {
            res.send(err)
          })
      } else {
        res.send({ error: "request one or two stocks" })
      }
    });
};
