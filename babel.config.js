module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '49',
          ios: '10'
        }
      }
    ]
  ]
}
