'use strict';

const path = require( 'path' );
const webpack = require('webpack')
const { bundler, styles } = require('@ckeditor/ckeditor5-dev-utils')
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')


module.exports = {
    // https://webpack.js.org/configuration/entry-context/
    entry: path.resolve(__dirname, 'src', 'ckeditor.js'),

    // https://webpack.js.org/configuration/output/
    output: {
      // The name under which the editor will be exported.
      library: 'CKEditor',
  
      path: path.resolve(__dirname, 'build'),
      filename: 'ckeditor.js',
      libraryTarget: 'umd',
      libraryExport: 'default',
    },

    module: {
        rules: [
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,

                use: [ 'raw-loader' ]
            },
            {
                test: /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css$/,

                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag',
                            attributes: {
                                'data-cke': true
                            }
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: styles.getPostCssConfig( {
                                themeImporter: {
                                    themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                                },
                                minify: true
                            } )
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
      new CKEditorWebpackPlugin({
        // UI language. Language codes follow the https://en.wikipedia.org/wiki/ISO_639-1 format.
        // When changing the built-in language, remember to also change it in the editor's configuration (src/ckeditor.js).
        language: 'es',
      }),
      new webpack.BannerPlugin({
        banner: bundler.getLicenseBanner(),
        raw: true,
      }),
    ],
    // Useful for debugging.
    devtool: 'source-map',

    // By default webpack logs warnings if the bundle is bigger than 200kb.
    performance: { hints: false }
};