/* todo: debuge this module loader.  Until I finish this, the css and js has to be loaded in the application.
$('head').append('<link rel="stylesheet" href="assets/css/daterangepicker.css"/>');
jQuery.ajaxSetup({asyc:false});
$.getScript("assets/js/date-en-US.min.js");
$.getScript("assets/js/daterangepicker.js");
$.getScript("assets/js/bindWithDelay.js");
$.getScript("assets/js/jquery.tinysort.min.js");
jQuery.ajaxSetup({async:true});
*/
/* todo
	debug the settings that allow presetting any filter value (line 163)
*/

/* this script uses three design patterns for Jquery plugins:
	tableSort is a function object contained within bbtable.  The Jquery plugin simply wraps the function, and it's not chainable
	tableFilter is also a function object in bbtable.  This is the most complex pattern.  The Jquery plugin is designed to be re-enterable (so you can change the options) and to expose public methods through .data().  I also wrote the tableFilterSetInputs function as a plugin, so it can be called independently.
	tablePagination uses the Jquery plugin pattern that I see most often (it's a fork of the cleanest pagination plugin that I could find)
*/

(function($){
	$.fn.tableSort = function(options) {
		var tableId=this[0].id;
		var initialColumn = typeof(options)==='undefined' ? 0 : (Math.floor(options)>0) ? options : ((typeof(options.initialColumn)==='undefined') ? bb.table.default.initialColumn : options.initialColumn)
		bbtable.sort.init(tableId, initialColumn);
		return this;
	};
}(jQuery));	

(function($){
	$.tableFilter = function(element, options) {
		var defaults = {
			beginDate: Date.today().add({days:-14}),
			endDate: Date.today().add({days:14})
		};
		var tableFilter = this;
		tableFilter.settings = {};
		// var $element = $(element);
		var elementScoped = element;
		// constructor //
		tableFilter.ini = function() {
			tableFilter.settings = $.extend({},defaults,options);
			bbtable.filter.initialize(elementScoped.id,tableFilter.settings);
		}
		// public methods
		tableFilter.exec = function(tableId){
			bbtable.filter.exec(tableId)
		}
		// private methods
		var test = function(opt) {
			console.log(opt);
			debugger;
		}
		// call constructor
		tableFilter.ini();
	}
	
	// attach to Jquery
	$.fn.tableFilter = function(options) {
		return this.each(function() {
			// if plugin has not already been attached
			if (typeof($(this).data('tableFilter'))==='undefined') {
				// create a new copy, passing the DOM element and user options
				var instance = new $.tableFilter(this, options);
				// store a reference to .data in the Jquery version of the element.  This allows access to all public methods & properties, e.g.
				// $('#mytable').plugin('thisPluginName').publicMethod(arg1)
				$(this).data('tableFilter',instance);
			} else {
				var defaults = this.data('tableFilter').settings;
				var settings = (typeof(options)==='undefined') ? defaults : $.extend({},defaults,options);
				$.tableFilter(this,settings);
			}			
		});
	};
	
	$.tableFilterSetInputs = function(element,options){
		var defaults = {x:1 };
		var tableFilterSetInputs = this;
		var $element = $(element);
		var table = $element.attr('id');
		tableFilterSetInputs.ini = function(){
			//tableFilterSetInputs.settings = {};
			tableFilterSetInputs.settings = $.extend({},defaults,options);
	   		$('#' + table + ' thead tr').eq(1).find('th').each( function(){
				var data = $(this).data();
				var filterable = (typeof(data.bbfilter)==='undefined') ? true : data.bbfilter;
				if (filterable) {
		   			var ow = $(this).outerWidth();
		   			var r = /\d+/; 
		   			var padl = Number(r.exec($(this).css("padding-left")));
					var padr = Number(r.exec($(this).css("padding-right")));
					$(this).find('input').width(ow-padl-padr);
				}
			});
		};
		tableFilterSetInputs.ini();
	};	

	// attach to Jquery
	$.fn.tableFilterSetInputs = function(options) {
		// debugger;
		return this.each(function() {
			// if plugin has not already been attached
			if (typeof($(this).data('tableFilterSetInputs'))==='undefined') {
				// create a new copy, passing the DOM element and user options
				var instance = new $.tableFilterSetInputs(this, options);
				// store a reference to .data in the Jquery version of the element.  This allows access to all public methods & properties, e.g.
				// $('#mytable').plugin('thisPluginName').publicMethod(arg1)
				$(this).data('tableFilterSetInputs',instance);
			} else {
				var defaults = $(this).data('tableFilterSetInputs').settings;
				var settings = (typeof(options)==='undefined') ? defaults : $.extend({},defaults,options);
				$.tableFilterSetInputs(this,settings);
			}
		});
	};
})(jQuery);	


		


