module.exports = function (context, options) {
  return {
    name: 'docusaurus-plugin-cdn',
    injectHtmlTags({ content }) {
      return {
        headTags: [
          {
            tagName: 'script',
            attributes: {
              src: 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js',
            },
          }
        ],
      }
    },
  }
}
