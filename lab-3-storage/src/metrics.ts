// import Leveldb = require('./leveldb');
import {Leveldb} from './leveldb';
import WriteStream from 'level-ws';

export class Metric {
    public timestamp: string;
    public value: number;

    constructor(ts: string, v: number) {
        this.timestamp = ts;
        this.value = v;
    }
}

export class MetricsHandler {
    private db: any;

    constructor(dbPath: string) {
        this.db = Leveldb.open(dbPath)
    }

    public save(
        key: number,
        metrics: Metric[],
        callback: (error: Error | null) => void) {
        const stream = WriteStream(this.db);
        stream.on('error', callback);
        stream.on('close', callback);
        metrics.forEach((m: Metric) => {
            stream.write({key: `metric:${key}:${m.timestamp}`, value: m.value})
        });
        console.log(metrics);
        stream.end()
    }

    public getAll(
        key: string,
        keyTimestamp: string | null,
        callback: (result: Metric[] | null, error: Error | null) => void) {
        let metrics: Metric[] = [];
        const rs = this.db.createReadStream()
            .on('data', function (data) {
                let timestamp: string = data.key.split(':')[2];
                let id: string = data.key.split(':')[1];
                if (id === key && (timestamp === keyTimestamp || keyTimestamp === null)) {
                    let metric: Metric = new Metric(timestamp, data.value);
                    metrics.push(metric);
                    console.log(timestamp, '=', data.value, '//', id);
                }
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
                console.log('Stream ended')
            });
    }

    public delete(
        userID: string,
        timestampID: string,
        callback: (error: Error | null) => void) {
        let key: string = `metric:${userID}:${timestampID}`;
        this.db.del(key, function (err) {
            callback(err);
        });

    }
}