const serverModel = require("../models/server.model");

exports.listServers = async () => {
  return serverModel.listServers();
};
