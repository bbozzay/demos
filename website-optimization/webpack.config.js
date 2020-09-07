
const path = require("path");
const devMode = process.env.NODE_ENV !== "production";
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var glob = require("glob")

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { getDynamicEntries } = require("webpack-dynamic-entries");

let options = {
    skipFilesWithPrefix: ["_", "-"],
		// skipFilesInFolder: ["fonts"],
    trimAnyExtension: true,
		startingPath: "./assets"
}
// console.log(getDynamicEntries(__dirname + "/assets", options));

module.exports = {
		// entry: getDynamicEntries(__dirname + "/assets", options),
    entry: {
        bundle_css: glob.sync("./assets/css/**/*.css"),
        bundle_js: ["./assets/js/vendor/jquery", ...glob.sync("./assets/js/**/*.js")],
        jquery: ["./assets/js/vendor/jquery"]
    },
    output: {
      path: path.resolve(__dirname, "./site/pagespeed-demo/static/dist"),
        filename: (singleEntry) => {
            return !singleEntry.chunk.name.includes("bundle_css") ? '[name].js' : './backup/[name]--delete.js';
            //return "[name].js"
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? "[name].css" : "[name].[hash].css",
            //   filename: devMode ? '[name]' : '[name].[hash]',
            chunkFilename: devMode ? "[id].css" : "[id].[hash].css",
        }),
        new CleanWebpackPlugin(
          // paths to clean
          {
            dry: false,
            verbose: true,
            cleanOnceBeforeBuildPatterns: ['**/*'],
            protectWebpackAssets: false,
            // cleanAfterEveryBuildPatterns: ['**/*--delete--*'],
            cleanAfterEveryBuildPatterns: ['delete.js'],
          }
        )
    ],
    module: {
        rules: [
            {
                test: /\.js$/, //using regex to tell babel exactly what files to transcompile
                // exclude: /node_modules/, // files to be ignored
                exclude: {
                  test: [
                    /node_modules/
                  ]
                },
                use: {
                    loader: "babel-loader", // specify the loader
                },
            },
            {
                // Apply rule for .sass, .scss or .css files
                test: /\.(sa|sc|c)ss$/,

                // Set loaders to transform files.
                // Loaders are applying from right to left(!)
                // The first loader will be applied after others
                use: [
                    {
                        // After all CSS loaders we use plugin to do his work.
                        // It gets all transformed CSS and extracts it into separate
                        // single bundled file
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "./assets/scss"
                        }
                    },
                    {
                        // This loader resolves url() and @imports inside CSS
                        loader: "css-loader",
                    },
                    {
                        // First we transform SASS to standard CSS
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass"),
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader',
                // use: [
                //     'file-loader',
                // ],
                options: {
                    name: devMode ? './fonts/[name]' : './fonts/[name].[hash]',
                }
            }
        ],
    },
};