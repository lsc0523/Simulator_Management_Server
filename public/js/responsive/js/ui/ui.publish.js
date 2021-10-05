var pub = {
	init: function(){
		this.setHeader();
		this.setAside();
	},
	setHeader: function(){
		var headerHTML = ''
		+'			<!-- SkipNav -->'
		+'			<div class="skipNav">'
		+'				<a href="#content">Skip Navigation Go Content</a>'
		+'			</div>'
		+'			<!-- //SkipNav -->'
		+''
		+'			<div class="header-inner">'
		+'				<div class="logo-area">'
		+'					<h1 class="logo">시뮬레이터 관리 시스템</h1>'
		+'				</div>'
		+'				<div class="gnb-area">'
		+'					<nav class="gnb">'
		+'						<ul class="node-list">'
		+'							<li class="node-item is-current"><a href="javascript:void(0)" class="node-link type-menu1">DASHBOARD</a></li>'
		+'							<li class="node-item"><a href="javascript:void(0)" class="node-link type-menu2">시뮬레이터</a></li>'
		+'							<li class="node-item"><a href="javascript:void(0)" class="node-link type-menu3">교육 결과</a></li>'
        +'							<li class="node-item"><a href="javascript:void(0)" class="node-link type-menu4">기준정보 관리</a></li>'
		+'						</ul>'
		+'					</nav>'
		+'				</div>'
		+'				<div class="util-area">'
		+'					<button type="button" class="btn btn-logout"><span>LOGOUT</span></button>'
		+'				</div>'
		+'			</div>';
		$('.only-pub .header').each(function(){ $(this).html(headerHTML) });
	},
	setAside: function(){
		var asideHTML = ''
		+'		<div class="aside-inner">'
		+'			<div class="aside-head">'
		+'				<h2 class="h-tit">Aside Title</h2>'
		+'			</div>'
		+'		</div>';
		// +'		<div class="aside-toggle">'
		// +'			<button type="button" class="btn btn-aside-toggle"><span>Aside Toggle</span></button>'
		// +'		</div>';
		$('.only-pub .aside').each(function(){ $(this).html(asideHTML) });
	}
}
$(function(){
	pub.init();
});
