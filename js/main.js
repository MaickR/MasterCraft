(function($) {
	jQuery(document).ready(function($) {
		$('.ofm li.m_nav').on('click', function() {
			$(".mobi-menu").slideToggle("slow");
			$(this).find(".mobi-menu").slideToggle("slow");
		}
		);
		$('#cssmenu li.has-sub>a').on('click', function() {
			$(this).removeAttr('href');
			var element = $(this).parent('li');
			if (element.hasClass('open')) {
				element.removeClass('open');
				element.find('li').removeClass('open');
				element.find('ul').slideUp();
			} else {
				element.addClass('open');
				element.children('ul').slideDown();
				element.siblings('li').children('ul').slideUp();
				element.siblings('li').removeClass('open');
				element.siblings('li').find('li').removeClass('open');
				element.siblings('li').find('ul').slideUp();
			}
		});
		$('#cssmenu>ul>li.has-sub>a').append('<span class="holder"></span>');
		(function getColor() {
			var r, g, b;
			var textColor = $('#cssmenu').css('color');
			textColor = textColor.slice(4);
			r = textColor.slice(0, textColor.indexOf(','));
			textColor = textColor.slice(textColor.indexOf(' ') + 1);
			g = textColor.slice(0, textColor.indexOf(','));
			textColor = textColor.slice(textColor.indexOf(' ') + 1);
			b = textColor.slice(0, textColor.indexOf(')'));
			var l = rgbToHsl(r, g, b);
			if (l > 0.7) {
				$('#cssmenu>ul>li>a').css('text-shadow', '0 1px 1px rgba(0, 0, 0, .35)');
				$('#cssmenu>ul>li>a>span').css('border-color', 'rgba(0, 0, 0, .35)');
			} else {
				$('#cssmenu>ul>li>a').css('text-shadow', '0 1px 0 rgba(255, 255, 255, .35)');
				$('#cssmenu>ul>li>a>span').css('border-color', 'rgba(255, 255, 255, .35)');
			}
		})();

		function rgbToHsl(r, g, b) {
			r /= 255, g /= 255, b /= 255;
			var max = Math.max(r, g, b),
				min = Math.min(r, g, b);
			var h, s, l = (max + min) / 2;
			if (max == min) {
				h = s = 0;
			} else {
				var d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch (max) {
					case r:
						h = (g - b) / d + (g < b ? 6 : 0);
						break;
					case g:
						h = (b - r) / d + 2;
						break;
					case b:
						h = (r - g) / d + 4;
						break;
				}
				h /= 6;
			}
			return l;
		}
	});
	
	jQuery(document).ready(function($){
		// Product Carousels - Auto-play without navigation arrows
		$("#owl-example").owlCarousel({
			autoPlay: 3000,
			stopOnHover: true,
			items : 4,
			itemsDesktop : [1000,4],
			itemsDesktopSmall : [900,3],
			itemsTablet: [600,2],
			itemsMobile : [480,1],
			pagination: false,
			navigation: false
		});
		$("#owl-example-two").owlCarousel({
			autoPlay: 3500,
			stopOnHover: true,
			items : 4,
			itemsDesktop : [1000,4],
			itemsDesktopSmall : [900,3],
			itemsTablet: [600,2],
			itemsMobile : [480,1],
			pagination: false,
			navigation: false
		});
		$("#owl-example-three").owlCarousel({
			autoPlay: 4000,
			stopOnHover: true,
			items : 4,
			itemsDesktop : [1000,4],
			itemsDesktopSmall : [900,3],
			itemsTablet: [600,2],
			itemsMobile : [480,1],
			pagination: false,
			navigation: false
		});
		$("#owl-example-four").owlCarousel({
			autoPlay: 3000,
			stopOnHover: true,
			items : 4,
			itemsDesktop : [1000,4],
			itemsDesktopSmall : [900,3],
			itemsTablet: [600,2],
			itemsMobile : [480,1],
			pagination: false,
			navigation: false
		});
		$("#owl-example1").owlCarousel({
			autoPlay: 3200,
			stopOnHover: true,
			items : 4,
			itemsDesktop : [1000,4],
			itemsDesktopSmall : [900,3],
			itemsTablet: [600,2],
			itemsMobile : [600,1],
			pagination: false,
			navigation: false
		});
		$("#owl-example2").owlCarousel({
			autoPlay: 3400,
			stopOnHover: true,
			items : 4,
			itemsDesktop : [1000,4],
			itemsDesktopSmall : [900,3],
			itemsTablet: [600,2],
			itemsMobile : [600,1],
			pagination: false,
			navigation: false
		});
		$("#owl-example3").owlCarousel({
			autoPlay: 3600,
			stopOnHover: true,
			items : 4,
			itemsDesktop : [1000,4],
			itemsDesktopSmall : [900,3],
			itemsTablet: [600,2],
			itemsMobile : [600,1],
			pagination: false,
			navigation: false
		});
		$("#owl-example4").owlCarousel({
			autoPlay: 3800,
			stopOnHover: true,
			items : 4,
			itemsDesktop : [1000,4],
			itemsDesktopSmall : [900,3],
			itemsTablet: [600,2],
			itemsMobile : [600,1],
			pagination: false,
			navigation: false
		});
		$("#owl-example-single").owlCarousel({
			autoPlay: 3000,
			stopOnHover: true,
			center: true,
			items: 4,
			pagination: false,
			navigation: false
		});
		// Branding Carousel - Auto-play, smooth, no controls
		$("#branding_caro").owlCarousel({
			autoPlay: 2500,
			stopOnHover: true,
			items : 6,
			itemsDesktop : [1200,5],
			itemsDesktopSmall : [992,4],
			itemsTablet: [768,3],
			itemsMobile : [480,2],
			pagination: false,
			navigation: false,
			slideSpeed: 300,
			paginationSpeed: 400
		});
		// accordion
		
		$('.collapse').on('shown.bs.collapse', function(){
			$(this).parent().find(".fa fa-plus").removeClass("fa fa-plus").addClass("fa fa-minus");
			}).on('hidden.bs.collapse', function(){
			$(this).parent().find(".fa fa-minus").removeClass("fa fa-minus").addClass("fa fa-plus");
		});
		$('#collapseTwo').collapse('show')
		$('#collapseThree').collapse('show')
		$('#collapseFour').collapse('show')
		$('#collapseFive').collapse('show')
		$('#collapseOneP').collapse('show')
		$('#collapseThreeP').collapse('show')
		
		//product image with tab and zoom - only if elevateZoom is available
		if (typeof $.fn.elevateZoom !== 'undefined') {
			$("#zoom_01").elevateZoom({scrollZoom : true, easing:true});
			$("#zoom_07").elevateZoom({scrollZoom : true, easing:true});
			$("#zoom_02").elevateZoom({tint:true, tintColour:'#FF6766', tintOpacity:0.0, easing:true});
			$("#zoom_03").elevateZoom({tint:true, tintColour:'#FF6766', tintOpacity:0.0, easing:true});
			$("#zoom_04").elevateZoom({tint:true, tintColour:'#FF6766', tintOpacity:0.0, easing:true});
		}
		
	});
	
	 
})(jQuery);




