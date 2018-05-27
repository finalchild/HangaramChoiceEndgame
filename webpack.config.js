const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        login: ['babel-polyfill', 'whatwg-fetch', './src/login.js'],
        vote: ['babel-polyfill', 'whatwg-fetch', './src/vote.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: [
                path.resolve(__dirname, 'src')
            ],
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }]
    }
};
