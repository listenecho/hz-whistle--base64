const path = require('path');
const plugins = require("./config/plugins")
const loaders = require("./config/loader")

module.exports = {
    entry: {
        index: './src/client/pages/result/index.tsx',
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, './public'),
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    plugins: [
      ...plugins
    ],
    module: {
        rules: [...loaders],
    },
};
