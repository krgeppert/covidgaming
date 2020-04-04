const path = require("path");
const packageJson = require("../package.json");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: [path.resolve(__dirname, "../src/index.tsx")],
    module: {},
    plugins: [
        new HtmlWebpackPlugin({
            title: "Found",
            template: "src/index.ejs"
        })
    ],
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "../dist")
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"]
    }
};
