(function ($) {

	console.log ("imagesSRC loaded");

	$.fn.imagesSRC = function (options) {
	
		console.log("imagesSRC run");
	
		var settings = $.extend({
				dataSRC: "data-src",
				selector: "img[data-src]",
				delay: 1000,
				prefix: "/img/",
				extension: ".jpg",
				typePrefix: "responsive_",
				typeSelector: "#container",
				types: ["small", "middle", "standard", "big", "huge"],
				speed: [0,0,10000,10000,10000],
				timer: true
			}, options),
			images = [],
			elements = [],
			active = -1,
			type = -1,
			lastUpdate = 0,
			i = 0, j = 0,
			timer = null;	
		
		elements = $(settings.selector);
		
		for (i = 0; i < elements.length; i++) {
			var $img = $(elements[i]);
			
			var o = {
				element: $img,
				link: $img.attr(settings.dataSRC),
				sizes: []
			};
			
			for (j = 0; j < settings.types.length; j++) {
				var size = {
					name: settings.types[j],
					loaded: false,
					url: settings.prefix + o.link + "/" + settings.types[j] + settings.extension
				};
				
				o.sizes.push(size);
			}
			
			images.push(o);
			
		}
		
		function onResize () {
			
			var newType = $(settings.typeSelector).attr("class").split(" ");
			
			for (i = 0; i < newType.length; i++) {
				for (j = 0; j < settings.types.length; j++) {
				
					if (newType[i] === settings.typePrefix + settings.types[j]) {
					
						if (type !== j) {
						
							type = j;
							checkLoad();
						}
					}
				}
			}
		}
		
		function checkLoad () {
			if (active === -1) {
				active = 0;
			}
			
			console.log (images);
				
			preload (active, type, true);
		}
		
		function preload (active, type, primary) {
		
			if (images[active].sizes[type].loaded === true) {
				
				console.log ("image", images[active].sizes[type].url, "already loaded");
				activate (images[active].element, images[active].sizes[type].url, primary);
					
				if (primary === true && settings.speed[type] > 0) {
					preloadOthers (active);
				}
				
			} else {
				
				console.log ("image", images[active].sizes[type].url, "not yet loaded");
				
				$(images[active].element).load (images[active].sizes[type].url, function () {
				
					images[active].sizes[type].loaded = true;
					activate (images[active].element, images[active].sizes[type].url, primary);
					
					if (primary === true && settings.speed[type] > 0) {
						preloadOthers (active);
					}
					
				});
				
			}
		}
		
		function preloadOthers (except) {
			for (i = 0; i < images.length; i++) {
				if (i !== except) {
					preload (i, type);
				}
			}
		}
		
		function activate (img, src, primary) {
			$(img).attr("src", src);
			if (primary === true) {
				setActive (img);
			}
			
			console.log ("image", src, "activated");
		}
		
		function setActive (img) {
			$(elements).removeClass("active");
			$(img).addClass("active");
			
			lastUpdate = new Date();
			
			if (timer === null && settings.timer === true) {
				console.log ("creating timer");
				timer = window.setInterval(run, settings.delay);
			}
		}
		
		function run () {
			
			if (settings.speed[type] === 0) {
				return;
			}
			
			if (settings.speed[type] < (new Date()).getTime() - lastUpdate.getTime()) {
				lastUpdate = new Date();
				
				activateNext (active);
			}

		}
		
		function activateNext (id) {
		
			if (id + 1 === images.length) {
				id = 0;
			} else {
				id = id + 1;
			}
			
			if (images[id].sizes[type].loaded === true) {
				active = id;
				setActive ($(images[id].element));
			} else {
				activateNext (id);
			}
		}
			
		$(window).resize(onResize);
		
		onResize();
		
	};
	
})(jQuery);