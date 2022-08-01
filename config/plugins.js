const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const path = require("path");

module.exports = [
  new MiniCssExtractPlugin({
    filename: "css/[name].css",
  }),
  new HtmlWebpackPlugin({
    chunks: ["index"], // 该文件包含哪些entry
    filename: "./index.html", // 指定文件名称，同时可以指定路径
    template: path.resolve(__dirname, "../src/client/index.html"),
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, "../src/server/static"),
        to: ".",
      },
      {
        from: path.resolve(__dirname, "../src/server"),
        to: "..",
        filter: (filepath) => {
            const regFile = /static/g
            if (regFile.test(filepath)) return false
            return true
          },
      }
    ],
  }),
];
