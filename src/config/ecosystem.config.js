module.exports = {
    apps: [{
    name: 'main',
    script: '../main.js',
    instances: 0,
    exec_mode: `cluster`
    }]
  }