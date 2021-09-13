module.exports = {
    apps: [{
    name: 'web-server',
    script: '../main.js',
    instances: 4,
    exec_mode: `cluster`
    }]
  }