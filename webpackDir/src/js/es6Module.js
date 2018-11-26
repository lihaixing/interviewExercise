import '@babel/polyfill'
import funPlus from './common'
import _ from 'lodash-es'
// import '../css/demo1.css'
import '../sass/scssDemo.scss'

export default function () {
    console.log('我是es6Module9');
    console.log([...new Set([4, 6, 8])]);
    console.log(Array.from(new Set([4, 6, 8])));
    console.log([4, 6, 8, 9, 19, 1, 7.5].includes(9));
    console.log([4, 6, 8, 9, 19, 1, 7.5].find((value) => value > 7));
    console.log(`funPlus(5,8)=${funPlus(5, 8)}`);
    console.log(_.add(3, 7));
    import(/* webpackChunkName:asyncLoad */ './asyncModule').then(function (func) {
        func();
        console.log('异步额订单外')
    });
    import(/* webpackChunkName:asyncLoad */'./asyncModule2').then(function (func) {
        func();
        console.log('异步额外2')
    });
}