bbtable = { 
	pagination: {
		tableNames: []
	},
	
	filter: {
		tableNames: [],

		default: {
			minusDays: 14,
			plusDays: 14
		},
		
		initialize: function(table,settings) {
			this.tableNames.push(table);
			var thisFunction = this;
			thisFunction.settings = settings;
			thisFunction.tableName = table;
			$('#' + table + ' thead tr').eq(1).remove();
	   		aVar.x='<tr style="color: black">' + $('#' + table + ' thead tr').eq(0).html() + '</tr>';
	   		$('#' + table + ' thead').append(aVar.x);
	   		$('#' + table + ' thead tr').eq(1).find('th').each( function(){
				var data = $(this).data();
				var filterable = (typeof(data.bbfilter)==='undefined') ? true : data.bbfilter;
				if (filterable) {
		   			var ow = $(this).outerWidth();
		   			var r = /\d+/; 
		   			var padl = Number(r.exec($(this).css("padding-left")));
					var padr = Number(r.exec($(this).css("padding-right")));
					var searchInput = '<input style="padding:1; margin:0; width:' + (ow-padl-padr) + 'px">';
					if (data.bbcheckbox) searchInput = '<span><img style="margin-left:25%" onclick="bbtable.filter.threeValCkChange(this)" src="assets/img/intermediate.gif"><span>';
	   				
	   				if (data.bbdate) {
					var beginDate = thisFunction.settings.beginDate;
					var endDate = thisFunction.settings.endDate;
						var reportDateRange = beginDate.toString('d') + " - " + endDate.toString('d') ;
						searchInput='<button class="btn btn-xs" onclick="return false" title="not yet set">'
							+ '<i class="glyphicon glyphicon-calendar"></i></button>' 
							+ '<input type="text" style="display:none" value="">'
							+ '</span>';
					}
					/* This chunk of code should allow presetting any column filter by putting the tc- name and value into the settings object
						colClassNames = $(this).attr('class');
						var x=colClassNames.indexOf('tc-');
						if(x>=0){
							colName=colClassNames.substring(x+3);
							z=colName.indexOf(' ');
							if (z>=0) colName=colName.substring(0,z) 
							if typeof(thisFunction.settings[colName] != 'undefined') {
								searchInput = '<input style="padding:1; margin:0; width:' + (ow-padl-padr) + 'px"' + value="' + thisFunction.settings[colName] + '">';
							}
						}
					}
					*/
	   			} else {
	   				var searchInput = '';
	   			}
				$(this).html(searchInput);
				if(data.bbdate) {
					$(this).daterangepicker( 
						{
							startDate: beginDate,
							endDate: endDate
						},
						function(start,end){
							var inputElement = $(this.element).find('input');
							var startDate = Date.parse(start).toString('d').substring(0,10);
				 			var endDate = Date.parse(end).toString('d').substring(0,10) + " 23:59:59";
				 			inputElement.val(startDate + ' - ' + endDate);
				 			var tableId = $(this.element).closest('table').attr('id')
				 			bbtable.filter.exec(tableId);
						}
					);
				}
			} ); 
			$('#' + table + ' thead tr').eq(1).find('input').bindWithDelay(
				'keyup',
				function(e){
					if (e.keyCode == 13) return false;
					var target=$(e.currentTarget);
					var tableId=$(target).closest('table').attr('id');
					bbtable.filter.exec(tableId);
				},
				500			
			);
			$(table).tableFilterSetInputs();
		},
		
		threeValCkChange: function(target) {
			var x = $(target).attr('src');
			var newImg = "assets/img/intermediate.gif";
			if (x=="assets/img/intermediate.gif") newImg = "assets/img/checked.gif";
			else if (x=="assets/img/checked.gif") newImg = "assets/img/unchecked.gif";
			$(target).attr('src',newImg);
			var tableId=$(target).closest('table').attr('id');
			bbtable.filter.exec(tableId);
		},

   		exec: function(tableName) {
			var hdrRow=$("#"+tableName+" thead tr").eq(1);			
			var filterSettings = [];
			var filterElements = $(hdrRow).find('th');
			for(var i=0; i<filterElements.length; i++){
				var element = filterElements[i];
				var data = $(element).data();
				var filterable = false;
				var filterParm = null;
				var filterable = (typeof(data.bbfilter)==='undefined') ? true : data.bbfilter;
				var numeric = (typeof(data.bbnumeric)==='undefined') ? false : data.bbnumeric;
				var checkbox = (typeof(data.bbcheckbox)==='undefined') ? false : data.bbcheckbox;
				var date = (typeof(data.bbdate)==='undefined') ? false : data.bbdate;
				var range = false;
				var gt = false;
				var lt = false;
				var gtval, ltval;
				if (filterable) {
					if (checkbox) {
						var filterParm = true;
						var img = $(element).find('img').eq(0).attr('src'); 
						if (img == "assets/img/intermediate.gif") filterable = false;
						else {
							filterable = true;	
							if (img == "assets/img/checked.gif") filterParm = true;
							else filterParm = false;
						}
					} else if (date){
						var filterParm = $(element).find('input').val();
						if (filterParm > '') {
							var dashPos = filterParm.search("-")-1;
							var startDateVar = Date.parse(filterParm.substring(0,dashPos));
							var endDateVar = Date.parse(filterParm.substring(dashPos+3));
				 		}
				 		else filterable = false;
					}
					else {
						var filterParm = $(element).find('input').val().toLowerCase();
						var gti = filterParm.search('>');
						var lti = filterParm.search('<');
						if (gti >= 0 || lti >= 0) {
							if (gti >= 0 && lti >= 0) {	
								range = true;
								gtval = filterParm.substr(0,lti);
								ltval = filterParm.substr(gti+1);
							} else if (gti >= 0) {
								gt = true;
								gtval = filterParm.substr(gti+1);
							} else {
								lt = true;
								ltval = filterParm.substr(lti+1);
							}
							if (numeric) {
								if (range) {
									gtval = isNaN(gtval) ? 0 : Number(gtval);
									ltval = isNaN(ltval) ? 0 : Number(ltval);
								} else if(gt){
									gtval = isNaN(gtval) ? 0 : Number(gtval);
								} else {
									ltval = isNaN(ltval) ? 0 : Number(ltval);
								}
							}
						} else {
							if (numeric) filterParm = isNaN(filterParm) ? 0 : Number(filterParm);
						}
						var filterable = Boolean(filterParm);
					}
					// todo's:
					// and, or
					// list
				}
				filterSettings.push({
					filterable: filterable, 
					filterParm: filterParm,
					numeric: numeric,
					checkbox: checkbox,
					date: date,
					startDate: startDateVar,
					endDate: endDateVar,
					range: range,
					gt: gt,
					lt: lt,
					gtval: gtval, 
					ltval: ltval
				});
			}
			$("#"+tableName+" tbody tr").each(function() {
				// console.log($(this).find('td').eq(0).html());
				var showRow = true;
				for(var i=0; i<filterElements.length; i++){
					if (filterSettings[i].filterable) {
						var needle = filterSettings[i].filterParm;
						var cell = $(this).find('td').eq(i);
						// todo select lists
						// set the cell value based on the type of cell contents
						var inputElement = cell.find('input');
						if (inputElement.size()>0) {
							var cellVal = inputElement.val();
						} else { 
							var anchorElement = cell.find('a');
							if (anchorElement.size()>0) {
								var cellVal = anchorElement.attr('href');
							} else 
								var cellVal = cell.html();
						}
						cellVal = cellVal.toLowerCase();
						if (filterSettings[i].gt) {
							if (filterSettings[i].numeric) {
								if (Number(cellVal) <= filterSettings[i].gtval) showRow = false;
							} else {
								if (cellVal <= filterSettings[i].gtval) showRow = false;
							}
						}
						else if (filterSettings[i].lt) {
							if (filterSettings[i].numeric) {
								if (Number(cellVal) >= filterSettings[i].ltval) showRow = false;
							} else {
								if (cellVal >= filterSettings[i].ltval) showRow = false;
							}
						}
						else if (filterSettings[i].range) {
							if (filterSettings[i].numeric) {
								if (! (filterSettings[i].gtval <= Number(cellVal) && Number(cellVal) <= filterSettings[i].ltval )) showRow = false;
							} else {
								if (! (filterSettings[i].gtval <= cellVal && cellVal <= filterSettings[i].ltval )) showRow = false;
							}
						}
						else if (filterSettings[i].numeric && Number(cellVal) != needle) showRow = false; 
						else if(filterSettings[i].checkbox) {
/*							cellVal = (
								(inputElement.is(":checked")) 
								|| (typeof(cellVal)==='boolean' && cellVal)
								//|| (!isNaN(cellVal) && Number(cellVal) == 1)
								|| (isNaN(cellVal) && cellVal > '')
							); */
							if (!isNaN(cellVal)) {
								if (
									(Number(cellVal) == 1 && needle == true)
									||
									(Number(cellVal) == 0 && needle == false)
									) { showRow = true }
								else
									{ showRow = false }
							}
							else {
								cellVal = (
									(inputElement.is(":checked")) 
									|| (typeof(cellVal)==='boolean' && cellVal)
									|| (isNaN(cellVal) && cellVal > '')
								);
								showRow = (needle == cellVal);
							} 
						} else if(filterSettings[i].date) {
// probably obsolete							cellVal = Date.parse($(cellVal).val());
							cellVal = Date.parse(cellVal);
							if(cellVal < filterSettings[i].startDate || cellVal > filterSettings[i].endDate) showRow = false;
						}
						else if(cellVal.indexOf(needle)<0) showRow = false; 
						if (! showRow) break;
					}
				};
				if (!showRow) {
					$(this).hide(); 
					$(this).addClass('bb-filteredOut');
				} else {
					$(this).show();
					$(this).removeClass('bb-filteredOut');
				}
			});
			if (bbtable.pagination.tableNames.indexOf(tableName) >= 0 ) $('#'+tableName).tablePagination();
		},
		
   		quick: function(tableName, colSelector, needle) {
			$("#"+tableName+" tr").show(); 
			var hdrRow=$("#"+tableName+" tbody tr").eq(1);			
			var colIndex=$(hdrRow).find('td.'+colSelector).index();
			$("#"+tableName+" tbody tr").filter(function()
				{
					return $(this).find('td').eq(colIndex).html().indexOf(needle) < 0 
				}
			).hide();
			$("#"+tableName+" tr").filter(function()
				{
					var inputElement = $(this).find('td').eq(colIndex).find('input');
					return (inputElement.size()>0 && inputElement.val().indexOf(needle)<0);
				}
			).hide();
		}
	},
	
	
	
	sort: {
		default: {
			initialSortColumn: 0
		},
	
		init: function(tableId, initialColumn){
			if (typeof(initialColumn)==='undefined') initialColumn = this.default.initialSortColumn;
			if (typeof(tableSortSeq)==='undefined') this.tableSortSeq = [];
			var tableBody = (tableId.indexOf('Header') > 0)
				? tableId.substring(0,tableId.indexOf('Header')) + 'Detail'
				: tableId;
			this.tableSortSeq.push(tableId);
			this.tableSortSeq[tableId]=[];
			$('#'+tableId).find('thead th').on('click',this.iconClicked);
			if (initialColumn >= 0) bbtable.sort.exec(tableId, tableBody, initialColumn);
			bbtable.sort.styleHeader(tableId, initialColumn);
		},	
		
		styleHeader: function(tableId, colNum, sorting){
			var hdrList=$('#'+tableId+' thead tr').eq(0).find('th');
			for (i=0; i< hdrList.length; i++) {
				var classList = $(hdrList).eq(i).attr('class');
				if (typeof(classList)==='undefined') continue;
				else classList = classList.split(' ');
				if ($(classList).arrayFind('tc-') > -1) {
					$(hdrList).eq(i).find("span.sortIcon").remove();
					var str = '<span class="sortIcon pull-right glyphicon glyphicon-';
					if(i==colNum) {
						if (typeof(sorting) === 'undefined') {
							str += (this.tableSortSeq[tableId][colNum]=='asc')?'arrow-up':'arrow-down';
						} else {
							str += 'random'
						}
					} else { 
							str += 'sort' 
					}
					str += '"></span>';
					$(hdrList).eq(i).append(str);
				}
			}
		},
		
		iconClicked: function(e){
			var colNum = $(e.currentTarget).index();
			var tableId = $(e.currentTarget).parents('table').attr('id');
			var tableBody = (tableId.indexOf('Header') > 0)
				? tableId.substring(0,tableId.indexOf('Header')) + 'Detail'
				: tableId;
			bbtable.sort.styleHeader(tableId,colNum,true);
			setTimeout(function(){
				if (bbtable.pagination.tableNames.indexOf(tableId) >= 0 || bbtable.filter.tableNames.indexOf(tableId) >= 0 ) {
					$('#'+tableId+' tr').show();
				}
				bbtable.sort.exec(tableId, tableBody, colNum);
				bbtable.sort.styleHeader(tableId,colNum);
				if( bbtable.filter.tableNames.indexOf(tableId) >= 0 ) bbtable.filter.exec(tableId); // equivalent to $('#'+tableId).data('tableFilter').exec();
				else if (bbtable.pagination.tableNames.indexOf(tableId) >= 0 )  $('#'+tableId).tablePagination();
			},20);
		},

		exec: function(tableId, tableBody, colNum){
			if (typeof(this.tableSortSeq[tableId][colNum])==='undefined') {
				this.tableSortSeq[tableId][colNum]='desc' ;
			}
			this.tableSortSeq[tableId][colNum] = (this.tableSortSeq[tableId][colNum]=='asc')?'desc':'asc';
	   		var isDate = $('#' + tableId + ' thead tr').eq(0).find('th').eq(colNum).data().bbdate;
	   		var forceStrings = (isDate) ? true : false;
			if ($('#'+tableBody+'>tbody>tr>td:eq('+colNum+')').find('input').length > 0){
//				$('#'+tableBody+'>tbody>tr').tsort('td:eq('+colNum+').find("input").val()',{order:this.tableSortSeq[tableId][colNum]});
				$('#'+tableBody+'>tbody>tr').tsort('td:eq('+colNum+')>input',
					{
						order:this.tableSortSeq[tableId][colNum], 
						useVal:true,
						forceStrings: forceStrings
					});
			} else {
				$('#'+tableBody+'>tbody>tr').tsort('td:eq('+colNum+')',
					{
						order:this.tableSortSeq[tableId][colNum],
						forceStrings: forceStrings
					});
			}
		}
	} // sort
	
	
	
}; // bbtable functions


