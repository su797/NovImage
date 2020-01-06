//str:需要转换为node节点的字符串
function createNode(str) {
	// 将字符串转为Node节点
	//创建一个node节点
	let tempNode = document.createElement('div');
	//将字符串插入Node节点
	tempNode.innerHTML = str;
	//返回Node节点数组第一个成员
	return tempNode.firstChild;
}

function getScrollTop() {
	// 返回滚动条高度(兼容性写法)
	let scrollTop = 0;
	if (document.documentElement && document.documentElement.scrollTop) {
		scrollTop = document.documentElement.scrollTop;
	} else if (document.body) {
		scrollTop = document.body.scrollTop;
	}
	return scrollTop;
}

function getParentTag(startTag, findTag) {
	//获取所有父节点
	// 标签是否是body,是着停止返回null,反之继续
	if(startTag.className=="nov-img-single")return null;
	if ('BODY' != startTag.nodeName) {
		// 查询当前元素的class是否包含指定class

		if (startTag.className)
			if (startTag.className.indexOf(findTag) != -1) {
				return startTag;
			}
		// 再上一层寻找
		return getParentTag(startTag.parentElement, findTag)
	}
	// 返回null,结束
	else {
		return null;
	}

}
//避免使用resize直接绑定在window上导致的后面的resize覆盖前面的问题，因为没有引用jq因此手动实现。
//形参 执行的函数 间隔时间 之前还是之后执行 
var debounce = function(func, threshold, execAsap) {
	var timeout;
	return function debounced() {
		var obj = this,
			args = arguments;

		function delayed() {
			if (!execAsap)
				func.apply(obj, args);
			timeout = null;
		};
		if (timeout)
			clearTimeout(timeout);
		else if (execAsap)
			func.apply(obj, args);
		timeout = setTimeout(delayed, threshold || 100);
	};
}

//n:判断初始化方式(1:box方式初始化,2:single方式初始化)
function initnovImg() {
	// 插入图片放大窗

	var novImgCode =
		'<div class="nov-table"><p></p><img id="nov-table-img" style="pointer-events: none;" src="" /><button type="button">&times;</button></div>';

	document.body.insertBefore(createNode(novImgCode), document.body.firstElementChild); //如果是单张图片,直接在body里插入
	//insertBefore方法需要先将字符串转为node节点之后才能插入

}

// novImgJudge:是否初始化过的控制变量(0:未初始化,1:已初始化)
//n:判断初始化方式(1:box方式初始化,2:single方式初始化)
function initnovImgJudge(novImgJudge) {
	// 判断init是否被初始化过
	if (!novImgJudge) {
		initnovImg();
		return 1;
	}
	return 0;
}



//Domthis:被点击的对象
function novAltText(thisDom) {
	// 如果有alt属性则输出
	if (typeof(thisDom.getAttribute("alt")) != "null"){
		
		document.querySelector(".nov-table p").innerHTML = thisDom.getAttribute("alt");
	}
}
//n:判断响应式的对象(1:放大速率的倍数,2:图片边距的倍数)
function novResponsive() {
	// 响应式比例函数
	var window_width = document.body.clientWidth;
	var window_height = document.body.clientHeight;
	var marginNum=[0,0];
		// 放大后边距相关
		if (window_width >= 1200) marginNum[0]=window_width/8;//左右空隙为屏幕高度的四分之一
		else if (window_width >=992)marginNum[0]=window_width/10;//左右空隙为屏幕高度的五分之一
		else if (window_width >= 450)marginNum[0]=30;//左右空隙为30px
		
		if (window_height >= 1200) marginNum[1]=window_height/8;//上下空隙为屏幕高度的四分之一
		else if (window_height >= 850)marginNum[1]=window_height/6;//上下空隙为屏幕高度的三分之一
	
	return marginNum;
}

//novTable:放大遮罩最外层div
function novCloseMethod(novTable, defaultC) {
	// 关闭放大窗
		var closeBtn=document.querySelector(".nov-table button");
		var novTableImg = document.getElementById("nov-table-img");
		//初始化样式
		novTable.style.opacity="0";
		setTimeout(function(){
			//避免opacity的过渡无法触发
			novTable.style.display = "none";
			//避免过渡动画的时候图片大小缩回去
			novTableImg.style.width = "auto";
			novTableImg.style.height = "auto";
			closeBtn.style.opacity="1";//关闭按钮初始化透明度为1(移动端的话会被变成透明度0),不放在这里会移动端导致关闭短暂显示
		},500);
		
		//避免背景色延续到之后
		novTable.style.background = defaultC;
		//避免文字延续到之后
		novTable.querySelector("p").innerHTML = "";
		// 避免noscorll的时候打开悬浮窗退出body没有滚动条
		document.body.style.overflowY = "auto";
		
		novTable.onclick=null;//撤销外层下的点击事件（点击外层关闭）

}

