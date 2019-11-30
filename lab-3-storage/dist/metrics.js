"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import Leveldb = require('./leveldb');
var leveldb_1 = require("./leveldb");
var level_ws_1 = __importDefault(require("level-ws"));
var Metric = /** @class */ (function () {
    function Metric(ts, v) {
        this.timestamp = ts;
        this.value = v;
    }
    return Metric;
}());
exports.Metric = Metric;
var MetricsHandler = /** @class */ (function () {
    function MetricsHandler(dbPath) {
        this.db = leveldb_1.Leveldb.open(dbPath);
    }
    MetricsHandler.prototype.save = function (key, metrics, callback) {
        var stream = level_ws_1.default(this.db);
        stream.on('error', callback);
        stream.on('close', callback);
        metrics.forEach(function (m) {
            stream.write({ key: "metric:" + key + m.timestamp, value: m.value });
        });
        console.log(metrics);
        stream.end();
    };
    MetricsHandler.prototype.getAll = function (key, callback) {
        var metrics = [];
        var rs = this.db.createReadStream()
            .on('data', function (data) {
            var metric = new Metric(data.key, data.value);
            metrics.push(metric);
            console.log(data.key, '=', data.value);
        })
            .on('error', function (err) {
            console.log('Oh my!', err);
            callback(null, err);
        })
            .on('close', function () {
            console.log('Stream closed');
            callback(metrics, null);
        })
            .on('end', function () {
            console.log('Stream ended');
        });
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
