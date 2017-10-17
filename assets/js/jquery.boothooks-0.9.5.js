bb = { 
	bsearch: {
		default: {
			minusDays: 14,
			plusDays: 14
		}
	},

	balert: {
		// todo - develop balert.getinfo to collect data
		default: {
			orientation: 'upper-left',
			position: 'alertPlaceholder',
			modalWidth: 400,
			warningModalHeight: 400,
			successTimeoutSec: 1
		},
		alertOptions: function(options, mode){
			this.options = {};
			this.options.message = options.message;
			this.options.position = (options.position == undefined) ?  this.default.position : options.position ;
			this.options.warningModalHeight = (options.warningModalHeight == undefined) ?  this.default.warningModalHeight : options.warningModalHeight;
			var modalWidth = (options.modalWidth == undefined) ? this.default.modalWidth : options.modalWidth ;
			var calcW = this.calcWidth(this.options.message, mode, this.options.position);
			this.options.modalWidth = (modalWidth < calcW) ? modalWidth : calcW ;
			this.options.orientation = ((options.orientation == undefined)) ? this.default.orientation : orientation;
			this.options.successTimeoutSec = (options.successTimeoutSec == undefined) ?  this.default.successTimeoutSec: options.successTimeoutSec ;
			return true;
		},	
		checkParms: function(options, width){
			var cleanOptions = options;
			if (typeof(options) == 'string') {
				cleanOptions = { message: options };
				if ( typeof(width) != undefined ) {
					cleanOptions.modalWidth = width
				}
			} else {
				if(typeof(options) != 'object') {
					alert('invalid parameter for alert box, must be either a message string or an object');
					return false;
				}
			};
			return cleanOptions;					
		},
		warning: function(options,width) {
			options = this.checkParms(options,width);
			this.alertOptions(options,'warning'); 
            var str = '<div id="serverResultModal" class="alert alert-block alert-error modal modal-body" '
            	+ ' style="display:block; background-color:wheat;  width:'+this.options.modalWidth+'px; height:'+this.options.warningModalHeight+'px; overflow:auto; margin:0px; z-index:10999" >' ;
            	// + ' class="pull-right">';
            str += '<span id="serverResultMsg" style="text-align:left">'+this.options.message+'</span>';
			str += '<div class="modal-footer" style="padding:0; background-color:wheat">'
				+ '<a class="btn-sm pull-right close" id="bbWarningBtn" style="margin: 15px 20px 0px 0px;" type="button" onclick="bb.balert.exit();return false">Close</a>'
				+ '</div>'
			str += '</div>';
			this.showServerResult('warning', str);
			// Add an overlay div to catch any clicks not inside the dialog.
       		$('body').prepend('<div class="bbAlertOverlay"></div>');
       		// If the overlay is clicked, hide the dialog and remove the overlay.
	        $('.bbAlertOverlay').click(function () {
	        	// todo - notify user to click the 'close' button. 	            bb.balert.exit();
	        	$("#bbWarningBtn").html('Click to close');
	        })
		},	
		ok: function(options,width) {
			// todo - allow height > 1 line of text, click-to-clear
			options = this.checkParms(options,width);
			this.alertOptions(options,'ok');
			var element='#'+this.options.position;
			var okHeight = ($(element).height()>5) ? $(element).height() : 15;
            var str = '<div id="serverResultModal" class="alert alert-success"';
            str += ' style="height:'+okHeight+'px; width:'+this.options.modalWidth+'px; ';
            str += ' border: darkgreen; border-style: ridge;margin:0px 0px 0px 0px; display: inline;">'; //padding:6px 9px; 
            str += '<span id="serverResultMsg" style="text-align:left">'+this.options.message+'</span></div>';
			this.showServerResult('success',str);
            if ( this.options.successTimeoutSec> 0) setTimeout(function() {bb.balert.exit();}, 1000*this.options.successTimeoutSec);
	        $('#serverResultModal').click(function () {
	            bb.balert.exit();
	        })
		},
		progress: function(options) {
			if (typeof(options)==='undefined') options='Processing...';
			if (! this.alertOptions(options,'progress')) {
				alert('invalid parameter for bb.wait, must be either a message string or an object');
				return;
			}
			if (this.options.message=='remove') {
				$('#bbViewportOverlay').remove();
				return;
			}				
			// todo make the 'remove' an option			

			
			var str = '<div id="bbViewportOverlay" class="bbViewportOverlay">'
					+ '		<button type="button" class="close" style="position:absolute; top:0; right:30px" onclick="bb.balert.quitLoading();return false" aria-hidden="true">×</button>'
					+ '		<div class="bbLoadingSpinner">'
					+ '			<img src="assets/img/loading2.gif" class="icon" />'
					+ '			<h4 id="bbLoadingMessage">' + this.options.message + ' <span id="bbLoadingForSec"><span></h4>'
					+ '		</div>'
					+ '</div>';
			$('body').append(str);
			$('#bbViewportOverlay').show();
			// this requeues the modal 
			//setTimeout(this.progressFlush,1500);
			return;
		},
		quitLoading: function() {
			//bb.balert.waitingForLoad=false;
			$('#bbViewportOverlay').remove();
		},

		calcWidth: function(message,mode,position) {
			var str = '<span id="testModal" class="alert alert-block alert-error">'+message+'</span>';
			$('body').append(str);
			var testWidth = $('#testModal').outerWidth();
			$('#testModal').remove();
			if (mode == 'warning') {
				return (testWidth <120) ? 120 : testWidth ;
			} 
			var element='#'+position;
			if ($(element).is('button') || $(element).is('a')) {
				var elWidth = $(element).outerWidth();
				var elLen = $(element).html().length;
				if (elLen > message.length ) {
					return elWidth;
				}
			}
			return (testWidth <120) ? 120 : testWidth ;
		},	
		showServerResult: function(mode, str) {
			$("#serverResultModal").detach();
			var element = 'body';
			if ($('#'+this.options.position).length == 0 ) {
				if ($('.container').length > 0 ) {
					element = '.container';
				}
			} else {
				var element='#'+this.options.position;
			}
			if (this.options.orientation == 'append') {
				$(element).append(str);
			} else if (this.options.orientation == 'prepend') {
				$(element).prepend(str);
			} else {
				$('body').append(str);
			}
			var offsets = {};
			if (this.options.orientation == 'append' || this.options.orientation == 'prepend') {
				offsets.top = 0;
				offsets.left = 0;
			} else if (element == '.container')	{
				offsets.top = $(element).offset().top;
				offsets.left = $(element).offset().left + $(element).width()/2 - this.options.modalWidth / 2;
			} else if (element == 'body')	{
				offsets.top = 100;
				offsets.left = $(element).width()/2 - this.options.modalWidth / 2;
			} else {		
				offsets = this.offsets(element, this.options.orientation, this.options.modalWidth);
			}
			$("#serverResultModal").offset({top:offsets.top, left:offsets.left});
			// jquery bug in setting top requires doing it again
			$("#serverResultModal").offset({top:offsets.top});
		},			
		offsets: function(element, orientation, modalWidth){
			var offsets = {};
			var mHeight = $('#serverResultModal').outerHeight();
			var elHeight = $(element).outerHeight();
			var mWidth = $('#serverResultModal').outerWidth();
			var elWidth = $(element).outerWidth();

			var temp=['left','right','below-left','below-right','above-left','above-right','upper-left'];
			var temp2 = temp.indexOf(orientation);
			if (temp2 < 0) orientation = this.default.orientation;
			switch (orientation) {
				case 'upper-left':
					offsets.left = $(element).offset().left;
					offsets.top = $(element).offset().top; 
					break;
				case 'left':
					offsets.left = $(element).offset().left - mWidth;
					offsets.top = $(element).offset().top ;
					break;
				case 'right':
					offsets.left = $(element).offset().left + elWidth;
					offsets.top = $(element).offset().top; 
					break;
				case 'below-left':
					offsets.left = $(element).offset().left;
					offsets.top = $(element).offset().top + elHeight;
					break;
				case 'below-right': 
					offsets.left = $(element).offset().left + elWidth - mWidth;
					offsets.top = $(element).offset().top + elHeight;
					break;
				case 'above-left':
					offsets.left = $(element).offset().left ;
					offsets.top = $(element).offset().top - mHeight;
					break;
				case 'above-right': 
					offsets.left = $(element).offset().left + elWidth - mWidth;
					offsets.top = $(element).offset().top - mHeight;
					break;
			}
			return offsets;
		},
        exit: function(){
        	$("#serverResultModal").detach();
            $('.bbAlertOverlay').remove();
        }
	}, //bbalert	

	callAjax: 
	{
		basic: function(url, sendData){
			var ares = this.post(url, sendData);
			if (ares.success) {
				return ares.result;
			} else { 
			if(ares.errorType != 'ajax') {
					bb.balert.warning(ares.result,500);
				}
				return false;
			}
		},

		post: function (url, sendData, options){
				var errorType='';
				settings = (typeof(options) !== 'object') ? {} : options; 
				var callAsync = (typeof(settings.async)=== 'undefined') ? false : settings.async;
				var success=false;
				if (callAsync) success = true;
				var sendData = (typeof(sendData) !== 'object') ? {} : sendData;
				var result = [];
				jQuery.ajaxSetup({async:callAsync});
				$.post(
			        url,
			        {data:sendData},
				    function(dataBack) {
				    	// todo handle async errors with optional popup or logging
				    	var res;	
				    	try	{
				    		res = $.parseJSON(dataBack);
				    	} catch(e) {
				    		res = dataBack;
				    	}
		        		if (res.success === true || res.success === false){ 
							success = res.success;
							result = (res.result == undefined) ? "OK": res.result;
							errorType = 'app';
						} else {
							success = null;
							result = res;
							errorType = 'unknown';
						}
					}
				)
				.fail(function(jqXHR, textStatus, errorThrown) {
						bb.ajaxErrorAlert(jqXHR, textStatus, errorThrown);
						success = false;
						result['textStatus']=textStatus; 
						result['errorThrown']=errorThrown;
						errorType = 'ajax';
				})					 
				;
				jQuery.ajaxSetup({async:true});
				return {success: success, result: result, errorType: errorType};
		},
	}, // ajaxPost

	ajaxErrorAlert: function (jqXHR, textStatus, errorThrown) {
		// todo - alert or default if aVar not defined
		aVar.ajaxErr=[jqXHR, textStatus, errorThrown];
		if (jqXHR.status === 0) {
			bb.balert.warning('XHR status 0 (Not connected)<br> Verify Network.');
		} else if (jqXHR.status == 404) {
			bb.balert.warning('Requested page not found. [404]');
		} else if (jqXHR.status == 500) {
			bb.balert.warning('Internal Server Error [500].');
		} else if (textStatus === 'parsererror') {
			bb.balert.warning('Requested JSON parse failed.'
			+ 'status = ' + jqXHR.statusText + ' <br>'
			+ 'error = ' + jqXHR.status + errorThrown + ' <br>' 
			+ 'response = ' + jqXHR.responseText );
		} else if (textStatus === 'timeout') {
			bb.balert.warning('Time out error.');
		} else if (textStatus === 'abort') {
			bb.balert.warning('Ajax request aborted.');
		} else if (jqXHR.status == 421) {
			// the AJAX server component can throw an arbitrary message
			// example:
			// <?php header("HTTP/1.0 421 Test abc") ?>;
	        bb.balert.warning('Application error message: <br>'
			+  'status = ' + jqXHR.statusText + ' <br>'
			+ 'error = ' + jqXHR.status + ' <br>' 
			+ 'response = ' + jqXHR.responseText);
		} else {
			bb.balert.warning('Uncaught Error! Call the engineers!<br>' 
			+ 'status = ' + jqXHR.statusText + ' <br>'
			+ 'error = ' + jqXHR.status + ' <br>' 
			+ 'response = ' + jqXHR.responseText);
		}
	}, // ajaxErrorAlert

	// alternate ajaz error initialization
	// commented out so that ajaxPost.post() can return an error to the calling program	    
	//	$.ajaxSetup({
	//		error: function(jqXHR, textStatus, errorThrown) {
	//			ajaxErrorAlert(jqXHR, textStatus, errorThrown);
	//		}
	//	}
	formData:[],
	getFormData: function(formname){
			bb.formData.length=0;
 			$('#' + formname + ' input').each(function(){
				if($(this).is(':radio')) return;
				else if($(this).is(':checkbox')) var val=$(this).prop('checked')?1:0; 
				else var val=$(this).val(); 
				formDataPush(val,this);
			}); 
 			$('#' + formname + ' textarea').each(function(){
				formDataPush($(this).val(),this);
			}); 
			var radios=[]
			$('#' + formname + ' input:radio').each(function(){
				var name=this.name; 
				radioIndex = -1;
				for (var x=0; x<radios.length; x++) {
					if (radios[x].name = name) {
						radioIndex = x;
						radioRow = radios[x];
						break;
					}
				}
				if (radioIndex<0) {
					var radioRow={
						name: name,
						value: null
					} 
					if ($(this).data('dbupdate')==false) radioRow.dbupdate=false;
					if ($(this).data('dbcol')>'') radioRow.dbcol=$(this).data('dbcol');
					radios.push(radioRow);
					radioIndex=radios.length-1;
				} else radioRow=radios[x];
				if ($(this).prop('checked')){
					radioRow.value = $(this).val(); 
					radios[x]=radioRow;
				}
			}); 
			for(i=0; i<radios.length; i++) {		
				bb.formData.push(radios[i]);
			}
			
 			$('#' + formname + ' select').each(function(){
				formDataPush($(this).val(),this);
			}); 

			for (i=0; i<bb.formData.length; i++){console.log(bb.formData[i].name + ' ' + bb.formData[i].value)}
			var returnData = {
				dbtable: $('#' + formname).data('dbtable'),
				dbidval: $('#' + formname).data('dbidval'),
				dbidcol: $('#' + formname).data('dbidcol'),
				formData: bb.formData
			};
		
		return returnData;

		function formDataPush(val,element){
			var temp={
				name: element.name,
				value: val
			} 
			if ($(element).data('dbupdate')==false) temp.dbupdate=false;
			if ($(element).data('dbcol')>'') temp.dbcol=$(element).data('dbcol');
			bb.formData.push(temp);
		}
	} // getFormData()

	
}; // bb functions


// bb plugins
(function($){
	$.fn.arrayFind = function(needle, fromIndex) {
		if(fromIndex == null) fromIndex = 0;
		else if(fromIndex < 0) fromIndex = Math.max(0, this.length + fromIndex);
		arr = $.makeArray(this);
		for(var i = fromIndex, j = arr.length; i < j; i++) {
			if(arr[i].indexOf(needle) > -1) return i;
		}
		return -1;
	};
})(jQuery);	// bb plugins