//novTableImg:放大遮罩中放大的图片
function novImgCenter(novTableImg) {
	// 始终上下居中放大窗中的图片
	//获取屏幕高度					//获取的高度转换为浮点型    //值除2使照片居中
	novTableImg.style.top = (document.body.clientHeight - parseFloat(getComputedStyle(novTableImg).height)) / 2 + "px";
}

/*
当图片放大大小超出限制时的设置函数
	属性分别为
	imgWidthScale:图片的宽度系数
	imgHeightScale:图片的高度系数
	ResponsiveMarginW:图片左右留白
	ResponsiveMarginH:图片的上下留白
*/
function novImgSizeOver(imgWidthScale,imgHeightScale,ResponsiveMarginW,ResponsiveMarginH){
	var setWidth=imgWidthScale*100;//最终的宽度
	var setHeight=imgHeightScale*100;//最终的高度
	var increase=1.2;//递增函数 
	for(;;){
		//如果宽度大于屏幕高度-余白,或高度大于屏幕高度-余白
		//setWidth*increase确保本次不会超出设定余白
		if(setWidth*increase<=$(window).width()- ResponsiveMarginW&&setHeight*increase<=$(window).height()- ResponsiveMarginH){
			//每次递增20%
			setWidth*=increase;
			setHeight*=increase;
		}else{
			break;
		}
	}
	$("#nov-table-img").css("width", setWidth);
	$("#nov-table-img").css("height",setHeight);
}

//计算图片宽高相应比例,以长的一边为1
function imgScaleCompute(){
	var imgScale=[1,1];
	var novTableImg= document.getElementById("nov-table-img");
	var novTableImgHeight = parseFloat(getComputedStyle(novTableImg).height); //获取图片的高
	var novTableImgWidth = parseFloat(getComputedStyle(novTableImg).width); //获取图片的宽
	if (novTableImgWidth >= novTableImgHeight) {
		//当width长时以width为基准1,为高度设置比例
		//imgHeightScale
		imgScale[1] = (novTableImgHeight / novTableImgWidth);
	} else {
		//当height长时以height为基准1,为宽度设置比例
		//imgWidthScale 
		imgScale[0] = (novTableImgWidth / novTableImgHeight) ;
	}
	return imgScale;
}
//novTable:放大遮罩最外层div;novTableImg:放大的图片;Domthis:当前点击图片;
function novSize(novTable, novTableImg,Domthis) {
	// 设置图片大小
	//图片的宽高比例函数
	var imgWidthScale=imgScaleCompute(novTableImg)[0];//获取宽度比例,如果宽度长则为1
	var imgHeightScale=imgScaleCompute(novTableImg)[1];//获取高度比例,如果高度长则为1
	
	var originSizeWidth=Domthis.naturalWidth;//原图像的宽 IE9+
	var originSizeHeight=Domthis.naturalHeight;//原图像的高 IE9+
	var ResponsiveMargin=novResponsive();//周边空白宽度
	var ResponsiveMarginW=ResponsiveMargin[0];//周边空白高度
	var ResponsiveMarginH=ResponsiveMargin[1];//周边空白高度
	
	var winWidth=document.body.clientWidth;//屏幕宽度
	var winHeight=document.body.clientHeight;//屏幕高度
	//放大系数,当某些较小的图像是否将其放大至某个倍数
	var zoomN=1.5;
	var thisParent=getParentTag(Domthis,"nov-img-box");
	//如果用有nov-zoom属性,并且大于1的话,就将放大系数设为相应的值
	if(Domthis.getAttribute("nov-zoom")!=undefined||Domthis.getAttribute("nov-zoom")>=1){
		zoomN=parseFloat(Domthis.getAttribute("nov-zoom"));
	}else if(thisParent!=null&&thisParent.getAttribute("nov-zoom")>=1){
		//如果图片未设置但父级有相应属性，则设置为父级的属性
		zoomN=parseFloat(thisParent.getAttribute("nov-zoom"));
	}
	
	if(originSizeWidth*zoomN<(winWidth - ResponsiveMarginW)&&originSizeHeight*zoomN <(winHeight- ResponsiveMarginH)){
		//如果宽度乘以系数以及高度乘以系数不超出边界
		novTableImg.style.width = originSizeWidth*zoomN + "px";
		novTableImg.style.height = originSizeHeight*zoomN + "px";
		return 0;
		
	}else{
		//图片大小乘以倍数超出窗口的情况或本身就超出的情况下,一般不会超出太多倍,因此*100没问题,为了减少循环次数,通常会保持在20次循环以内
		novImgSizeOver(imgWidthScale,imgHeightScale,ResponsiveMarginW,ResponsiveMarginH);
	}
}

