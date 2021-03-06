"use strict";
const net = require('net');
const iconv = require('iconv-lite');

const client = new net.Socket();

let tempjj = [];

client.on('data', data => {
    let d = iconv.decode(data, "Shift_JIS");
    if (d.match(/200 OK/)) {
        d = d.split('200 OK\n')[1];
    }
    d = d.split('\nEOS');
    d.pop();
    for (let q of d) {
        tempjj.shift()(q + '\nEOS');
    }
});

module.exports = {
    setup: (HOST, PORT) => new Promise((resolve, reject) => {
        client.connect(PORT, HOST, () => {
            client.write('RUN -e2\n');
            resolve();
        });
    }),
    run: str => new Promise((resolve, reject) => {
        client.write(iconv.encode(`${str}\n`, "Shift_JIS"));
        tempjj.push(resolve);
    })
};
