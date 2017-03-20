
import process from 'process'
import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import sass from 'rollup-plugin-sass'
import replace from 'rollup-plugin-replace'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'
import hash from 'rollup-plugin-hash'

const plugins = [
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
]

if (process.env.NODE_ENV === 'production') {
    plugins.push(
    hash({
        replace: true,
        dest: 'dist/bundle.[hash].js',
        manifest: 'dist/manifest.json',
        manifestKey: 'bundle',
    }))
}

export default {
    entry: 'index.js',
    format: 'iife',
    dest: 'dist/bundle.js',
    plugins,
}
