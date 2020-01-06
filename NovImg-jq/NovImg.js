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

//img是当前图片的jq对象
//返回当前图片的原始Dom节点对象
function originSize(img){
	//获取当前图片原始对象(可以通过返回节点获取原始宽高等)
	var theImage = new Image(); 
	theImage.src = img.attr( "src"); 
	return img;
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

function novResponsive(){
	// 响应式比例函数
	var window_width = $(window).width();
	var window_height = $(window).height();
	var marginNum=[0,0];
		// 放大后边距相关
		if (window_width >= 1200) marginNum[0]=window_width/8;//左右空隙为屏幕高度的四分之一
		else if (window_width >=992)marginNum[0]=window_width/10;//左右空隙为屏幕高度的五分之一
		else if (window_width >= 450)marginNum[0]=30;//左右空隙为30px
		
		if (window_height >= 1200) marginNum[1]=window_height/8;//上下空隙为屏幕高度的四分之一
		else if (window_height >=850)marginNum[1]=window_height/6;//上下空隙为屏幕高度的三分之一
	
	return marginNum;
	
}


function novCloseMethod(defaultC) {
	// 关闭放大窗
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

}

function novImgCenter(thisDom) {
	// 始终上下居中放大窗中的图片
	$("#nov-table-img").css("top", ($(window).height() - $("#nov-table-img").height()) / 2 + "px");
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
	if ($("#nov-table-img").width() > $("#nov-table-img").height()) {
		//当width长时以width为基准
		//imgHeightScale
		 imgScale[1]= ($("#nov-table-img").height() / $("#nov-table-img").width());
	} else {
		//当height长时以height为基准
		//imgWidthScale 
		imgScale[0]= ($("#nov-table-img").width() / $("#nov-table-img").height());
		
	}
	//imgScale[0]:宽的系数,imgScale[1]:长的系数
	return imgScale;
}

function novSize(Domthis) {
	// 设置图片大小
	
	
	var originSizeWidth=originSize(Domthis).width();//原图像的宽
	var originSizeHeight=originSize(Domthis).height();//原图像的高
	var imgWidthScale=imgScaleCompute()[0];//获取宽度比例,如果宽度长则为1
	var imgHeightScale=imgScaleCompute()[1];//获取高度比例,如果高度长则为1
	
	var ResponsiveMargin=novResponsive();//周边空白宽度
	var ResponsiveMarginW=ResponsiveMargin[0];//周边空白高度
	var ResponsiveMarginH=ResponsiveMargin[1];//周边空白高度
	//放大系数,当某些较小的图像是否将其放大至某个倍数
	var zoomN=1.5;
	var thisParent=Domthis.parents(".nov-img-box");
	//如果用有nov-zoom属性,并且大于1的话,就将放大系数设为相应的值
	if(Domthis.attr("nov-zoom")!=null&&Domthis.attr("nov-zoom")>=1){
		zoomN=parseFloat(Domthis.attr("nov-zoom")) ;
	}else if(thisParent.attr("nov-zoom")!=null&&thisParent.attr("nov-zoom")>=1){
		zoomN=parseFloat(thisParent.attr("nov-zoom"));
	}
	if(originSizeWidth*zoomN <=($(window).width()- ResponsiveMarginW)&&originSizeHeight*zoomN<=($(window).height() - ResponsiveMarginH)){
		//如果宽度乘以系数以及高度乘以系数不超出边界
		$("#nov-table-img").css("width", originSizeWidth*zoomN);
		$("#nov-table-img").css("height", originSizeHeight*zoomN);
		return 0;
		
	}else{
		//图片大小超出屏幕的情况执行下面的函数
		novImgSizeOver(imgWidthScale,imgHeightScale,ResponsiveMarginW,ResponsiveMarginH);
	}
	
	
	
	

}

//thisAttr:需要检测的属性,cssAttr:需要更改的属性,thisNode:需要更改的节点,Domthis:this指针,defaultAttr:默认值
function attrChange(thisAttr,cssAttr,thisNode,Domthis, defaultAttr) {
	// 根据用户属性更改背景颜色
	var NodeSingle = Domthis.attr(thisAttr); //获取属性为thisAttr的值
	var NodeBox = Domthis.parents(".nov-img-box").attr(thisAttr);//寻找父级
	// var novTable = document.querySelector(".nov-table");
	if (NodeSingle) {
		$(thisNode).css(cssAttr, NodeSingle); //仅一个更改属性,不影响其他块
		
	} else if (NodeBox) {
		$(thisNode).css(cssAttr, NodeBox); //整个盒子内均更改属性
	} else {
		$(thisNode).css(cssAttr, defaultAttr); //其他均为默认.
	}
}

function MoblieClose(defaultC){
	$(".nov-table").click(function(){
		novCloseMethod(defaultC);
	});
}

function novMoblie(defaultC){
	//当屏幕宽度小于648时，高度会根据document高度来进行变化（其他情况默认是body）
	if ($(window).width() <= 648 && $(".nov-table").css("display") == "block") {
		$(".nov-table").css("height", window.innerHeight+ "px");
	}
	
	
	if ($(window).width() <= 648 && $(".nov-table button").css("opacity")=="1") {
		 $(".nov-table button").css("transition","0s");
		 $(".nov-table button").css("opacity","0");
		 MoblieClose(defaultC);
		 
	}else 	if ($(window).width() > 648 && $(".nov-table button").css("opacity")=="0"){
		$(".nov-table button").css("transition",".5s");
		$(".nov-table button").css("opacity","1");
	}
	
}

function setTextBox(setNum){
	//设置文字栏宽度及高度
	if(setNum==0)$(".nov-table p").attr("style","");//第一次运行时清除之前的所有属性,不然放大缩小窗口时会出错
	var novResMargin=($(window).height()- $("#nov-table-img").height())/2;//获取图片边距
	var novTextHeight=parseFloat($(".nov-table p").css("height"));//获取文本高度
	if(novResMargin>novTextHeight){//如果文本高度低于边距,将其居中
		$(".nov-table p").css("top",(novResMargin-novTextHeight)/2+"px");
	}else{//如果文本高度高于边距,将其高度设置为边距高-
		//最多可容纳字数
		var textFontSize=parseFloat($(".nov-table p").css("font-size")) ;
		$(".nov-table p").css("font-size",textFontSize*0.9);
		if(setNum>4)return;
		setTextBox(++setNum);
	}
	
	
}


function resizeFn(Domthis) {
	$(window).resize(function() {
		//窗口大小更改时,重新初始化
		// 外层块宽度设为设备宽度
		//只有图片打开时更改窗口才执行以下操作
		if($(".nov-table").css("display")=="block"){
			$(".nov-table").css("width", $(window).width() + "px");
			// 外层块高度设为设备高度
			$(".nov-table").css("height", $(window).height() + "px");
			$(".nov-table").css("top", $(document).scrollTop() + "px");
			novMoblie();//移动端重新配置高度基准
			setTextBox(0);//窗口大小更改重新配置文字大小
			//当窗口大小改变时,重新配置图片大小
			var imgWidthScale=imgScaleCompute()[0];
			var imgHeightScale=imgScaleCompute()[1];
			var ResponsiveMargin=novResponsive();//周边空白宽度
			var ResponsiveMarginW=ResponsiveMargin[0];//周边空白高度
			var ResponsiveMarginH=ResponsiveMargin[1];//周边空白高度
			novSize(Domthis);
			novImgCenter(Domthis);
		}
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
	resizeFn(Domthis);
	//调整图片大小函数
	novSize($(Domthis));
	//更改照片背景颜色
	attrChange("novBackground","background",".nov-table",$(Domthis), defaultC);//使用默认颜色
	//更改边框颜色;
	attrChange("novBorder","border","#nov-table-img",$(Domthis), "0px");//默认无边框
	
	//将ALT内容转为title
	novAltText($(Domthis));
	//设置p内容位置及高度/字体大小的函数
	setTextBox(0);//0是累计递归次数的默认值
	
	//更改文字颜色,一定要在setTextBox调用的下面,否则会导致无效;
	attrChange("novColor","color",".nov-table p",$(Domthis), "black");//默认更改文字颜色
	// 始终上下居中函数
	novImgCenter($(Domthis));
	// 关闭函数
	$(".nov-table button").click(function(){
		novCloseMethod(defaultC);
	} );
	
}

function NovImg() {
	// 添加图片盒子的点击事件
	$(".nov-img-box img").click(function() {
		novFunction(this, $(".nov-table").css("background-color"));
	});
}


function NovImgSingle() {
	// 添加单独图片的点击事件
	$(".nov-img-single").click(function() {
		novFunction(this, $(".nov-table").css("background-color"));
	});
};

(function novImgMain() {
	if(typeof jQuery == 'undefined'){//检测jq
	//如果没有引入jq,则输出报错信息
		alert(' NovImg.js : No introduction of JQuery!\n Please press F12 to view the error message in console.');
		console.error('No introduction of JQuery!please load jQuery before NovImg.js .');
		console.warn('For example:<script src="http://code.jquery.com/jquery-2.1.0-rc1.min.js" type="text/javascript" charset="utf-8"></script>');
		console.warn('You can also use NovImg javascript version. http://www.docomo.ltd/');

	}else{
		var novImgJudge = 0;
		if ($(".nov-img-box").length > 0) {
			novImgJudge = initNovImgJudge(novImgJudge); //判断是否初始化过
			NovImg();
		}
		if ($(".nov-img-single").length > 0) {
			novImgJudge = initNovImgJudge(novImgJudge); //判断是否初始化过
			NovImgSingle();
		}
	}
		
})();
