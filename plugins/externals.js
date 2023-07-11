module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-externals',
    configureWebpack(config, isServer, utils) {
      return {
        externals: {
          fabric: 'fabric',
        },
      }
    },
  }
}
