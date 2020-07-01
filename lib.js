var i = {
	// initialise
	init: function() {
		$('#btn_make').click(i.makeImage);
		i.makeImage();
		$('#btn_python').click(i.showPython);
	},

	// generate python code and send to create.withcode.uk
	showPython: function() {
		// generate python code
		var python = "import withcode\n";
		python += "data = [";
		for(var y = 0; y < i.size; y++) {
			python += '[';
			for(var x = 0; x < i.size; x++) {
				var bit = $('#px_' + x + '_' + y).hasClass('black');
				python += bit?'0':'1';
				if(x < i.size-1) {
					python += ', ';
				}
			}
			python += ']';
			if(y < i.size - 1) {
				python += ',\n\t\t';
			}
		}
		python += "]\n";
		python += "i = withcode.Image()\n";
		python += "i.draw(data)";

		// set form data
		$('#python_code').val(python);
		
		// post form data to create.withcode.uk
		$('#python_form').submit();

		// set the height of the iframe (to make it visible)	
		$('#python_frame').show();
	},
	
	// updates binary / hex / rle values
	update: function() {
		var html = "";
		var bytes = [];
		var bits = [];
		for(var y = 0; y < i.size; y++) {
			var c = 0;
			var digits = "";
			for(var x = 0; x < i.size; x++) {
				var bit = $('#px_' + x + '_' + y).hasClass('black');
				digits += bit?'0':'1';
				bits.push(bit);
				c++;
				if(c % 8 == 0) {
					bytes.push(parseInt(digits, 2));
					html += digits + " ";
					digits = "";
				}
						
			}
			if(digits.length > 0) {
				while(digits.length < 8) {
					digits += "1";
				}
				bytes.push(parseInt(digits, 2));
				html += digits + " ";
			}
		}
		$('#bin_value').html(html);
		
		html = '';
		var hex = '';
		for(var c = 0; c < bytes.length; c++) {
			html += bytes[c] + " ";
			var b = bytes[c].toString(16).toUpperCase(); 
			while(b.length < 2) {
				b = '0' + b;
			}
			hex += b + " ";
		}
		$('#dec_value').html(html);
		$('#hex_value').html(hex);
		if(hex == "FF C7 F7 C7 DF FF DF FF ") {
			alert("The password is cheese");
		}
		
		html = '';
		var count = 0;
		var state = bits[0];
		for(var c = 0; c < bits.length; c++) {
			if(bits[c] == state) {
				count++;
			} else {
				html += count + (state?"B":"W") + " ";
				count = 1;
				state = bits[c];
			}
		}
		html += count + (state?"B":"W");
		$('#rle_value').html(html);
		
	},
	
	// called when window resizes
	resize: function() {
		var w = $('#px_0_0').width();
		if(w > 0)
			$('.px').css({'height':w});
	},
	
	// called when user clicks on a cell to toggle black / white
	toggleCell: function(e) {
		$('#' + e.currentTarget.id).toggleClass('black');
		i.update();
	},
	
	// generate a grid of pixels of a given size
	makeImage: function() {
		var size = parseInt($('#size').val());
		if(size > 0) {
			i.size = size;
			var html = '<table>';
			for(var y = 0; y < size; y++) {
				html += '<tr>'
				for(var x = 0; x < size; x++) {
					html += '<td class="px" id="px_' + x + '_' + y + '"></td>';
				}
				html += '</tr>';
			}
			$('#image_holder').html(html);
			$('.px').click(i.toggleCell);
			i.update();
			i.resize();
		}
	}
};
$(function() {
	i.init();
	$(window).resize(i.resize);
	i.resize();
});