module.exports = {
    entry: './src/index.ts',
    output: {
        filename: './dist/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015', 'stage-0']
                    }
                }]
            }
        ]
    },
    mode: "development"
};