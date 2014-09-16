(function(){

	// here lives the 3d slot machine!!

	function SlotMachine(id){
		this.id = id;
		this.slideCount = 9;
		this.reelCount = 3;
		this.reelRadius = 200; // px
		this.slideDegrees = 360/this.slideCount;
		this.winOverlayDelay = 4000;
		this._winTimeout;

		this._initializeDOM();
		this._generateCSS();
	}

	// makes the reel and slides, unpositioned. also adds the spin button
	SlotMachine.prototype._initializeDOM = function(){
		var reelHTML = "";
		var drink_object = ["maker","tool", "ingredient"];
		var drink_type = ["coffee", "tea", "espresso"];


		for (var reel = 0; reel < this.reelCount; reel++){

			reelHTML += "<div class='reel " + drink_object[reel]+ "' id=reel-" + reel + ">";
			for (var slide = 0; slide < this.slideCount; slide++){

				reelHTML += "<div class='slide " + drink_type[slide%3] + "' id=slide-" + slide + "></div>";
			}
			reelHTML += "</div>";
		}
		$('#' + this.id).append(reelHTML);
		$('#' + this.id).parent().append("<div id='spin-button'> Spin</div>");

		$('#spin-button').click(function(e){
			this.spin();
		}.bind(this));
	}

	// generates the css that makes the slotmachine 3d-ified
	SlotMachine.prototype._generateCSS = function() {
		var transformProperty = Modernizr.prefixed('transform');
		var transformOriginProperty = Modernizr.prefixed('transform-origin');
		var relative_rotation_deg = this.slideDegrees; // deg

		for (var reel_id = 0; reel_id < this.reelCount; reel_id++){
			for (var slide_id = 0; slide_id < this.slideCount; slide_id++){

				var slide = $('#reel-'+ reel_id + ' #slide-' + slide_id)[0];
				var total_rotation = relative_rotation_deg * slide_id;

				slide.style[transformProperty] = 'rotateX('+ total_rotation + 'deg) translateZ(' + this.reelRadius + 'px)';
			}
		}
		$('#' + this.id)[0].style[transformProperty] = 'translateZ(-' + this.reelRadius + 'px)'; 
	}

	// spins the reels in 3d! woo
	SlotMachine.prototype.spin = function() {
		var transformProperty = Modernizr.prefixed('transform');

		var getRandomInt = function(min, max) { //min inclusive, max exclusive
 		   return Math.floor(Math.random() * (max - min + 1)) + min;
		}


		var reels = [];
		for (var i = 0; i < this.reelCount; i++){
			reels.push($('#reel-' + i)[0]);
		}

		// holds the slide index that the reel lands on
		// for _detectWinner
		var reel_indices = [];

		// transforms each slide in 3d
		for (var i = 0; i < reels.length; i++){
			var reel = reels[i];
			var slide_to_rotate = getRandomInt(10, 24);
			
			reel.style[transformProperty] = "rotateX( " + this.slideDegrees * slide_to_rotate + "deg)";

			reel_indices.push(9 - (this.slideDegrees * slide_to_rotate)%360 / this.slideDegrees % 9);
		}

		this._detectWinner(reel_indices);
	}


	// boolean logic to detect winner and throw
	// up basic overlay
	SlotMachine.prototype._detectWinner = function(reel_indices){
		var winner = "";
		if (reel_indices[0]%3 == reel_indices[1]%3 &&
			reel_indices[1]%3 == reel_indices[2]%3){
			// winner!
			if (reel_indices[0]%3 == 0){
				winner = "coffee";
			}

			if (reel_indices[0]%3 == 1){
				winner = "tea";
			}

			if (reel_indices[0]%3 == 2){
				winner = "espresso";
			}
		}

		if (this._winTimeout){
			clearTimeout(this._winTimeout);
		}

		if (winner != ""){

			this._winTimeout = setTimeout(function(){
				var overlay_html = "";
				overlay_html  = "<div class='winner-overlay-container'>";
				overlay_html += "   <div class='overlay'>";
				overlay_html += "       <div class='winner-text'>You've just won " +  winner + "!</div>";
				overlay_html +=	"       <div class='winner-" + winner + "'></div>";
				overlay_html +=	"   </div>";
				overlay_html += "</div>";

				var overlay = $(overlay_html)
				overlay.hide().prependTo('body').fadeIn(500);
				overlay.click(function(e){
					overlay.fadeOut(500, function(){
						overlay.remove();	
					})
				})
			}, this.winOverlayDelay);
		}
	}


	// ready set go!
	$(document).ready(function(){
		var slotMachine = new SlotMachine('slotmachine-container');

	})

})();