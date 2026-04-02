const channelModel = require("../models/channel.model");

exports.listChannels = async ({ serverId }) => {
  return channelModel.listChannels({ serverId });
};
