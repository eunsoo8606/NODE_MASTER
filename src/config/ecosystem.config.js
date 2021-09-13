module.exports = {
    apps: [{
    name: 'web-server',
    script: '../main.js',
    instances: 0,
    exec_mode: `cluster`,
    wait_ready: true,
    listen_timeout: 50000
    }]
  }