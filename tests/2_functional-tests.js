const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let currentLikes

suite('Functional Tests', function() {

    // Test 1: Viewing one stock: GET request to /api/stock-prices/
    test("GET quote for single stock", function (done) {
        chai
          .request(server)
          .get("/api/stock-prices?stock=GOOG")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.stockData.stock, "GOOG")
            assert.isNumber(res.body.stockData.price)
            done();
          })
      })
    // Test 2: Viewing one stock and liking it: GET request to /api/stock-prices/
    test("GET quote for single stock and like it", function (done) {
        chai
          .request(server)
          .get("/api/stock-prices?stock=GOOG&like=true")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.stockData.stock, "GOOG")
            assert.isNumber(res.body.stockData.price)
            assert.isNumber(res.body.stockData.likes)
            currentLikes = res.body.stockData.likes
            done();
          })
      })
    // Test 3: Viewing the same stock and liking it again: GET request to /api/stock-prices/
    test("GET quote for single stock and like it again", function (done) {
        chai
          .request(server)
          .get("/api/stock-prices?stock=GOOG&like=true")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.stockData.stock, "GOOG")
            assert.isNumber(res.body.stockData.price)
            assert.equal(res.body.stockData.likes, currentLikes)
            done();
          })
      })
    // Test 4: Viewing two stocks: GET request to /api/stock-prices/
    test("GET quote for two stocks", function (done) {
        chai
          .request(server)
          .get("/api/stock-prices?stock=GOOG&stock=MSFT")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.stockData[0].stock, "GOOG")
            assert.isNumber(res.body.stockData[0].price)
            assert.equal(res.body.stockData[1].stock, "MSFT")
            assert.isNumber(res.body.stockData[1].price)
            done();
          })
      })
    // Test 5: Viewing two stocks and liking them: GET request to /api/stock-prices/
    test("GET quote for two stocks and like them", function (done) {
        chai
          .request(server)
          .get("/api/stock-prices?stock=GOOG&stock=MSFT")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, "application/json");
            assert.equal(res.body.stockData[0].stock, "GOOG")
            assert.isNumber(res.body.stockData[0].price)
            assert.isNumber(res.body.stockData[0].rel_likes)
            assert.equal(res.body.stockData[1].stock, "MSFT")
            assert.isNumber(res.body.stockData[1].price)
            assert.isNumber(res.body.stockData[1].rel_likes)
            done();
          })
      })
});