//novTable:放大遮罩最外层div
function novScrollMethod(novTable, Domthis) {
	// 让放大窗跟随滚动条
	// console.log(Domthis.getAttribute("class").indexOf('nov-img-single'));
	var issafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
	//如果父级或本级有noscroll属性,那么将隐藏滚动条,并不进行跟随
	//getParentTag(Domthis, "nov-img-box")!=null 避免单度照片触发,获取不到属性报错
	if (getParentTag(Domthis, "nov-img-box")!=null&&(Domthis.getAttribute("noScroll") != null || getParentTag(Domthis, "nov-img-box").getAttribute("noScroll") != null) &&(!issafariBrowser)) {
		document.body.style.overflowY = "hidden";
		document.querySelector(".nov-table").style.width = "100%";
	} else {
		window.onscroll = function() {
			novTable.style.top = getScrollTop() + "px";
		}
		document.body.style.overflowY = "auto";
	}

}
function MoblieClose(defaultC){
	//移动端关闭
	var novTable = document.querySelector(".nov-table");
	novTable.onclick=function(){
		novCloseMethod(novTable, defaultC);
	}
}
function novMoblie(defaultC) {
	//当屏幕宽度小于648时，高度会g根据document高度来进行变化（其他情况默认是body）
	var novTable = document.querySelector(".nov-table");
	var closeBtn= document.querySelector(".nov-table button");
	if (document.body.clientWidth <= 648 && getComputedStyle(novTable).display == "block") {
		novTable.style.height = window.innerHeight + "px";
	}
	if (document.body.clientWidth <= 648 && getComputedStyle(closeBtn).display == "block") {
		closeBtn.style.transition="0s";//避免取消按钮时的过度动画
		closeBtn.style.opacity="0";
		 MoblieClose(defaultC);
		 
	}else if (document.body.clientWidth > 648 && getComputedStyle(closeBtn).opacity == "0"){
		closeBtn.style.transition=".5s";//恢复过度动画
		
		closeBtn.style.opacity="1";
	}
}



function setTextBox(setNum){
	//设置文字栏宽度及高度
	var novText=document.querySelector(".nov-table p");
	if(setNum==0)novText.setAttribute("style",""); //第一次运行时清除之前的所有属性,不然放大缩小窗口时会出错
	var novResMargin=(document.body.clientHeight- novText.height)/2;//获取图片边距
	var novTextHeight=parseFloat(novText.height);//获取文本高度
	if(novResMargin>novTextHeight){//如果文本高度低于边距,将其居中
	novText.style.top=(novResMargin-novTextHeight)/2+"px";
	}else{//如果文本高度高于边距,将其高度设置为边距高-
		//最多可容纳字数
		var textFontSize=parseFloat(getComputedStyle(novText).fontSize) ;
		novText.style.fontSize=textFontSize*0.9;
		if(setNum>4)return;//使文字最多压缩5次
		setTextBox(++setNum);
	}
	
	
}

function resizeFn(Domthis) {
	//窗口变化时初始化函数
	var novTable = document.querySelector(".nov-table");
	var closeBtn= document.querySelector(".nov-table button");
	var novTableImg= document.getElementById("nov-table-img");
	window.onresize = debounce(function() {
		//只有在窗口打开的情况下变换窗口大小才生效
		if(getComputedStyle(novTable).display=="block"){
			//窗口大小更改时,重新初始化
			// 外层块宽度设为设备宽度
			novTable.style.width = document.body.clientWidth + "px";
			// 外层块高度设为设备高度
			novTable.style.height = document.body.clientHeight + "px";
			novTable.style.top = getScrollTop() + "px";
			novMoblie();
			setTextBox(0);//窗口大小更改重新配置文字大小
			//当窗口大小改变时,重新配置图片大小
			var imgWidthScale=imgScaleCompute()[0];
			var imgHeightScale=imgScaleCompute()[1];
			var ResponsiveMargin=novResponsive();//周边空白宽度
			var ResponsiveMarginW=ResponsiveMargin[0];//周边空白高度
			var ResponsiveMarginH=ResponsiveMargin[1];//周边空白高度
			novSize(novTable, novTableImg,Domthis);
			novImgCenter(novTableImg);//维持上下居中
		}

	}, 100,false);


}
//thisAttr:需要检测的属性,cssAttr:需要更改的属性,thisNode:需要更改的节点,Domthis:this指针,defaultAttr:默认值
function attrChange(thisAttr,cssAttr,thisNode,Domthis, defaultAttr) {
	//更改背景颜色
	var NodeSingle = Domthis.getAttribute(thisAttr); //获取属性为novBackground的值
	var parentTag=getParentTag(Domthis, "nov-img-box");//获取父节点nov-img-box
	var NodeBox;
	if(parentTag!=null)NodeBox = parentTag.getAttribute(thisAttr);
	var novNode = document.querySelector(thisNode);//获取节点
	var novNodeStyle=novNode.getAttribute("style");//获取原有style
	if (NodeSingle) {
		//将style值拼接起来,原有属性+设置属性
		novNode.setAttribute("style",novNodeStyle+cssAttr+":"+ NodeSingle+";"); //仅一个更改属性,不影响其他块
	} else if (NodeBox) {
		novNode.setAttribute("style",novNodeStyle+cssAttr+":"+ NodeBox+";"); //仅一个更改属性,不影响其他块
	} else {
		novNode.setAttribute("style",novNodeStyle+cssAttr+":"+defaultAttr+";"); //其他均为默认属性.
	}
}




