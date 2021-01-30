const ServerSettingsDB = require("../models/ServerSettings.js");
const settingsClean = require("../lib/dataFunctions/settingsClean.js");

const { SettingsClean } = settingsClean;

// Default Settings
const onlinePolling = {
  seconds: 0.5,
};
const server = {
  port: 4000,
  registration: true,
  loginRequired: true,
};
const timeout = {
  apiTimeout: 1000,
  apiRetryCutoff: 10000,
  apiRetry: 30000,
  webSocketRetry: 5000,
};
const filamentManager = false;
const history = {
  snapshots: {
    onFailure: true,
    onComplete: true,
  },
  thumbnails: {
    onFailure: true,
    onComplete: true,
  },
  timelapse: {
    onFailure: false,
    onComplete: false,
    deleteAfter: false,
  },
};
const influxExport = {
  active: false,
  host: null,
  port: 8086,
  database: "OctoFarmExport",
  username: null,
  password: null,
  retentionPolicy: {
    duration: "365d",
    replication: 1,
    defaultRet: true,
  },
};

class ServerSettings {
  static async init() {
    const settings = await ServerSettingsDB.find({});
    if (settings.length < 1) {
      const defaultSystemSettings = new ServerSettingsDB({
        onlinePolling,
        server,
        timeout,
        filamentManager,
        history,
        influxExport,
      });
      await defaultSystemSettings.save().then((ret) => {
        SettingsClean.start();
      });
      return "Server settings have been created...";
    }
    // Server settings exist, but need updating with new ones if they don't exists.
    if (typeof settings[0].timeout === "undefined") {
      settings[0].timeout = timeout;
    }
    if (typeof settings[0].server === "undefined") {
      settings[0].server = server;
    }
    if (typeof settings[0].filamentManager === "undefined") {
      settings[0].filamentManager = filamentManager;
    }
    if (typeof settings[0].history === "undefined") {
      settings[0].history = history;
    }
    if (typeof settings[0].influxExport === "undefined") {
      settings[0].influxExport = influxExport;
    }
    await settings[0].save().then((ret) => {
      SettingsClean.start();
    });
    return "Server settings already exist, loaded existing values...";
  }

  static check() {
    return ServerSettingsDB.find({});
  }

  static update(obj) {
    ServerSettingsDB.find({})
      .then((checked) => {
        checked[0] = obj;
        checked[0].save;
      })
      .then((ret) => {
        SettingsClean.start();
      });
  }
}

module.exports = {
  ServerSettings,
};
