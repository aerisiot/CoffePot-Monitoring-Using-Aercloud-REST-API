const axios = require('axios');
const constants = require('./constants');
const config = require('../config');

const url = `${config.get('aercloud.url')}/${config.get('aercloud.accountId')}/scls/`
  + `${config.get('aercloud.deviceId')}/containers/${config.get('aercloud.containerId')}/`
  + `contentInstances/?apiKey=${config.get('aercloud.apiKey')}`;

class DataService {
  static send(value) {
    return axios.post(url, {
      event: constants.STATUS,
      value,
    });
  }
}


module.exports = DataService;
