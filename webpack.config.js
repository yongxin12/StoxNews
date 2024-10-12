const path = require('path');

module.exports = {
    entry: './src/index.js',  // Corrected entry point
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',  // Output file
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',  // Using Babel loader to transpile modern JS
                }
            }
        ]
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),  // Serve from 'dist' directory
        },
        hot: true,  // Enable hot module replacement
        port: 8080,  // Set the port to 8080
    },
    mode: 'development',  // Development mode
};
