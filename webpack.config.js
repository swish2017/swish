// tslint:disable:object-literal-sort-keys
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const VisualizerPlugin = require("webpack-visualizer-plugin");
const WebpackMd5Hash = require("webpack-md5-hash");
const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const { CheckerPlugin } = require("awesome-typescript-loader");
const TsConfigPathsPlugin = require("awesome-typescript-loader").TsConfigPathsPlugin;

const BuildName = "ui-customer-mobile";
const IsProd = process.argv.indexOf("-p") !== -1;
const PublicPath = IsProd ?
        "https://d37aqgru44h424.cloudfront.net/assets/ui-customer-mobile/" :
        "http://acme.my.local.swishapp.io:9870/assets/ui-customer-mobile/";
const OutputFileNameFormat = IsProd ? "swish-[name]-[chunkhash]" : "swish-[name]";
const UrlLoaderFileFormat = IsProd ? "swish-[name]-[hash].[ext]" : "swish-[name].[ext]";
const SourceMap = IsProd ? "source-map" : "source-map"; //"cheap-module-eval-source-map";

const chunksSortMode = (chunk1, chunk2) => {
    var orders = ['vendor', 'blueprint', 'customersignup', 'customerlogin', 'customer'];
    var order1 = orders.indexOf(chunk1.names[0]);
    var order2 = orders.indexOf(chunk2.names[0]);

    return order1 - order2;
};

//Base Plugins.
const CommonPlugins = [
    new ExtractTextPlugin(OutputFileNameFormat + ".css"),

    new webpack.optimize.CommonsChunkPlugin({
        name: "vendor",
        minChunks: Infinity,
        filename: OutputFileNameFormat + ".js",
    }),

    new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "dev"),
    }),
    new HtmlWebpackPlugin({
        chunksSortMode: chunksSortMode,
        inject: false,
        alwaysWriteToDisk: true,
        template: "./src/features/signup/customersignup.html.ejs",
        title: "Swish Customer Signup",
        filename: "customersignup.html",
        chunks: ["vendor", "blueprint", "customersignup"],
    }),
    new HtmlWebpackPlugin({
        chunksSortMode: chunksSortMode,
        inject: false,
        alwaysWriteToDisk: true,
        template: "./src/features/login/customerlogin.html.ejs",
        title: "Swish Customer Login",
        filename: "customerlogin.html",
        chunks: ["vendor", "blueprint", "customerlogin"],
    }),

    new HtmlWebpackPlugin({
        chunksSortMode: chunksSortMode,
        inject: false,
        alwaysWriteToDisk: true,
        template: "./src/features/app/customer.html.ejs",
        title: "Swish Customer App",
        filename: "customer.html",
        chunks: ["vendor", "blueprint", "customer"],
    }),



    new HtmlWebpackHarddiskPlugin(),

    new CheckerPlugin(),

    new TsConfigPathsPlugin(/* { tsconfig, compiler } */),

    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),
];

const DevPlugins = [

];

const ProdPlugins = [

    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }),

    new WebpackMd5Hash(),

    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
        sourceMap: true,
    }),

    // new VisualizerPlugin({
    //     filename: "webpack-stats-" + BuildName + ".html",
    // }),

    new webpack.LoaderOptionsPlugin({
        minimize: true,
    }),

    // new StatsWriterPlugin({
    //   filename: "webpack-stats-" + BuildName + ".json",
    // }),

    // new BundleAnalyzerPlugin({
    //     analyzerMode: "html",
    //     reportFilename: "./dist/webpack-report-ui-customer-mobile.html",
    // }),
];

const BuildPlugins = CommonPlugins.concat(IsProd ? ProdPlugins : DevPlugins);

module.exports = {
    context: __dirname,

    entry: {
        vendor: [
            "numbro",
            "moment",
            "history",
            "react",
            "react-dom",
            "react-router-dom",
        ],
        blueprint: [
            "@blueprintjs/core",
            "@blueprintjs/table",
            "@blueprintjs/datetime",
            "@blueprintjs/core/dist/blueprint.css",
            "@blueprintjs/datetime/dist/blueprint-datetime.css",
            "@blueprintjs/table/dist/table.css"
        ],
        customer: "./src/features/app",
        customerlogin: "./src/features/login",
        customersignup: "./src/features/signup",
    },

    devServer: {
        host: "acme.my.local.swishapp.io",
        port: 9870,
        hot: false,
        headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Credentials": "true" },
    },

    node: {
        __filename: true,
    },

    output: {
        filename: OutputFileNameFormat + ".js",
        library: "swish",
        libraryTarget: "var",
        path: __dirname + "/dist",
        publicPath: PublicPath,
    },

    devtool: SourceMap,

    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".css", ".scss"],
    },

    stats: {
        children: false,
        colors: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: false,
        errorDetails: false,
        warnings: false,
        publicPath: false,
    },

    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader" ,
            },
            {
                test: /jquery\.js$/,
                loader: "expose-loader?jQuery!expose-loader?$",
            },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader?silent=true",
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader",
                    }, {
                        loader: "sass-loader",
                    }],
                }),
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader",
                }),
            },
            {
                test: /\.json$/,
                loader: "json-loader",
            },
            {
                test: /.(ico|png|jpg|gif|svg|eot|ttf|woff|woff2)(\?.+)?$/,
                loader: "url-loader?name=" + UrlLoaderFileFormat + "&limit=1024",
            },
        ],
    },

    plugins: BuildPlugins,
};