/**
 * tablePagination - A table plugin for jQuery that creates pagination elements
 *
 * http://neoalchemy.org/tablePagination.html
 *
 * Copyright (c) 2009 Ryan Zielke (neoalchemy.com)
 * licensed under the MIT licenses:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @name tablePagination
 * @type jQuery
 * @param Object settings;
 *      firstArrow - Image - Pass in an image to replace default image. Default: (new Image()).src="./images/first.gif"
 *      prevArrow - Image - Pass in an image to replace default image. Default: (new Image()).src="./images/prev.gif"
 *      lastArrow - Image - Pass in an image to replace default image. Default: (new Image()).src="./images/last.gif"
 *      nextArrow - Image - Pass in an image to replace default image. Default: (new Image()).src="./images/next.gif"
 *      rowsPerPage - Number - used to determine the starting rows per page. Default: 5
 *      currPage - Number - This is to determine what the starting current page is. Default: 1
 *      optionsForRows - Array - This is to set the values on the rows per page. Default: [5,10,25,50,100]
 *      ignoreRows - Array - This is to specify which 'tr' rows to ignore. It is recommended that you have those rows be invisible as they will mess with page counts. Default: []
 *      topNav - Boolean - This specifies the desire to have the navigation be a top nav bar
 *
 *
 * @author Ryan Zielke (neoalchemy.org)
 * @integrated with boothooks by Henry Wythe
 */

 (function($){

	$.fn.tablePagination = function(settings) {
		var defaults = {  
			firstArrow : "glyphicon glyphicon-step-backward",  
			prevArrow : "glyphicon glyphicon-arrow-left",
			nextArrow : "glyphicon glyphicon-arrow-right",
			lastArrow : "glyphicon glyphicon-step-forward",
			rowsPerPage : 20,
			currPage : 1,
			optionsForRows : [5,10,20,50,100,200,500,1000],
			ignoreRows : [],
			topNav : false
		};  
		settings = $.extend(defaults, settings);
		
		return this.each(function() {
		      var table = $(this)[0];
		      bbtable.pagination.tableNames.push($(this).attr('id'));
		      var totalPagesId, currPageId, rowsPerPageId, firstPageId, prevPageId, nextPageId, lastPageId;
		      totalPagesId = '#tablePagination_totalPages';
		      currPageId = '#tablePagination_currPage';
		      rowsPerPageId = '#tablePagination_rowsPerPage';
		      firstPageId = '#tablePagination_firstPage';
		      prevPageId = '#tablePagination_prevPage';
		      nextPageId = '#tablePagination_nextPage';
		      lastPageId = '#tablePagination_lastPage';
		      var tblLocation = (defaults.topNav) ? "prev" : "next";
			  if ($(table)[tblLocation]().length > 0) {
			  		var temp = $(table)[tblLocation]().find(rowsPerPageId).val();
			  		if (typeof(temp)!== 'undefined') defaults.rowsPerPage = Number(temp);
			  }		
		      var totalRowCount = $(table).find('tbody tr').length;
		      var possibleTableRows = $.makeArray( $(table).find('tbody tr').not('.bb-filteredOut') );
		      var tableRows = $.grep(possibleTableRows, function(value, index) {
		        return ($.inArray(value, defaults.ignoreRows) == -1);
		      }, false)
		      
		      var numRows = tableRows.length;
		      var totalPages = resetTotalPages();
		      var currPageNumber = (defaults.currPage > totalPages) ? 1 : defaults.currPage;
		      if ($.inArray(defaults.rowsPerPage, defaults.optionsForRows) == -1)
		        defaults.optionsForRows.push(defaults.rowsPerPage);
		      
		      
		      function hideOtherPages(pageNum) {
		        if (pageNum==0 || pageNum > totalPages)
		          return;
		        var startIndex = (pageNum - 1) * defaults.rowsPerPage;
		        var endIndex = (startIndex + defaults.rowsPerPage - 1);
		        $(tableRows).show();
		        var unfilteredRows = 0
		        for (var i=0;i<tableRows.length;i++) {
		          if ($(tableRows[i]).is('.bb-filteredOut') ) {
		            $(tableRows[i]).hide()
		          } else {
		          	if (unfilteredRows < startIndex || unfilteredRows > endIndex )  $(tableRows[i]).hide()
		          	unfilteredRows ++;
		     	  }     
		        }
		      }
		      
		      function resetTotalPages() {
		        var preTotalPages = Math.round(numRows / defaults.rowsPerPage);
		        var totalPages = (preTotalPages * defaults.rowsPerPage < numRows) ? preTotalPages + 1 : preTotalPages;
		        if ($(table)[tblLocation]().find(totalPagesId).length > 0)
		          $(table)[tblLocation]().find(totalPagesId).html(totalPages);
		        return totalPages;
		      }
		      
		      function resetCurrentPage(currPageNum) {
		        if (currPageNum < 1 || currPageNum > totalPages)
		          return;
		        currPageNumber = currPageNum;
		        hideOtherPages(currPageNumber);
		        $(table)[tblLocation]().find(currPageId).val(currPageNumber)
		      }
		      
		      function resetPerPageValues() {
		        var isRowsPerPageMatched = false;
		        var optsPerPage = defaults.optionsForRows;
		        optsPerPage.sort(function (a,b){return a - b;});
		        var perPageDropdown = $(table)[tblLocation]().find(rowsPerPageId)[0];
		        perPageDropdown.length = 0;
		        for (var i=0;i<optsPerPage.length;i++) {
		          if (optsPerPage[i] == defaults.rowsPerPage) {
		            perPageDropdown.options[i] = new Option(optsPerPage[i], optsPerPage[i], true, true);
		            isRowsPerPageMatched = true;
		          }
		          else {
		            perPageDropdown.options[i] = new Option(optsPerPage[i], optsPerPage[i]);
		          }
		        }
		        if (!isRowsPerPageMatched) {
		          defaults.optionsForRows == optsPerPage[0];
		        }
		      }
		      
		      function createPaginationElements() {
		        var htmlBuffer = [];
		        htmlBuffer.push("<div id='tablePagination'>");
		        htmlBuffer.push("<span id='tablePagination_perPage'>");
		        htmlBuffer.push("<select id='tablePagination_rowsPerPage'><option value='5'>5</option></select>");
		        htmlBuffer.push("per page");
		        htmlBuffer.push("</span>");
		        htmlBuffer.push("<span id='rowsXofY'></span>");
		        htmlBuffer.push("<span id='tablePagination_paginater' class='pull-right'>");
		        htmlBuffer.push("<span id='tablePagination_firstPage' class='x-small glyphicon glyphicon-step-backward' style='margin-right:2px'></span>");
		        htmlBuffer.push("<span id='tablePagination_prevPage' class='x-small glyphicon glyphicon-arrow-left' style='margin-right:2px'></span>");
		        htmlBuffer.push("Page");
		        htmlBuffer.push("<input id='tablePagination_currPage' type='input' value='"+currPageNumber+"' size='1'>");
		        htmlBuffer.push("of <span id='tablePagination_totalPages'>"+totalPages+"</span>");
		        htmlBuffer.push("<span id='tablePagination_nextPage' class='"+settings.nextArrow+"' style='margin-left:2px'></span>");
		        htmlBuffer.push("<span id='tablePagination_lastPage' class='"+settings.lastArrow+"' style='margin-left:2px'></span>");
		        htmlBuffer.push("</span>");
		        htmlBuffer.push("</div>");
		        return htmlBuffer.join("").toString();
		      }
		      
		      if ($(table)[tblLocation]().find(totalPagesId).length == 0) {
				if (defaults.topNav) {
					$(this).before(createPaginationElements());
				} else {
					$(this).after(createPaginationElements());
				}
		      }
		      else {
		        $(table)[tblLocation]().find(currPageId).val(currPageNumber);
		      }
		      $(table)[tblLocation]().find('#rowsXofY').html("&nbsp&nbsp(showing " + possibleTableRows.length + " of " + totalRowCount + ")" );
		      resetPerPageValues();
		      hideOtherPages(currPageNumber);
		      $(table)[tblLocation]().find(firstPageId).off('click'); 
		      $(table)[tblLocation]().find(firstPageId).on('click', function (e) {
		        resetCurrentPage(1)
		      });
		      
		      $(table)[tblLocation]().find(prevPageId).off('click');
		      $(table)[tblLocation]().find(prevPageId).on('click', function (e) {
		        resetCurrentPage(currPageNumber - 1)
		      });
		      
		      $(table)[tblLocation]().find(nextPageId).off('click'); 
		      $(table)[tblLocation]().find(nextPageId).on('click', function (e) {
		        resetCurrentPage(parseInt(currPageNumber) + 1)
		      });
		      
		      $(table)[tblLocation]().find(lastPageId).off('click');
		      $(table)[tblLocation]().find(lastPageId).on('click', function (e) {
		        resetCurrentPage(totalPages)
		      });
		      
		      $(table)[tblLocation]().find(currPageId).off('change');
		      $(table)[tblLocation]().find(currPageId).on('change', function (e) {
		        resetCurrentPage(this.value)
		      });
		      
		      $(table)[tblLocation]().find(rowsPerPageId).off('change');
		      $(table)[tblLocation]().find(rowsPerPageId).on('change', function (e) {
		        defaults.rowsPerPage = parseInt(this.value, 10);
		        totalPages = resetTotalPages();
		        resetCurrentPage(1)
		      });
		      /*
		      $(table)[tblLocation]().find(firstPageId).bind('click', function (e) {
		        resetCurrentPage(1)
		      });
		      
		      $(table)[tblLocation]().find(prevPageId).bind('click', function (e) {
		        resetCurrentPage(currPageNumber - 1)
		      });
		      
		      $(table)[tblLocation]().find(nextPageId).bind('click', function (e) {
		        resetCurrentPage(parseInt(currPageNumber) + 1)
		      });
		      
		      $(table)[tblLocation]().find(lastPageId).bind('click', function (e) {
		        resetCurrentPage(totalPages)
		      });
		      
		      $(table)[tblLocation]().find(currPageId).bind('change', function (e) {
		        resetCurrentPage(this.value)
		      });
		      
		      $(table)[tblLocation]().find(rowsPerPageId).bind('change', function (e) {
		        defaults.rowsPerPage = parseInt(this.value, 10);
		        totalPages = resetTotalPages();
		        resetCurrentPage(1)
		      });
		      */
		})
	};		
})(jQuery);