//Domthis:被点击的对象
function novFunction(Domthis, defaultC) {
	// 如果是有nov-no-active这个class的,就直接return掉.使用css样式会导致用户自定义点击事件也禁用
	
	
	if (Domthis.className.indexOf('nov-no-active') != -1) return 0;
	var novTableImg = document.getElementById("nov-table-img");
	var novTable = document.querySelector(".nov-table");
	var closeBtn=document.querySelector(".nov-table button");
	var novSrc=0;
	// 添加图片的地址
		novTableImg.setAttribute("src", Domthis.getAttribute("src"));
	
	// 外层块宽度设为设备宽度
	novTable.style.width = document.body.clientWidth + "px";
	// 外层块高度设为设备高度
	//因为在罕见的特殊情况下,clientHeight的值会缺失一些,因此多加500
	novTable.style.height = document.body.clientHeight + 500 + "px";
	// 外层块高度初始化为当前滑块滚动距离
	novTable.style.top = getScrollTop() + "px";
	// 显示图片放大窗
	novTable.style.display = "block";
	// 和display一起用opacity会导致过渡效果失效，因此使用定时器隔开
	setTimeout(function(){
		novTable.style.opacity="1";
	},20);
	
	// 滚动跟随函数
	novScrollMethod(novTable, Domthis);
	
	//页面宽高更改时的对应
	resizeFn(Domthis);
	//对移动端高度优化
	novMoblie(defaultC);
	//调整图片大小函数
	novSize(novTable, novTableImg,Domthis);
	//更改照片背景颜色
	attrChange("novBackground","background",".nov-table",Domthis, defaultC);//使用默认颜色
	//更改边框颜色;
	attrChange("novBorder","border","#nov-table-img",Domthis, "0px");//默认无边框
	//ALT转换为文字
	novAltText(Domthis);
	//设置p内容位置及高度/字体大小的函数
	setTextBox(0);//0是累计递归次数的默认值
	//更改文字颜色,一定要在setTextBox调用的下面,否则会导致无效;
	attrChange("novColor","color",".nov-table p",Domthis, "black");//默认更改文字颜色
	// 始终上下居中函数
	novImgCenter(novTableImg);
	// 关闭函数
	closeBtn.onclick = function() {
		novCloseMethod(novTable, defaultC);
	}

}




function novImg() {
	var novTable = document.querySelector(".nov-table");
	var defaultC = getComputedStyle(novTable).background; //默认颜色
	// 添加图片盒子的点击事件
	var novImgSingleImg = document.querySelectorAll(".nov-img-box img")
	for (var i = 0; i < novImgSingleImg.length; i++) {
		novImgSingleImg[i].onclick = function() {
			novFunction(this, defaultC);
		}
	}
}


function novImgSingleFn() {
	var novTable = document.querySelector(".nov-table");
	var defaultC = getComputedStyle(novTable).background; //默认颜色
	// 添加单独图片的点击事件
	var novImgSingle = document.querySelectorAll(".nov-img-single");
	for (var i = 0; i < novImgSingle.length; i++) {
		novImgSingle[i].onclick = function() {
			novFunction(this, defaultC);
		}
	}
}

(function novImgMain() {
	//主函数

	//判断是否初始化过的变量
	var novImgJudge = 0;
	//获取到所有需要遮罩的父级
	var novImgBox = document.querySelectorAll(".nov-img-box");

	//获取到所有需要单独遮罩的图片
	var novImgSingle = document.querySelectorAll(".nov-img-single");
	var novTable = document.querySelector(".nov-table")
	//获取到遮罩盒子的颜色
	if (novImgBox.length > 0) { //如果有相应class
		novImgJudge = initnovImgJudge(novImgJudge); //判断是否初始化过
		novImg();
	}
	if (novImgSingle.length > 0) {
		novImgJudge = initnovImgJudge(novImgJudge); //判断是否初始化过
		novImgSingleFn();
	}


})();
