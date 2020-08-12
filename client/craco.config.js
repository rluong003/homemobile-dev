const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#ff4d4f', '@layout-body-background': '#fff'  },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};