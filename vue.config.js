const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "",
  configureWebpack: {
    plugins: [
      //
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
        minSize: 9000,
        maxSize: 140000,
      },
    },
  },
  devServer: {
    allowedHosts: "all",
  },
});
