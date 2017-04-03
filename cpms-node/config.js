const convict = require('convict');

const conf = convict({
  env: { doc: 'The App Environment.', format: ['prod', 'rc', 'test', 'dev'], default: 'dev', env: 'NODE_ENV' },
  aercloud: {
    url: {
      doc: 'The aercloud url.',
      format: String,
      default: 'http://api.aercloud.aeris.com/v1',
      env: 'AERCLOUD_URL',
    },
    accountId: {
      doc: 'The account id.',
      format: 'int',
      default: '1',
      env: 'ACCOUNT_ID',
    },
    apiKey: {
      doc: 'The api key for account id',
      format: String,
      default: '<Your API Key>',
      env: 'API_KEY',
    },
    deviceId: {
      doc: 'The device id',
      format: String,
      default: 'PI-TEAM-11',
      env: 'DEVICE_ID',
    },
    containerId: {
      doc: 'The container id',
      format: String,
      default: 'CNT-TEAM-11',
      env: 'CONTAINER_ID',
    },
  },
  logger: {
    logPath: {
      doc: 'The log path to create log files.',
      format: String,
      default: './logs',
      env: 'LOG_PATH',
    },
    level: {
      doc: 'The logging level.',
      format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: 'trace',
      env: 'LOG_LEVEL',
    },
  },
});

conf.validate({ strict: true });
module.exports = conf;
