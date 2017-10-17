<!DOCTYPE html>
<html lang="en">
<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="">
	<meta name="author" content="">
	<link rel="shortcut icon" href="../assets/graphics/favicon.png">

	<title>Form Validation Template</title>

	<!-- Bootstrap core CSS -->
	<link href="../assets/css/bootstrap.min.css" rel="stylesheet">

	<!-- Parsley forms validation -->
	<link href="../assets/css/parsley.css" rel="stylesheet">

	
	<!-- Custom styles for this template -->
	<link href="../assets/css/offcanvas.css" rel="stylesheet">

	<!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
	<!--[if lt IE 9]>
	  <script src="../assets/js/html5shiv.js"></script>
	  <script src="../assets/js/respond.min.js"></script>
	<![endif]-->
	
	
	<script type="text/javascript">
		var aVar = {};
		aVar.parsley = {
			formNames: ['parsley1','parsley2'],
			customSubmit: true
		}
	</script>
	
 </head>

 <body>

	<div class="container">
	  <?php include "main-pagetop.html" ?>

	<div class="row row-offcanvas row-offcanvas-right">
		<div class="col-xs-12 col-sm-9">
			<div class="jumbotron">
				<h1>Forms Validation</h1>
				<p>This is a working model of the different forms validation controls offered by Parsley.  Aside from just getting the library to work, which can take some fiddling around, this template shows</p>
				<p>- how to set your own error message</p>
				<p>- how to position an individual field error message</p>
				<p>- a basic Submit button, where the submit is cancelled if there are errors</p>
				<p>- an AJAX Save button, which also cancels if there are errors</p>
				<p>- a container to display all the validation errors on the form</p>
			</div>
			<div class="row">
				<!-- Basic parsley demo -->
	
				<form id="basicParsley" class="bb-parsley" data-validate="parsley" data-focus="first" >
					<h1 style="display:inline-block;">Basic set of form controls</h1>
					<div style="margin: 30px 5px 10px 5px; border:thin; border-style:solid " class="pull-right">
						<span id="basicParsley-valid" style="display:none;"><strong>Validation Errors</strong></span>
						<div style="text-align:center">
							<input class="btn btn-success" type="submit" value="Submit" style="width:80px; margin:3px"
								name="basicSaveButton"
								onclick="alert('submit clicked')";
							>
							<br>
							<input class="btn btn-success" type="button" 
								value="AJAX save" 
								name="ajaxSaveButton"
								style="width:120px; margin:3px"
								onclick="ajaxSaveBasic();"
							>
							<!-- todo - need to code this
							<input class="btn btn-info" type="reset" value=" Reset" style="width:80px; padding:3px"
								onclick="$( '#parsley1-not-good-to-go' ).remove(); $( '#parsley1-good-to-go' ).remove();"
							>
							-->
						</div>
					</div>
					<hr>
						
					<div class="row">
						<div class="col-md-6">
							<label >Select An Item</label>
							<select required id="selectA" name="selectA" title="Select Box">
								<option value="1">Option 1</option>
								<option value="2">Option 2</option>
								<option value="3">Option 3</option>
							</select>
							<hr>
					
							<label >text A (6 char min) </label>
							<input data-parsley-minlength="6" type="text" value="more" 
							name="textA" 
							id="textFieldA">
							<span class="help-inline">Some Inline Text</span>
							<hr>
					
							<label >textarea (must be > 3 words)</label>
							<textarea data-parsley-minwords="4" placeholder="Enter Some Text" 
								required name="textarea-1"  
								data-parsley-error-message="(You need 4 or more words)"
								>
							</textarea>
							<hr>

							<label >text B (6 char max, required)</label>
							<input data-parsley-maxlength="6" required type="text" value=""
								placeholder="Text input" 
								name="textB" 
								title="Text Field B"
							>
							<span class="help-inline">Some Inline Text</span>
							<hr>
					
							<label >textC (required, custom message location)</label>
							<input type="text" placeholder="Text input" name="textC" required 
								data-parsley-error-message="You can't leave this blank!"
								data-parsley-errors-container="#textCerror"
							>
							<span>Some Text</span>
							<span id="textCerror"></span>
							<hr>
						</div><!-- /col-6 -->
					</div><!-- /row -->
				</form>	
			</div><!--/row-->
		</div><!--/page top -->
		<?php include "main-sidebar.html" ?>
	</div><!-- /row end of off-canvas template --> 

	
	
			
	<div class="row"><!-- long list of Parsley enabled controls -->
					
		<form id="lotsMoreFields" data-validate="parsley" data-parsley-bbsave="lotsMoreOk">
			<h1 style="display:inline-block;">Lots More Parsley Validated Controls</h1>
			<div style="margin: 30px 5px 10px 5px; border:thin; border-style:solid " class="pull-right">
				<span id="lotsMoreFields-valid" style="display:none;"><strong>Validation Errors</strong></span>
					<div style="text-align:center">
						<input class="btn btn-success" type="submit" value="Submit" style="width:80px; margin:3px"
							id="lotsMoreSaveButton"
							onclick="alert('submit clicked')";
						>
						<br>
						<input class="btn btn-success" type="button" 
							value="AJAX save" 
							id="ajaxLotsMoreSaveButton"
							style="width:120px; margin:3px"
							onclick="ajaxSaveLotsMore();"
						>
							<!-- need to code this
							<input class="btn btn-info" type="reset" value=" Reset" style="width:80px; padding:3px"
								onclick="$( '#parsley1-not-good-to-go' ).remove(); $( '#parsley1-good-to-go' ).remove();"
							>
							-->
					</div>
				</div>
			<hr>
			
			<div class="row">
				<div class="col-md-6">
			
					<label>number</label>
					<input data-parsley-type="number" value="" name="number">
					<hr>

					<label>integer</label>
					<input data-parsley-type="integer" value="" name="integer"> <!-- same as HTML5 number type -->
					<hr>

					<label>digits</label>
					<input data-parsley-type="digits" value="" name="digits">
					<hr>

					<label>alphanumeric</label>
					<input data-parsley-type="alphanum" value="" name="alphanum">
					<hr>

					<label >text (regex A-F)</label>
					<input pattern="[A-F]" type="text" class="col-md-2" value="ABC" name="regular expression">
					<span class="help-inline">Some Inline Text</span>
					<hr>

					<label>url</label>
					<input type="url" value="" name="url">
					<hr>
				</div><!-- /col-6 -->
		
				<div class="col-md-6">

					<label >Minimum length (6 char)</label>
					<input data-parsley-minlength="6" type="text" value="" name="minlength">
					<hr>

					<label for="message">Message (20 chars min, 200 max) :</label>
					<textarea id="message" name="message" data-trigger="keyup" data-rangelength="[20,200]" name="message"></textarea>
					<hr>
			
					<label>number (min 6) [trigger=keyup]</label>
					<input type="number" min="6" value="" data-trigger="keyup" name="number min 6">
					<hr>
					  
					<label>number (max 6) [trigger=change]</label>
					<input type="number" max="6" value="" data-trigger="change" name="number max 6">
					<hr>

					<label>number (range 6 to 60) [trigger=keyup]</label>
					<input type="number" data-parsley-range="[6,60]" data-trigger="keyup"  value="" name="numberRange"> <!-- same as min="6" max="60" --> 
					<hr>
					
					<label>range</label>
					<input type="range" value="" name="range">
					<hr>
			
				</div><!-- /col-6 -->
			</div><!-- /row -->
		</form>		
	</div> <!-- demo section 2 -->

	<div class="row">
		<h1 style="display:inline-block;">No demo availabile</h1>
		<p>These are validated by Parsley but I don't have a demo yet</p>
		<p>MinCheck 	data-parsley-mincheck="3"	Validates that a certain minimum number of checkboxes in a group are checked.</p>
		<p>MaxCheck 	data-parsley-maxcheck="3"	Validates that a certain maximum number of checkboxes in a group are checked.</p>
		<p>Check 	data-parsley-check="[1, 3]"	Validates that the number of checked checkboxes in a group is within a certain range.</p>
		<p>Greater than 			data-parsley-gt="#anotherfield"	Validates that the NUMERIC value is greater than another field</p>
		<p>Greater than or equal to	data-parsley-gte="#anotherfield" Validates that the value is greater than or equal to another field</p>
		<p>Less than 				data-parsley-lt="#anotherfield"	Validates that the value is less than another field</p>
		<p>Less than or equal to data-parsley-lte="#anotherfield"	Validates that the value is less than or equal to another field</p>
		<p>Minwords data-parsley-minwords="200"	Validates that the value have at least a certain amount of words</p>
		<p>Words data-parsley-words="[200, 600]" Validates that the value is within a certain range of words</p>
	</div>
	
	<div class="row">
		<h1 style="display:inline-block;">Other HTML5 input types</h1>
		<p>The validators for dates are found in other templates.  There is no validator for email yet.  The rest of these inputs will need custom javascript to validate.</p>
				<div class="col-md-6">
					<label>password (5-10 char)</label>
					<input data-rangelength="[5,10]" type="password" value="Passw0rd1" name="password entry">
					<span class="help-inline">Some Inline Text</span>
					<hr>
			
					<label>file</label>
					<input type="file" value="" name="file selection" style="width: 200px;">
					<hr>
			
					<label>hidden</label>
					<input type="hidden" value="hidden">
					<hr>
			
					<label>image</label>
					<input type="image" value="">
					<hr>
					<!-- todo - write an email address validator -->
					<label>email</label>
					<input type="email" placeholder="enter Email" name="email" >
					<span class="help-inline">Inline Help</span>
					<hr>
			
					<label>datetime [trigger="change"]</label>
					<input type="datetime" value="" data-trigger="change" name="datetime">
					<hr>
			
					<label>datetime-local</label>
					<input type="datetime-local" value="" name="datetime-local">
					<hr>
			
					<label>date</label>
					<input type="date" value="" name="date">
					<hr>
			
					<label>month</label>
					<input type="month" value="" name="month">
					<hr>
			
					<label>time</label>
					<input type="time" value="" name="time">
					<hr>
			
					<label>week</label>
					<input type="week" value="" name="week">
				</div><!-- /col-6 -->
		
				<div class="col-md-6">
			
					<label>search</label>
					<input type="search" value="" name="search">
					<hr>
			
					<label>tel</label>
					<input type="tel" value="" name="telephone">
					<hr>
			
					<label>color</label>
					<input type="color" value="" name="color">
				</div><!-- /col-6 -->
			
	  </div> <!-- demo section 3 -->

	  <?php include "main-footer.html" ?>

	</div><!--/.container-->



	<!-- Bootstrap core JavaScript
	================================================== -->
	<!-- Placed at the end of the document so the pages load faster -->
	<script src="../assets/js/jquery-2.1.1.min.js"></script>
	<script src="../assets/js/bootstrap-3.3.1.min.js"></script>
  
	<!-- standard script included in all pages on this site -->
	<script src="../assets/js/offcanvas.js"></script>
	
	<!-- scripts needed for this page -->
	<script>
		$(document).ready(function() {
			$("#selectA").val(-1);// override the HTML default that selects the first item
		});
	</script>

  	<script src="../assets/js/parsley.js"></script>
	<script src="../assets/js/parsley/extra/validator/words.js"></script> <!-- 
		You need the added scripts for any of the extra validators described here:
		http://parsleyjs.org/doc/index.html#extras

		They distribute two copies of the remote validator, in /js and /js/parsley/extra/plugin
		http://parsleyjs.org/doc/index.html#remote

		Another plugin isn't documented, to replace Parsley default form behavior that auto bind its fields children
		/js/parsley/extra/plugin/bind.js
		
		and here's another documentation site:
		
	-->
	<script type="text/javascript">
		// javascript for this page
				
		function ajaxSaveBasic(){
			$('#basicParsley').parsley().validate();
			if ( $('#basicParsley').parsley().isValid()) alert('Saving Basic Data');
		}

		/*
		Here is an alternate template for saving a form: 
		The 'lots more fields' form uses the data-parsley-bbsave attribute (data-parsley-bbsave="lotsMoreOk') 
		This triggers both the submit button and the ajax button to call the named function if the form is valid 
		*/ 
		function ajaxSaveLotsMore(){
			$('#lotsMoreFields').parsley().validate();
		}
		function lotsMoreOk(){
			alert('Saving Lots More Data');
		}
		
		// boothooks custom form handler for Parsley
		$(document).ready(function() {
			$('[data-validate="parsley"]').each(function(){
				$(this).parsley();
			})
		});
		$.listen('parsley:form:validate', function(formInstance){
			aVar.parsley.errorFields = '';
		});
		$.listen('parsley:form:validated', function(formInstance){
			var isFormValid = formInstance.validationResult;
			var eventFormId = formInstance.$element.attr('id');
			$( "#" + eventFormId + '-good-to-go' ).remove();
			$( "#" + eventFormId + '-not-good-to-go' ).remove();
			if ( isFormValid ) {
				var fname = formInstance.$element.data('parsley-bbsave');
				if (typeof(window[fname])==="function") {
					window[fname]();
				}
			} else {
				if (aVar.parsley.errorFields == '') var msg='There is an error on the page<br>';
				else var msg = 'Please fix these errors:<br>'+aVar.parsley.errorFields ;
				$( "#" + eventFormId + '-valid' ).after( '<p id="' + eventFormId + '-not-good-to-go" class="alert alert-error" style="margin: 0;padding: 5px;">'+msg+'</p>' );
				if(typeof(formInstance.submitEvent)!='undefined') formInstance.submitEvent.preventDefault();
			}
		});
		function formTestOk(eventFormId){
			if (fname=="good-to-go") $( "#" + eventFormId + '-valid' ).after( '<p id="' + eventFormId + '-good-to-go"  class="alert alert-success" style="margin:0">Form is valid</p>' );
			//obsolete $( "#" + eventForm + '-valid' ).hide();
		}
		$.listen('parsley:field:error', function(fieldInstance){
			arrErrorMsg = ParsleyUI.getErrorsMessages(fieldInstance);
			errorMsg = arrErrorMsg.join(';');
			var fieldName = fieldInstance.$element.prop('title');  
			fieldName = (fieldName=='')?fieldInstance.$element.prop('name'):fieldName;  
			aVar.parsley.errorFields += fieldName + '<br>';  
		});
		
		
	</script>

	<!--
	sample of a fancy range control
	<input class="input-small" id="CGAPctCompleteNum" name="CGAPctCompleteNum" style="width:36px;text-align: right;padding-right: 20px;" type="number"  min="20" max="100" onchange="$('#CGAPctCompleteRange').val($('#CGAPctNum').val()>
	<span style="position:relative; left:-40px">%</span>
	<input id="CGAPctRange" name="CGAPctRange" placeholder="% complete" type="range" min="20" max="100" onchange="$('#CGAPctCompleteNum').val($('#CGAPctRange').val())" value="60">
	<div id="CGAPctCompleteNum-errorContainer"></div>
	
	sample of a parsley configuration
	https://github.com/bichotll/Parsley-js-Twitter-Bootstrap-3-configuration/blob/master/parsleyConfig.js
	
	-->
	
</body></html>
