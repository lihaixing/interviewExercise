import funEs6Module from './es6Module'
import funEs6Module2 from './es6Module2'
require.include('./common')
let commonJsModule = require('./commonJsModule');
// 这是异步加载，会形成单独chunk
require(['./amdModule'], function (fun) {
    fun();
});
console.log('我是main啊');
funEs6Module();
funEs6Module2();
commonJsModule();

$('.myText').text('good');
// 热更新代码  一般不需要 vue-loader等各种loader会帮我们做
if (module.hot) {
    module.hot.accept()
}
