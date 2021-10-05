/*--------------------------------------------------------------
	@Util - 유틸리티
--------------------------------------------------------------*/
//콘솔뷰
var consoleLog = function(value){
	var delay = 3000;
	var setTime = null;
	var consoleHTML = '<div class="consoleLog"><div class="consoleLog-scroll"></div></div>';
	if ($('.consoleLog').length == 0){$('body').append(consoleHTML)}
	$('.consoleLog-scroll').append('<span class="consoleLog-item">'+value+'</span>');
	clearTimeout(setTime);
	setTime = setTimeout(function(){$('.consoleLog').fadeOut('fast', function(){$(this).remove()})}, delay);
}
// 실제값의 퍼센트 구하기 (실제값/최대값 * 100%)
var getPercent = function(val, max){
	var value = (val/max) * 100;
	return value;
}
// 퍼센트로 실제값 구하기 (퍼센트/100% * 최대값)
var getValue = function(val, max){
	var value = (val/100) * max;
	return value;
}
// 퍼센트 제외값 구하기 (최대값 - (퍼센트/100% * 최대값)
var getRemain = function(val, max){
	var value = max - ((val/100) * max);
	return value;
}
// 정규식 반환
var getRegExec = function(reg, str){
	return reg.exec(str);
}
// 정규식 확인
var getRegTest = function(reg, str){
	return regex.test(str);
}
// 숫자 반올림
var getNumRound = function(val, lens){
	return Math.round(val/lens) * lens;
}
// 숫자 올림
var getNumCeil = function(val, lens){
	return Math.ceil(val/lens) * lens;
}
// 숫자 내림
var getNumFloor = function(val, lens){
	return Math.floor(val/lens) * lens;
}
// 숫자 콤마변환
var getNumComma = function(val){
	return val.toLocaleString();
}
// 숫자 콤마삭제
var getNumCommaDel = function(val){
	var num = parseFloat(val.replace(/,/gi,""));
	if (isNaN(num)){return 0} else {return num}
}
// 소수점 변환
var getNumDecimal = function(val){
	return getRegTest('^[+-]?\d*(\.?\d*)$', val);
}
// 파라미터값 구하기
var getParamiter = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results==null){
		return null;
	} else {
		return results[1] || 0;
	}
}
// Ajax 로드
var callAjaxLoad = function(selector, frmName, callUrl, callback){
	var dataString = $("#"+frmName).serialize();
	$(selector).load(callUrl, dataString, callback);
}
// Ajax 실행
var callAjax = function(target, frmName, sendUrl, callback) {
	var dataString = $("#"+frmName).serialize();
	$.ajax({
		type:"POST",
		url:sendUrl,
		cache:false,
		async:false,
		dataType:"html",
		data:dataString,
		timeout:6000,
		success:function(data){
		// 통신이 성공적으로 이루어졌을때 이 함수를 타게 된다.
		$("#"+target).html(data);
			if (callback !==""){
				callback;
			}
		},
		/*complete:function(data){
		// 통신이 실패했어도 완료가 되었을때 이함수를 타게된다.
		// success 와 complete 둘 중 하나만 이용, 그렇지 않으면 두번실행
		},*/
		error:function(xhr, status, error){
		}
	});
}
// Document Target Length
var callThisTarget = function($this, callback){
	$(document).on('click focusin', function(e){
		if ($this.has(e.target).length == 0){
			if (callback){ callback() }
		}
	});
}
// Document Target Selector
var callChildTarget = function($this, callback){
	$(document).on('click focusin', function(e){
		if ($(e.target).is($this) == false){
			if (callback){ callback() }
		}
	})
}
// Body Fixed
var bodyScroll = {
	clsFixed : 'is-bodyFixed',
	scrTop : null,
	fixed : function(){
		this.scrTop = $(window).scrollTop();
		$('html, body').addClass(this.clsFixed);
		$('body').scrollTop(this.scrTop);
	},
	static : function(){
		$('html, body').removeClass(this.clsFixed);
		$(window).scrollTop(this.scrTop);
	}
}
// Dimmer
var dimmer = {
	eleModule : '.dimmer',
	lens      : 0,
	open : function(selector, duration){
		var _this = this;
		_this.lens = _this.lens + 1;
		//처음호출할때 생성
		if ($(_this.eleModule).length == 0){
			$('body').append('<div class="dimmer" aria-hidden="true"></div>');
			$(_this.eleModule).addClass(_this.selector).addClass('is-visible'); //투명상태로 활성화
			TweenMax.to($(_this.eleModule), duration, {opacity:1, ease:Power3.easeOut}); //효과 진행
		}
		//기본실행
		$(_this.eleModule).attr('data-lens', _this.lens).addClass(selector);
	},
	close : function(selector, duration){
		var _this = this;
		_this.lens = _this.lens - 1;
		if (_this.lens == 0){
			TweenMax.to($(_this.eleModule), duration, {opacity:0, ease:Power3.easeOut, onComplete:function(){
				$(_this.eleModule).remove();
			}});
		}
	}
}