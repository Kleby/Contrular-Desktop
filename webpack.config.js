const path = require("node:path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "production",
    entry: "./electron/main.js",
    target: "electron-main",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js"
    },
    externals: {
        'mssql': 'commonjs mssql',
        'tedious': 'commonjs tedious',
    },
    node:{
        __dirname: false,
        __filename: false
    },
    plugins: [
            new CopyPlugin({
                patterns: [
                    { from: "interface/assets", to: "assets" },
                    { from: "interface/index.html", to: "index.html" },
                    
                ]
            })
    ]
}