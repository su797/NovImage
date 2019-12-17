function initNovImg() {
	// 插入图片放大窗
	var novImgCode =
		'<div class="nov-table"><p></p><img id="nov-table-img" style="pointer-events: none;" src="" /><button type="button">&times;</button></div>';
	$("body").prepend(novImgCode); //直接在body里插入
	//js版需要在后面重新获取一遍.nov-img-box,不然点击事件会被重置
}

function initNovImgJudge(novImgJudge) {
	// 判断init是否被初始化过
	if (!novImgJudge) {
		initNovImg();
		return 1;
	}
	return 0;
}

function novScrollMethod(Domthis) {
	// 让放大窗跟随滚动条
	var issafariBrowser = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
	//如果父级或本级有noscroll属性,那么将隐藏滚动条,并不进行跟随///Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)检测是否为safari,是的话不支持noscroll
	if (($(Domthis).attr("noScroll") != null || $(Domthis).parents(".nov-img-box").attr("noScroll") != null) && (!
			issafariBrowser)) {
		$("body").css("overflow-y", " hidden");
		$(".nov-table").css("width", "100%");
	} else {
		$(window).scroll(function() {
			$(".nov-table").css("top", $(document).scrollTop() + "px");
		});
		$("body").css("overflow-y", "auto");
	}

}



function novAltText(thisDom) {
	// 如果有alt属性则输出
	if (typeof(thisDom.attr("alt")) != "undefined") $(".nov-table p")[0].innerHTML = thisDom.attr("alt");
}

function novResponsive(n) {
	// 响应式比例函数
	var window_width = $(window).width();
	if (n == 1) {
		// 放大速率相关(数值越小图片的比例精度越高，但是如果屏幕过大会带来性能负担)
		if (window_width >= 1200) return 40;
		else if (window_width >= 992) return 30;
		else if (window_width >= 450) return 20;
		else return 10;
	} else if (n == 2) {
		// 放大后边距相关(数值越小图片占屏幕的比例越大)
		if (window_width >= 1200) return 25;
		else if (window_width >= 992) return 20;
		else if (window_width >= 450) return 10;
		else return 1;
	}
}

function novCloseMethod(defaultC) {
	// 关闭放大窗
	$(".nov-table button").click(function() {
		$(".nov-table").fadeOut(500, function() {
			//重置长宽
			$("#nov-table-img").css("width", "auto");
			$("#nov-table-img").css("height", "auto");
			$(".nov-table").css("background", defaultC); //初始化背景颜色
			//重置title内容
			$(".nov-table p")[0].innerHTML = "";
			//重置滚动条
			$("body").css("overflow-y", "auto");
		});

	});
}

function novImgCenter(thisDom) {
	// 始终上下居中放大窗中的图片
	$("#nov-table-img").css("top", ($(window).height() - $("#nov-table-img").height()) / 2 + "px");
}

function novSize() {
	// 设置图片大小
	//宽高比例函数
	var imgWidthScale;
	var imgHeightScale;
	if ($("#nov-table-img").width() > $("#nov-table-img").height()) {
		//当width长时以width为基准
		imgWidthScale = novResponsive(1);
		imgHeightScale = ($("#nov-table-img").height() / $("#nov-table-img").width()) * novResponsive(1);
	} else {
		//当width长时以height为基准
		imgWidthScale = ($("#nov-table-img").width() / $("#nov-table-img").height()) * novResponsive(1);
		imgHeightScale = novResponsive(1);
	}

	var w = 0,
		h = 0;
	for (;;) {
		//如果w小于屏幕宽度-响应式比例放大系数,就增加宽度,否则直接退出循环
		if (w < $(window).width() - novResponsive(2) * 10) {
			w += imgWidthScale;
		} else {
			break;
		}
		//如果w小于屏幕高度-响应式比例放大系数,就增加高度,否则直接退出循环
		if (h < $(window).height() - novResponsive(2) * 10) {
			h += imgHeightScale;
		} else {
			break;
		}
	}

	//赋值给图片
	$("#nov-table-img").css("width", w);
	$("#nov-table-img").css("height", h);

}

function colorChange(Domthis, defaultC) {
	// 根据用户属性更改背景颜色
	var NodeSingleColor = Domthis.attr("novBackground"); //获取属性为novBackground的值
	var NodeBoxColor = Domthis.parents(".nov-img-box").attr("novBackground");
	var novTable = document.querySelector(".nov-table");
	if (NodeSingleColor) {
		$(".nov-table").css("background", NodeSingleColor); //仅一个更改背景颜色,不影响其他块
	} else if (NodeBoxColor) {
		$(".nov-table").css("background", NodeBoxColor); //仅一个更改背景颜色,不影响其他块
	} else {
		$(".nov-table").css("background", defaultC); //其他均为默认颜色.
	}
}
function novMoblie(){
	//当屏幕宽度小于648时，高度会g根据document高度来进行变化（其他情况默认是body）
	if ($(window).width() <= 648 && $(".nov-table").css("display") == "block") {
		$(".nov-table").css("height", window.innerHeight+ "px");
	}
}
function resizeFn() {
	$(window).resize(function() {
		//窗口大小更改时,重新初始化
		// 外层块宽度设为设备宽度
		$(".nov-table").css("width", $(window).width() + "px");
		// 外层块高度设为设备高度
		$(".nov-table").css("height", $(window).height() + "px");
		$(".nov-table").css("top", $(document).scrollTop() + "px");
		novMoblie();//移动端重新配置高度基准
	});
}



function novFunction(Domthis, defaultC) {
	// 如果是有nov-no-active这个class的,就直接return掉.使用css样式会导致用户自定义点击事件也禁用
	if ($(Domthis).attr("class") != undefined)
		if ($(Domthis).attr("class").indexOf("nov-no-active") != -1)
			return 0;


	// 添加图片的地址
	$("#nov-table-img").attr("src", $(Domthis).attr("src"));
	// 外层块宽度设为设备宽度
	$(".nov-table").css("width", $(window).width() + "px");
	// 外层块高度设为设备高度
	$(".nov-table").css("height", $(window).height() + "px");
	// 外层块高度初始化为当前滑块滚动距离
	$(".nov-table").css("top", $(document).scrollTop() + "px");
	// 显示图片放大窗
	$(".nov-table").fadeIn(500);
	// 滚动跟随函数
	novScrollMethod(Domthis);
	//移动端优化（针对safari滚动统一高度），在这里先初始化一遍
	novMoblie();
	//根据窗口变动初始化
	resizeFn();
	//调整图片大小函数
	novSize();
	//更改照片背景颜色
	colorChange($(Domthis), defaultC);
	//将ALT内容转为title
	novAltText($(Domthis));
	// 始终上下居中函数
	novImgCenter($(Domthis));
	// 关闭函数
	novCloseMethod(defaultC);
	
}

function NovImg() {
	// 添加图片盒子的点击事件
	$(".nov-img-box img").click(function() {
		novFunction(this, $(".nov-table").css("background"));
	});
}


function NovImgSingle() {
	// 添加单独图片的点击事件
	$(".nov-img-single").click(function() {
		novFunction(this, $(".nov-table").css("background"));
	});
};

(function novImgMain() {
	var novImgJudge = 0;
	if ($(".nov-img-box").length > 0) {
		novImgJudge = initNovImgJudge(novImgJudge); //判断是否初始化过
		NovImg();
	}
	if ($(".nov-img-single").length > 0) {
		novImgJudge = initNovImgJudge(novImgJudge); //判断是否初始化过
		NovImgSingle();
	}
})();
