import '@babel/polyfill'
import funPlus from './common'
import _ from 'lodash-es'

export default function () {
    console.log('我是es6Module2');
    console.log(`funPlus(4,7)=${funPlus(4, 7)}`);
    console.log(_.add(4, 6));
    //需安装babel-plugin-syntax-dynamic-import ，然后再babelrc中添加
    import(/* webpackChunkName:asyncLoad */'./asyncModule').then(function (func) {
        func();
    });
    import('./asyncModule2').then(function (func) {
        func();
    });
}