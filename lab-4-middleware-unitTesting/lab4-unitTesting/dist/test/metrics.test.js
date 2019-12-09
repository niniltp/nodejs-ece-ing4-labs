"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var metrics_1 = require("../metrics");
var leveldb_1 = require("../leveldb");
var dbPath = './db/test';
var dbMet;
describe('Metrics', function () {
    before(function () {
        leveldb_1.Leveldb.clear(dbPath);
        dbMet = new metrics_1.MetricsHandler(dbPath);
    });
    describe('#get', function () {
        it('should get empty array on non existing group', function (done) {
            dbMet.get("0", "0", function (err, result) {
                chai_1.expect(err).to.be.null;
                chai_1.expect(result).to.not.be.undefined;
                chai_1.expect(result).to.be.empty;
                done();
            });
        });
        it('should save and get', function (done) {
            var metrics = [];
            metrics.push(new metrics_1.Metric('123456789', 10));
            dbMet.save('1', metrics, function (err, result) {
                dbMet.get('1', '123456789', function (err, result) {
                    chai_1.expect(err).to.be.null;
                    chai_1.expect(result).to.not.be.undefined;
                    chai_1.expect(result).to.not.be.empty;
                    done();
                });
            });
        });
    });
    after(function () {
        dbMet.closeDB();
    });
});
