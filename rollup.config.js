
import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import sass from 'rollup-plugin-sass'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'

export default {
    entry: 'index.js',
    format: 'iife',
    plugins: [
        buble({
            exclude: '**/*.scss',
            objectAssign: 'Object.assign',
        }),
        commonjs({
            include: 'node_modules/**',
            namedExports: {
                'node_modules/react/react.js': ['Component', 'PropTypes', 'Children', 'createElement'],
            },
        }),
        nodeResolve({
            browser: true,
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('dev'),
        }),
        sass({
            output: true,
            options: {
                includePaths: ['node_modules'],
            },
            processor: css => postcss([autoprefixer])
                .process(css)
                .then(result => result.css),
        }),
    ],
    dest: 'dist/bundle.js',
}
