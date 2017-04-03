#!/usr/bin/env node

const path = require('path');
const Monitor = require('forever-monitor').Monitor;

const monitorOpts = {
  max: 10000,
  silent: false,
  minUptime: 60000,
  spinSleepTime: 600000,
  args: [],
};

const engine = new Monitor(path.join(__dirname, '../lib/index.js'), monitorOpts);

engine.on('exit', () => console.error('Engine has exited.'));
engine.on('restart', () => console.error(`Attempted engine restart ${engine.times} time(s)`));
engine.start();

process.once('SIGTERM', () => {
  engine.stop();
});
process.once('SIGINT', () => {
  engine.stop();
});
