const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    config({Const}) {
        return {
            cdn: {
              host: ''
            },
            devServer: {
                port: 13004,
                options: {
                    contentBase: [
                        Const.DIST_PATH
                    ]
                }
            },
            buildAssets: {
                js: [],
                css: []
            },
            dll: {
                entry: {
                    "vendor": ["babel-polyfill", "url-polyfill"],
                    "reactVendor": [ "react", "react-dom","react-redux"]
                }
            }
        }
    },
    after({rigger, itemConfig, processArgv}) {
        let entry = {

        };
        let plugins = [
            new CopyWebpackPlugin([{
                from: `${itemConfig.absolutePath.appsPath}/charting_library`,
                to: `charting_library`,
            }])
        ];
        let alias = {
            "$staticPath": itemConfig.absolutePath.staticPath,
            "$appsPath": itemConfig.absolutePath.appsPath,
            "$utils": `${itemConfig.absolutePath.appsPath}/utils/`
        };
        return rigger
            .entry({})
            .output({})
            .plugins(plugins)
            .append({
                resolve: {
                    alias,
                    extensions: ['.js', '.jsx']
                }
            })
            .done();

    }
};
