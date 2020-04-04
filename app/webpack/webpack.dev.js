const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
    mode: "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true,
                        experimentalWatchApi: true
                    }
                },
                exclude: /node_modules/
            }
        ]
    },
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false
    },
    devtool: "eval",
    devServer: {
        hot: false,
        inline: false,
        port: 8001,
        host: "0.0.0.0",
        contentBase: path.resolve(__dirname, "dist"),
        historyApiFallback: {
            index: "/index.html"
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }
    },
    output: {
        path: path.resolve(__dirname, "../build"),
        publicPath: "/"
    }
});
