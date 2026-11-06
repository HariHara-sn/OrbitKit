const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  server: {
    enhanceMiddleware: (metroMiddleware) => {
      return (req, res, next) => {
        // Stream app errors and console logs directly into the Metro terminal
        if (req.url === '/client-log' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { level = 'error', message = '', stack = '' } = JSON.parse(body);
              const isError = level === 'error';
              const color = isError ? '\x1b[31;1m' : '\x1b[33;1m';
              const border = '\x1b[90m' + '─'.repeat(60) + '\x1b[0m';

              console.log(`\n${border}`);
              console.log(`${color}🚨 [APP ${level.toUpperCase()}]: ${message}\x1b[0m`);
              if (stack) {
                console.log(`\x1b[37m${stack}\x1b[0m`);
              }
              console.log(`${border}\n`);
            } catch (_) {}
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('ok');
          });
          return;
        }

        return metroMiddleware(req, res, next);
      };
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
