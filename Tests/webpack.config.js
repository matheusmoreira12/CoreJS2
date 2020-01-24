module.exports = {
    entry: './src/index.ts',
    output: {
        filename: './bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.m?ts$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            }
        ]
    },
    mode: "development"
};