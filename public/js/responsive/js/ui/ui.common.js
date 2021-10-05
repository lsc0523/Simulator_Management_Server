/*-------------------------------------------------------------------
	분류순서
	- @Variables	: 전역변수
	- @Init			: 초기실행
	- @Settings		: 기본설정
	- @Utility		: 유틸기능
	- @Layout		: 레이아웃
	- @Components	: 컴포넌트
	- @Content		: 컨텐츠
-------------------------------------------------------------------*/
/*-------------------------------------------------------------------
	@Variables
-------------------------------------------------------------------*/
//Elements
var	$window			= null,
	$document		= null,
	$html			= null,
	$body			= null,
	$html_body		= null,
	$wrapper		= null,
	$header			= null,
	$dimmer			= null,
	$activeFocus	= null,
_;

//Devices
var isIOS			= browser.os == 'ios',
	isANDROID		= browser.os == 'android',
	isMOBILE		= browser.mobile == true,
	isPC			= browser.mobile == false,
_;

var ui = {
	/*---------------------------------------------------------------
		@Init
	---------------------------------------------------------------*/
	/* 기본실행 */
	init: function(){
		/* Settings */
		this.setElements();		// 엘리먼트 공통
		this.setDevices();		// 디바이스 확인
		this.setEvents();		// 이벤트 설정
	},
	
	/* 비동기실행 */
	update: function(){
		/* Layout */
		this.aside.init();		// 사이드메뉴
		this.snb.init();		// 서브메뉴

		/* Components */
		this.waveEffect();		// 버튼효과
		this.datepicker.init();
		this.customScroll.init();
		this.acco.init();
		this.tab.init();
		this.drop.init();
		this.collapse.init();
		
		/* Content */
		this.goTop();
	},
	
	/*---------------------------------------------------------------
		@Settings
	---------------------------------------------------------------*/
	/* 엘리먼트 설정 */
	setElements: function(){
		$window		= $(window);
		$document	= $(document);
		$html		= $('html');
		$body		= $('body');
		$html_body	= $('html, body');
		$wrapper	= $('.wrapper');
		$header		= $('.header');
		$dimmer		= $('.dimmer');
		$document.off('focusin.eleEvent click.eleEvent').on('focusin.eleEvent click.eleEvent', function(e){
			$activeFocus = $(e.target);
		})
	},

	/* 디바이스설정 - OS, Version, Browser */
	setDevices: function(){
		var cls = 'dv-';
		var browserDevice = function(){ return browser.mobile == true ? 'mobile' : 'pc' }
		var clsBrowser = ''
			+ cls + browser.name
			+ ' ' + cls + browser.name + browser.version
			+ ' ' + cls + browser.os
			+ ' ' + cls + browser.os + Math.floor(browser.osVersion)
			+ ' ' + cls + browserDevice();
		$body.addClass(clsBrowser);
	},

	/* 이벤트설정 */
	setEvents: function(){
		//Init
		scrTop = scrTopStart = $window.scrollTop();
		var scrPosition = function(val){
			//스크롤 처음확인
			if (val == 0){
				isScrFirst = true;
				$body.addClass('is_scrollFirst');
			} else {
				isScrFirst = false;
				$body.removeClass('is_scrollFirst');
			}
			//스크롤 마지막확인
			if (val + $window.outerHeight() == $document.height()){
				isScrLast = true;
				$body.addClass('is_scrollLast');
			} else {
				isScrLast = false;
				$body.removeClass('is_scrollLast');
			}
		}
		scrPosition(scrTop);

		//Scrolled
		var scrollEndTime;
		var isScrolled = false;
		var oldScrTop = scrTop;
		$window.off('scroll.customEvent').on('scroll.customEvent', function(){
			var curScrTop = $window.scrollTop();

			//스크롤 방향
			if (oldScrTop > curScrTop){
				$window.trigger('scrollUp');
				$body.addClass('is_scrollUp').removeClass('is_scrollDown');
			} else if (oldScrTop < curScrTop){
				$window.trigger('scrollDown');
				$body.addClass('is_scrollDown').removeClass('is_scrollUp');
			}
			oldScrTop = curScrTop;

			//스크롤 종료
			clearTimeout(scrollEndTime);
			scrollEndTime = setTimeout(function(){
				isScrolled = false;
				scrTop = scrTopEnd = curScrTop;
				$window.trigger('scrollEnd');
			}, 100);

			scrPosition(curScrTop);
		});

		//Resized
		var resizeEndTime;
		$window.off('resize.customEvent').on('resize.customEvent', function(){
			clearTimeout(resizeEndTime);
			resizeEndTime = setTimeout(function(){
				$window.trigger('resizeEnd');
			}, 100);
		});
	},

	/*---------------------------------------------------------------
		@Utility
	---------------------------------------------------------------*/
	/* 스크롤설정 */
	setScroll: {
		//스크롤 비활성
		disable: function(cls){
			$body.addClass(cls);
		},
		//스크롤 활성화
		enable: function(cls){
			$body.removeClass(cls);
		},
	},

	/*---------------------------------------------------------------
		@Layout
	---------------------------------------------------------------*/
	// Aside
	aside: {
		clsClose: 'is-aside-close',
		clsOpen: 'is-aside-open',
		isState: 'opened',
		init: function(){
			this.event();
		},
		event: function(){
			var self = this;
			$document.off('click.asideEvent').on('click.asideEvent', '.btn-aside-toggle', function(e){ 
				var $aside = $('.aside');
				if ($body.hasClass(self.clsClose)){
					self.open($aside, $(this));
					$aside.data('custom', 'opened');
				} else {
					self.close($aside, $(this));
					$aside.data('custom', 'closed');
				}
			});
		},
		open: function($aside, $btn){
			var self = this;
			self.isState = 'opened';
			$btn.attr('aria-expanded','true');
			$body.removeClass(self.clsClose);
			$aside.attr('aria-hidden','false').find('.aside-inner').removeClass('is-hidden');
			$aside.on('transitionend', function(){
				if (!$body.hasClass(self.clsClose)){
					$window.trigger('pageResizeEnd');
				}
			});
		},
		close: function($aside, $btn){
			var self = this;
			self.isState = 'closed';
			$btn.attr('aria-expanded', 'false');
			$body.addClass(self.clsClose);
			$aside.attr('aria-hidden', 'true').on('transitionend', function(){
				if ($body.hasClass(self.clsClose)){
					$aside.find('.aside-inner').addClass('is-hidden');
					$window.trigger('pageResizeEnd');
				}
			});
		},
	},

	// Submenu
	snb: {
		init: function(){
			this.event();
		},
		event: function(){
			var self = this;
			$document.off('click.snb').on('click.snb', '.btn-snb-toggle', function(e){
				$(this).closest('.snb-group').toggleClass('is-folded');
			})
		},
	},

	/*---------------------------------------------------------------
		@Mudule
	---------------------------------------------------------------*/
	// 버튼 웨이브효과
	waveEffect: function(){
		var events = null;
		var ele = '.btn';
		$document.off('mousedown.waveEffectEvent touchstart.waveEffectEvent').on('mousedown.waveEffectEvent touchstart.waveEffectEvent', ele, function(e) {
			events = 'mousedown';
			var self = $(this),
				wave = '.effect-wave',
				btnWidth = self.outerWidth();
			if (e.type == 'mousedown'){ var x = e.offsetX, y = e.offsetY }
			if (e.type == 'touchstart'){ var x = e.touches[0].pageX - self.offset().left, y = e.touches[0].pageY - self.offset().top }
			if (self.find(wave).length == 0){
				self.prepend('<i class="effect-wave"></i>');
				$(wave).css({'top': y, 'left': x}).stop().animate({width: btnWidth * 4, height: btnWidth * 4 }, 300, function(){
					$(this).addClass('is-complete');
					if (events == 'mouseup'){
						$(this).stop().animate({opacity: '0'}, 200, function() {
							$(this).remove();
						});
					}
				});
			}
		})
		$document.off('mouseup.waveEffectEvent touchend.waveEffectEvent').on('mouseup.waveEffectEvent touchend.waveEffectEvent', ele, function(e) {
			events = 'mouseup';
			var self = $(this),
				wave = '.effect-wave';
			if (self.find(wave).hasClass('is-complete')){
				$(wave).stop().animate({opacity: '0'}, 200, function() {
					$(this).remove();
				})
			}
		})
		$document.off('click.waveEffectEvent focusin.waveEffectEvent').on('click.waveEffectEvent focusin.waveEffectEvent', function(e) {
			if ($(e.target).is(ele) == false && $('.effect-wave').length){
				$('.effect-wave').stop().animate({opacity: '0'}, 200, function() {
					$(this).remove();
				})
			}
		})
	},

	/* Datepicker */
	datepicker: {
		init: function(){
			var self = this;
			$('.input-extend.type-date').each(function(){
				var id = $(this).find('input').attr('id');
				self.update(id);
			});
			this.event();
		},
		event: function(){
			$('#ui-datepicker-div').each(function(){
				var $this = $(this);
				$window.off('pageResizeEnd.datepicker resize.datepicker').on('pageResizeEnd.datepicker resize.datepicker', function(e){
					$this.hide();
				});
			})
		},
		update: function(id){
			if (id != undefined && id != ''){
				var $ele = $('#'+id);
				var maxNum = 99999;
				var minNum;
				var yearRangeBefore = '10';
				var yearRangeAfter = '10';
				var holidays = {}
				if ($ele.attr('data-today') == 'true'){ maxNum = 0 } //오늘까지
				if (parseInt($ele.attr('data-max')) >= 0){ maxNum = parseInt($ele.attr('data-max')) } //오늘까지
				if (parseInt($ele.attr('data-min')) >= 0){ minNum = parseInt($ele.attr('data-min')) } //오늘부터
				if ($ele.is('[data-range-before]')){ yearRangeBefore = $ele.data('range-before') } //이전연도범위
				if ($ele.is('[data-range-after]')){ yearRangeAfter = $ele.data('range-after') } //이후연도범위
				var optionDate = {
					closeText: '닫기',
					prevText: '이전달',
					nextText: '다음달',
					currentText: '오늘',
					monthNames: ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'],
					monthNamesShort: ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'],
					dayNamesMin: ['SUN','MON','TUE','WEN','TUR','FRI','SAT'],
					dateFormat: 'yy-mm-dd',
					yearSuffix: '',
					showMonthAfterYear: false,
					showButtonPanel: true,
					showOn: 'both',
					minDate: minNum,
					maxDate: maxNum,
					changeMonth: true,
					changeYear: true,
					yearRange:'c-'+yearRangeBefore+':c+'+yearRangeAfter, // 이전 이후로 얼마나 표시할지 결정
					//buttonImageOnly: false,
					buttonText: '달력',
					beforeShowDay: function(day){
						var result;
						var holiday = holidays[$.datepicker.formatDate("mmdd", day)];
						var thisYear = $.datepicker.formatDate("yy", day);
						if (holiday){
							if(thisYear == holiday.year || holiday.year == ""){
								result = [true, "ui-date-holiday", holiday.title];
							}
						}
						if (!result){
							switch (day.getDay()){
								case 0:
									result = [true, "ui-datepicker-sunday ui-datepicker-holiday"];
									break;
								case 6:
									result = [true, "ui-datepicker-saturday"];
									break;
								default:
									result = [true, ""];
									break;
							}
						}
						return result;
					},

				}
				$ele.datepicker(optionDate); //기본달력
				var disabled = function(){ $ele.next('.ui-datepicker-trigger').prop('disabled', true).addClass('is_disabled') }
				var enabled = function(){ $ele.next('.ui-datepicker-trigger').prop('disabled', false).removeClass('is_disabled') }
				$ele.prop('disabled') ? disabled() : enabled();
			} else {
				console.log('아이디가 없습니다.');
			}
		},
	},
	
	/* Auto Height */
	autoHeight: {
		action: function($this, h, attr){
			var posStart = $this.offset().top;
			var posEnd = $window.height();
			var setHeight = posEnd - posStart;
			var gapHeight;
			typeof(h) == 'number' ? gapHeight = h : gapHeight = 0;
			$this.css(attr, setHeight - gapHeight);
		}
	},

	/* Custom Scroller */
	customScroll: {
		init: function(){
			this.update();
			this.event();
		},
		event: function(){
			var self = this;
			$window.off('pageResizeEnd.customScroll resizeEnd.customScroll').on('pageResizeEnd.customScroll resizeEnd.customScroll', function(e){ 
				self.update();
			});
		},
		update: function(){
			$(".aside-scroll").each(function(){
				var $this = $(this);
				$this.mCustomScrollbar({scrollInertia: 200});
			});
			$(".content .tbl-body-scroll").each(function(){
				var $this = $(this);
				$this.mCustomScrollbar({scrollInertia: 200});
				if ($this.closest('.page-dashboard').length == 0) {
					if ($this.closest('.content').length){ 
						ui.autoHeight.action($this, 90, 'max-height');
						ui.autoHeight.action($this.find('.mCustomScrollBox'), 90, 'max-height');
					}
				}
			});
		},
	},

	/* Accordion */
	acco: {
		speed: 0,
		init: function(){
			var self = this;
			$document.off('click.accoEvent').on('click.accoEvent', '.acco-toggle', function(e){
				var $accoItem = $(this).closest('.acco-item'),
					$accoWrap = $(this).closest('.acco'),
					isActive = $accoItem.hasClass('is-active'),
					isToggle = $accoWrap.data('toggle'),
					isSync = $accoWrap.data('sync'),
					id = $(this).attr('aria-controls'),
					id_siblings = $accoItem.siblings('.is-active').find('.acco-cont').attr('id'),				
					// callback = function(){ getNewFunc($(this)) };
					callback = null;
	
				if (isActive && isToggle) { self.close(id, callback) }
				if (!isActive){ self.open(id, callback) }
				if (isSync){ self.close(id_siblings) }
			});
		},
		open: function(id, callback){
			var self = this;
			$('[aria-controls='+id+']').attr({'aria-expanded':'true'});
			$('#'+id).stop().hide().slideDown(self.speed, function(){
				$(this).attr({'aria-hidden':'false'});
				// setCallback(callback);
			}).closest('.acco-item').addClass('is-active');
		},
		close: function(id, callback){
			var self = this;
			$('[aria-controls='+id+']').attr({'aria-expanded':'false'});
			$('#'+id).stop().show().slideUp(self.speed, function(){
				$(this).attr({'aria-hidden':'true'});
				// setCallback(callback);
			}).closest('.acco-item').removeClass('is-active');
		},
	},

	/* Tab */
	tab: {
		init: function(){
			this.event();
		},
		event: function(){
			var self = this;
			$document.off('click.tabEvent').on('click.tabEvent', '.tab[data-id]', function(e){
				self.select($(this).data('id'));
			});
		},
		select: function(id, callback){
			var $eleTabItem = $('.tab[data-id="'+id+'"]');
			var $eleTabPanel = $('#'+id);
			if ($eleTabItem.length){ $eleTabItem.addClass('is-active').attr('aria-selected','true').siblings().removeClass('is-active').attr('aria-selected','false') }
			if ($eleTabPanel.length){ $eleTabPanel.addClass('is-active').siblings().removeClass('is-active') }
			if (callback){ typeof(callback) == 'function' ? callback() : callback; }
		}
	},

	drop: {
		speed: 100,
		init: function(){
			this.event();
			this.update();
		},
		update: function(){
			$('.drop-menu').each(function(){
				$(this).mCustomScrollbar({scrollInertia: 200});
			})
		},
		event: function(){
			var self = this;
			$document.off('click.dropEvent').on('click.dropEvent', 'button.drop-toggle', function(e){
				var $drop = $(this).closest('.drop');
				if ($drop.hasClass('is-active')){
					self.close($drop);
				} else {
					self.open($drop);
				}
			});
			$document.off('click.dropEvent3').on('click.dropEvent3', '.drop-menu li', function(e){
				if (!$(this).closeset('.drop-menu').hasClass('none-event')){
					var $drop = $(this).closest('.drop');
					self.selected($(this));
					self.close($drop);
				}
			})
			$document.off('focusin.dropEvent2 click.dropEvent2').on('focusin.dropEvent2 click.dropEvent2', function(e){
				$('.drop.is-active').each(function(){
					if ($(this).has(e.target).length === 0){ self.close($(this)) }
				})
			});
		},
		selected: function($item){
			var $btnSelected = $item.find('.btn');
			var $btnSiblings = $item.siblings().find('.btn');
			$btnSelected.attr('aria-selected', 'true').parent().addClass('is-selected');
			$btnSiblings.attr('aria-selected', 'true').parent().removeClass('is-selected');

			var $btnValued;
			if ($item.closest('.drop').hasClass('type-srch')){
				$btnValued = $item.closest('.drop').find('.input');
				$btnValued.val($btnSelected.text());
			} else {
				$btnValued = $item.closest('.drop').find('.drop-toggle span');
				$btnValued.text($btnSelected.text());
			}
		},
		open: function($drop, callback){
			var self = this;
			var $btn = $drop.find('.drop-toggle');
			// $('.drop.is-active').each(function(){ self.close($(this).data('id')) });
			$btn.attr({'aria-expanded':'true'});
			$drop.attr({'aria-hidden':'false'}).addClass('is-active');
			$drop.one('animationend', function(){
				if ($(this).hasClass('is-active')){
					if (callback){ typeof(callback) == 'function' ? callback() : callback; }
				}
			})
			//self.update();
		},
		close: function($drop, callback){
			var self = this;
			var $btn = $drop.find('.drop-toggle');
			$btn.attr({'aria-expanded':'false'});
			$drop.attr({'aria-hidden':'true'}).removeClass('is-active');
			$drop.one('animationend', function(){
				if (!$(this).hasClass('is-active')){
					if (callback){ typeof(callback) == 'function' ? callback() : callback; }
				}
			})
		},
	},

	collapse: {
		init: function(){
			this.event();
		},
		event: function(){
			$document.off('click.collapse').on('click.collapse', 'button.js-toggle', function(e){
				var id = $(this).data('id');
				$('#' + id).toggleClass('is-hidden');
				$(this).toggleClass('is-active');
			})
		},
	},

	/* 팝업 */
	popup: {
		$popArr: [],
		zIndexUnit: 1000,
		update: function(id){
			var self = this;
			var $popWrap = $('#'+id);
			$popWrap.find(".tbl-body-scroll").each(function(){
				var $this = $(this);
				$this.mCustomScrollbar({scrollInertia: 200});
			});
		},
		open: function(id, callback){
			var self = this;
			var $popWrap = $('#'+id);
			var $focus = $popWrap.find('.popup');
			$popWrap.data('opener', $activeFocus).addClass('is-active');
			$popWrap.one('transitionend', function(){
				if ($(this).hasClass('is-active')){
					ui.update();
					// $focus.attr('tabindex','0').focus();
					$popWrap.find('.popup-body').mCustomScrollbar({scrollInertia: 200});
					if (callback){ typeof(callback) == 'function' ? callback() : callback; }
				}
			});
			self.update(id);
			// if ($popWrap.find('.dimmer').length) { ui.dimmer.open($popWrap.find('.dimmer')) }
			
			//접근성초점
			ui.setScroll.disable('is-locked-popup');
			
			//다중팝업설정
			self.$popArr.push($popWrap);
			var zIndex = self.zIndexUnit + self.$popArr.length;
			$popWrap.css({'z-index':zIndex});
		},
		close: function(id, callback){
			var self = this;
			var $popWrap = $('#'+id);
			var $focus = null;
			if ($popWrap.data('opener') != null){
				$focus = $popWrap.data('opener');
			}
			$popWrap.removeClass('is-dimmer is-active').removeAttr('style');
			$popWrap.one('transitionend', function(){
				if (!$(this).hasClass('is-active')){
					//닫힌팜업 비활성화
					if ($focus != null){
						$focus.attr('tabindex','0').focus();
					}
					if (callback){ typeof(callback) == 'function' ? callback() : callback; }
				}
			});
			// if ($popWrap.find('.dimmer').length) { ui.dimmer.close($popWrap.find('.dimmer')) }
			
			//다중팝업 설정
			self.$popArr.pop();
			
			if (self.$popArr.length == 0){
				ui.setScroll.enable('is-locked-popup');
			}
		},
	},

	loading: {
		open: function(callback){
			var $loadingWrap = $('.loading-wrap');
			$loadingWrap.addClass('is-active');
			$loadingWrap.one('transitionend', function(){
				if ($(this).hasClass('is-active')){
					if (callback){ typeof(callback) == 'function' ? callback() : callback; }
				}
			});
			ui.setScroll.disable('is-locked-loading');
		},
		close: function(){
			var $loadingWrap = $('.loading-wrap');
			$loadingWrap.removeClass('is-active').removeAttr('style');
			ui.setScroll.enable('is-locked-loading');
		},
	},

	/* 파일첨부 */
	fileAttachSrc: function(obj, e){
		var $eleFormText = $(obj).parent().find('input[type=text]');
		if ($eleFormText){
			var fileValue = $(obj).val().split("\\");
			var fileName = fileValue[fileValue.length-1];
			$eleFormText.val(fileName);
		}
	},

	/*---------------------------------------------------------------
		@Content
	---------------------------------------------------------------*/
	goTop: function() {
		$('.btn-top').on('click', function() {
			$('html, body').stop().animate({scrollTop: 0}, 400);
		});
	},
	scrollMoveTo: function(moveTo) {
		var top = $('.' + moveTo).offset().top - 80;

		$('html, body').stop().animate({scrollTop: top}, 400);
	},
}
$(function(){
	ui.init();
	ui.update();
});
