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
	if (typeof(thisDom.getAttribute("alt")) != "undefined") document.querySelector(".nov-table p").innerHTML = thisDom.getAttribute(
		"alt");
}
//n:判断响应式的对象(1:放大速率的倍数,2:图片边距的倍数)
function novResponsive(n) {
	// 响应式比例函数
	var window_width = document.body.clientWidth;
	if (n == 1) {
		// 放大速率相关
		if (window_width >= 1200) return 40;
		else if (window_width >= 992) return 30;
		else if (window_width >= 450) return 20;
		else return 10;
	} else if (n == 2) {
		// 放大后边距相关
		if (window_width >= 1200) return 25;
		else if (window_width >= 992) return 20;
		else if (window_width >= 450) return 10;
		else return 1;
	}
}

//novTable:放大遮罩最外层div
function novCloseMethod(novTable, defaultC) {
	// 关闭放大窗
	document.querySelector(".nov-table button").onclick = function() {
		var novTableImg = document.getElementById("nov-table-img");
		//初始化样式
		novTable.style.display = "none";
		novTableImg.style.width = "auto";
		novTableImg.style.height = "auto";
		//避免背景色延续到之后
		novTable.style.background = defaultC;
		//避免文字延续到之后
		novTable.querySelector("p").innerHTML = "";
		// 避免noscorll的时候打开悬浮窗退出body没有滚动条
		document.body.style.overflowY = "auto";
	}

}

//novTableImg:放大遮罩中放大的图片
function novImgCenter(novTableImg) {
	// 始终上下居中放大窗中的图片
	//获取屏幕高度					//获取的高度转换为浮点型    //值除2使照片居中
	novTableImg.style.top = (document.body.clientHeight - parseFloat(getComputedStyle(novTableImg).height)) / 2 + "px";
}

//novTable:放大遮罩最外层div;novTableImg:放大的图片
function novSize(novTable, novTableImg) {
	// 设置图片大小
	//图片的宽高比例函数
	var imgWidthScale;
	var imgHeightScale;

	var novTableImgHeight = parseFloat(getComputedStyle(novTableImg).height); //获取图片的高
	var novTableImgWidth = parseFloat(getComputedStyle(novTableImg).width); //获取图片的宽
	if (novTableImgWidth > novTableImgHeight) {
		//当width比height长时以width为基准设置比例
		imgWidthScale = novResponsive(1);
		imgHeightScale = (novTableImgHeight / novTableImgWidth) * novResponsive(1);
	} else {
		//当width长时以height为基准
		imgWidthScale = (novTableImgWidth / novTableImgHeight) * novResponsive(1);
		imgHeightScale = novResponsive(1);
	}

	var w = 0,
		h = 0;
	for (;;) {
		//如果w小于屏幕宽度-响应式比例放大系数,就增加宽度,否则直接退出循环
		if (w < document.body.clientWidth - novResponsive(2) * 10) {
			w += imgWidthScale;
		} else {
			break;
		}
		//如果w小于屏幕高度-响应式比例放大系数,就增加高度,否则直接退出循环
		if (h < document.body.clientHeight - novResponsive(2) * 10) {
			h += imgHeightScale;
		} else {
			break;
		}
	}

	//赋值给图片
	novTableImg.style.width = w + "px";
	novTableImg.style.height = h + "px";

}

//novTable:放大遮罩最外层div
function novScrollMethod(novTable, Domthis) {
	// 让放大窗跟随滚动条
	var issafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
	//如果父级或本级有noscroll属性,那么将隐藏滚动条,并不进行跟随
	if ((Domthis.getAttribute("noScroll") != null || getParentTag(Domthis, "nov-img-box").getAttribute("noScroll") != null) &&
		(!issafariBrowser)) {
		document.body.style.overflowY = "hidden";
		document.querySelector(".nov-table").style.width = "100%";
	} else {
		window.onscroll = function() {
			novTable.style.top = getScrollTop() + "px";
		}

		document.body.style.overflowY = "auto";
	}

}

function novMoblie() {
	//当屏幕宽度小于648时，高度会g根据document高度来进行变化（其他情况默认是body）
	var novTable = document.querySelector(".nov-table");
	if (document.body.clientWidth <= 648 && getComputedStyle(novTable).display == "block") {
		novTable.style.height = window.innerHeight + "px";
	}
}

function resizeFn() {
	var novTable = document.querySelector(".nov-table");
	window.onresize = debounce(function() {
		//窗口大小更改时,重新初始化
		// 外层块宽度设为设备宽度
		novTable.style.width = document.body.clientWidth + "px";
		// 外层块高度设为设备高度
		novTable.style.height = document.body.clientHeight + "px";
		novTable.style.top = getScrollTop() + "px";
		novMoblie();

	}, 100,false);


}


function colorChange(Domthis, defaultC) {
	//更改背景颜色
	var NodeSingleColor = Domthis.getAttribute("novBackground"); //获取属性为novBackground的值
	var NodeBoxColor = getParentTag(Domthis, "nov-img-box").getAttribute("novBackground");
	var novTable = document.querySelector(".nov-table");
	if (NodeSingleColor) {
		novTable.style.background = NodeSingleColor //仅一个更改背景颜色,不影响其他块
	} else if (NodeBoxColor) {
		novTable.style.background = NodeBoxColor; //使用父级颜色
	} else {
		novTable.style.background = defaultC; //其他均为默认颜色.
	}
}
//Domthis:被点击的对象
function novFunction(Domthis, defaultC) {
	// 如果是有nov-no-active这个class的,就直接return掉.使用css样式会导致用户自定义点击事件也禁用
	
	if (Domthis.className.indexOf('nov-no-active') != -1) return 0;
	var novTableImg = document.getElementById("nov-table-img");
	var novTable = document.querySelector(".nov-table");
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
	// 滚动跟随函数
	novScrollMethod(novTable, Domthis);
	//更改照片背景颜色
	colorChange(Domthis, defaultC);
	//页面宽高更改时的对应
	resizeFn();
	//对移动端高度优化
	novMoblie();
	//调整图片大小函数
	novSize(novTable, novTableImg);
	// 始终上下居中函数
	novImgCenter(novTableImg);
	// 关闭函数
	novCloseMethod(novTable, defaultC);

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
