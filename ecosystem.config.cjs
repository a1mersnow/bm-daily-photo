module.exports = {
  apps: [
    {
      name: 'DailyPhoto',
      port: '8888',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
    },
  ],
}
