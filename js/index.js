$(function(){
	$(window).scroll(function(){
	    console.log(5)
		if($(window).scrollTop()>0){
			$('.box_navbar').addClass('scroll_in');
		}else{
			$('.box_navbar').removeClass('scroll_in');
		}
	});
    // 获取视窗宽度
    let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
    let htmlDom = document.getElementsByTagName('html')[0]
    // 注意10是根据设计稿算出来的，例如设计稿宽750，字体为24px,此值=750/24
    // 至于每个怎么算，利用sass/less的函数算
    htmlDom.style.fontSize = htmlWidth / 32 + 'px'
    window.addEventListener('resize', function () {
      let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth
      htmlDom.style.fontSize = htmlWidth / 32 + 'px'
    })
});
