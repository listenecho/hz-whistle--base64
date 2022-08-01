const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = [
  {
    test: /\.tsx?$/,
    loader: "ts-loader",
    options: {
      configFile: path.resolve(__dirname, "../src/client/tsconfig.json"),
    },
  },
  {
    test: /\.(le|c)ss$/,
    use: [
      MiniCssExtractPlugin.loader,
      '@teamsupercell/typings-for-css-modules-loader',
      {
        loader: 'css-loader',
        options: {
          modules:  {
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
           
        }
      },
      "postcss-loader", // css后处理器，暂时只引入了autoprefixer
      "less-loader",
    ],
  },
  {
    // 图片处理
    test: /\.(png|jpg|gif)$/,
    use: {
      // file-loader的作用就是将要加载的文件复制到指定目录，而url-loader是对file-loader的封装，增加了limit的功能
      // 其中url-loader依赖file-loader
      loader: "url-loader",
      options: {
        limit: 1024, // 限制多大以内的图片直接使用DataURL
        name: "[name].[ext]", // 默认名称是MD5哈希值，配置name参数指定文件名称
        outputPath: "images/", // 指定输出的目录(也可以直接在name中指定)
      },
    },
  },
];
