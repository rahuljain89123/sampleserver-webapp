
import process from 'process'
import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import sass from 'rollup-plugin-sass'
import replace from 'rollup-plugin-replace'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'
import hash from 'rollup-plugin-hash'
import uglify from 'rollup-plugin-uglify'

const NODE_ENV = process.env.CI ? 'production' : 'dev'

const external = process.env.CI ? [] : [
    'react',
    'react-dom',
    'react-redux',
    'react-router-dom',
    'redux',
    'redux-thunk',
    'timeago.js',
    'immutable',
    'reactstrap',
    'filestack-js',
]

const globals = process.env.CI ? {} : {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-redux': 'ReactRedux',
    'react-router-dom': 'ReactRouterDOM',
    'redux': 'Redux',
    'redux-thunk': 'ReduxThunk',
    'timeago.js': 'timeago',
    'immutable': 'Immutable',
    'reactstrap': 'Reactstrap',
    'filestack-js': 'filestack',
}

const plugins = [
    buble({
        exclude: '**/*.scss',
        objectAssign: 'Object.assign',
    }),
    replace({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
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

if (process.env.CI) {
    plugins.push(
        uglify(),
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
    external,
    globals,
}
