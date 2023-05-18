const connectionSettings = {
  USERNAME: process.env.MONGO_USERNAME,
  PASSWORD: process.env.MONGO_PASSWORD,
  HOST: process.env.MONGO_HOST_URL,
  DB: process.env.MONGO_DB,
};

module.exports = connectionSettings;
