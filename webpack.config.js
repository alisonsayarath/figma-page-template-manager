const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = (env, argv) => ({
  watch: true,
  mode: argv.mode === "production" ? "production" : "development",
  devtool: argv.mode === "production" ? false : "inline-source-map",

  entry: {
    ui: "./src/ui.tsx",
    code: "./src/code.ts"
  },

  module: {
    rules: [
      // Converts TypeScript code to JavaScript
      { test: /\.(tsx|ts)?$/, use: "ts-loader", exclude: /node_modules/ },

      // Enables including CSS by doing "import './file.css'" in your TypeScript code
      {
        test: /\.css$/,
        loader: [{ loader: "style-loader" }, { loader: "css-loader" }]
      },

      // Allows you to use "<%= require('./file.svg') %>" in your HTML code to get a data URI
      {
        test: /\.(png|jpg|gif|webp|svg|zip)$/,
        loader: [{ loader: "url-loader" }]
      }
    ]
  },

  resolve: { extensions: [".tsx", ".ts", ".jsx", ".js"] },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },

  // Tells Webpack to generate "ui.html" and to inline "ui.ts" into it
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/ui.html",
      filename: "ui.html",
      inlineSource: ".(js)$",
      chunks: ["ui"]
    }),
    new HtmlWebpackInlineSourcePlugin()
  ]
});
