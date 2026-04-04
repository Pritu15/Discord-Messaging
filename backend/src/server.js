const http = require('http');
const app = require('./app');
const env = require('./config/env');
const initSocket = require('./socket');
const { setIO } = require('./socket/io');

const server = http.createServer(app);

const io = initSocket(server);
setIO(io);

server.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
});
