/*
_comments - Bool; [optional];
                Set this flag to true to prevent removing comments from @text ( minxml and mincss functions only. )

   Examples:
        vkbeautify.xml(text); // pretty print XML
        vkbeautify.json(text, 4 ); // pretty print JSON
        vkbeautify.css(text, '. . . .'); // pretty print CSS
        vkbeautify.sql(text, '----'); // pretty print SQL

        vkbeautify.xmlmin(text, true);// minify XML, preserve comments
        vkbeautify.jsonmin(text);// minify JSON
        vkbeautify.cssmin(text);// minify CSS, remove comments ( default )
        vkbeautify.sqlmin(text);// minify SQL

*/
(function(){function m(e){var b="    ";if(isNaN(parseInt(e)))b=e;else switch(e){case 1:b=" ";break;case 2:b="  ";break;case 3:b="   ";break;case 4:b="    ";break;case 5:b="     ";break;case 6:b="      ";break;case 7:b="       ";break;case 8:b="        ";break;case 9:b="         ";break;case 10:b="          ";break;case 11:b="           ";break;case 12:b="            "}e=["\n"];for(ix=0;100>ix;ix++)e.push(e[ix]+b);return e}function k(){this.step="    ";this.shift=m(this.step)}function p(e,b){return e.replace(/\s{1,}/g,
" ").replace(/ AND /ig,"~::~"+b+b+"AND ").replace(/ BETWEEN /ig,"~::~"+b+"BETWEEN ").replace(/ CASE /ig,"~::~"+b+"CASE ").replace(/ ELSE /ig,"~::~"+b+"ELSE ").replace(/ END /ig,"~::~"+b+"END ").replace(/ FROM /ig,"~::~FROM ").replace(/ GROUP\s{1,}BY/ig,"~::~GROUP BY ").replace(/ HAVING /ig,"~::~HAVING ").replace(/ IN /ig," IN ").replace(/ JOIN /ig,"~::~JOIN ").replace(/ CROSS~::~{1,}JOIN /ig,"~::~CROSS JOIN ").replace(/ INNER~::~{1,}JOIN /ig,"~::~INNER JOIN ").replace(/ LEFT~::~{1,}JOIN /ig,"~::~LEFT JOIN ").replace(/ RIGHT~::~{1,}JOIN /ig,
"~::~RIGHT JOIN ").replace(/ ON /ig,"~::~"+b+"ON ").replace(/ OR /ig,"~::~"+b+b+"OR ").replace(/ ORDER\s{1,}BY/ig,"~::~ORDER BY ").replace(/ OVER /ig,"~::~"+b+"OVER ").replace(/\(\s{0,}SELECT /ig,"~::~(SELECT ").replace(/\)\s{0,}SELECT /ig,")~::~SELECT ").replace(/ THEN /ig," THEN~::~"+b+"").replace(/ UNION /ig,"~::~UNION~::~").replace(/ USING /ig,"~::~USING ").replace(/ WHEN /ig,"~::~"+b+"WHEN ").replace(/ WHERE /ig,"~::~WHERE ").replace(/ WITH /ig,"~::~WITH ").replace(/ ALL /ig," ALL ").replace(/ AS /ig,
" AS ").replace(/ ASC /ig," ASC ").replace(/ DESC /ig," DESC ").replace(/ DISTINCT /ig," DISTINCT ").replace(/ EXISTS /ig," EXISTS ").replace(/ NOT /ig," NOT ").replace(/ NULL /ig," NULL ").replace(/ LIKE /ig," LIKE ").replace(/\s{0,}SELECT /ig,"SELECT ").replace(/\s{0,}UPDATE /ig,"UPDATE ").replace(/ SET /ig," SET ").replace(/~::~{1,}/g,"~::~").split("~::~")}k.prototype.xml=function(e,b){var a=e.replace(/>\s{0,}</g,"><").replace(/</g,"~::~<").replace(/\s*xmlns\:/g,"~::~xmlns:").replace(/\s*xmlns\=/g,
"~::~xmlns=").split("~::~"),k=a.length,f=!1,g=0,d="",c,l=b?m(b):this.shift;for(c=0;c<k;c++)if(-1<a[c].search(/<!/)){if(d+=l[g]+a[c],f=!0,-1<a[c].search(/--\x3e/)||-1<a[c].search(/\]>/)||-1<a[c].search(/!DOCTYPE/))f=!1}else-1<a[c].search(/--\x3e/)||-1<a[c].search(/\]>/)?(d+=a[c],f=!1):/^<\w/.exec(a[c-1])&&/^<\/\w/.exec(a[c])&&/^<[\w:\-\.\,]+/.exec(a[c-1])==/^<\/[\w:\-\.\,]+/.exec(a[c])[0].replace("/","")?(d+=a[c],f||g--):d=-1<a[c].search(/<\w/)&&-1==a[c].search(/<\//)&&-1==a[c].search(/\/>/)?f?d+=
a[c]:d+=l[g++]+a[c]:-1<a[c].search(/<\w/)&&-1<a[c].search(/<\//)?f?d+=a[c]:d+=l[g]+a[c]:-1<a[c].search(/<\//)?f?d+=a[c]:d+=l[--g]+a[c]:-1<a[c].search(/\/>/)?f?d+=a[c]:d+=l[g]+a[c]:-1<a[c].search(/<\?/)?d+(l[g]+a[c]):-1<a[c].search(/xmlns\:/)||-1<a[c].search(/xmlns\=/)?d+(l[g]+a[c]):d+a[c];return"\n"==d[0]?d.slice(1):d};k.prototype.json=function(e,b){b=b?b:this.step;return"undefined"===typeof JSON?e:"string"===typeof e?JSON.stringify(JSON.parse(e),null,b):"object"===typeof e?JSON.stringify(e,null,
b):e};k.prototype.css=function(e,b){var a=e.replace(/\s{1,}/g," ").replace(/\{/g,"{~::~").replace(/\}/g,"~::~}~::~").replace(/\;/g,";~::~").replace(/\/\*/g,"~::~/*").replace(/\*\//g,"*/~::~").replace(/~::~\s{0,}~::~/g,"~::~").split("~::~"),k=a.length,f=0,g="",d,c=b?m(b):this.shift;for(d=0;d<k;d++)/\{/.exec(a[d])?g+=c[f++]+a[d]:/\}/.exec(a[d])?g+=c[--f]+a[d]:(/\*\\/.exec(a[d]),g+=c[f]+a[d]);return g.replace(/^\n{1,}/,"")};k.prototype.sql=function(e,b){var a=e.replace(/\s{1,}/g," ").replace(/\'/ig,
"~::~'").split("~::~"),k=a.length,f=[],g=0,d=this.step,c=0,l="",h,n=b?m(b):this.shift;for(h=0;h<k;h++)f=h%2?f.concat(a[h]):f.concat(p(a[h],d));k=f.length;for(h=0;h<k;h++)a=f[h],c-=a.replace(/\(/g,"").length-a.replace(/\)/g,"").length,/\s{0,}\s{0,}SELECT\s{0,}/.exec(f[h])&&(f[h]=f[h].replace(/\,/g,",\n"+d+d+"")),/\s{0,}\s{0,}SET\s{0,}/.exec(f[h])&&(f[h]=f[h].replace(/\,/g,",\n"+d+d+"")),/\s{0,}\(\s{0,}SELECT\s{0,}/.exec(f[h])?(g++,l+=n[g]+f[h]):/\'/.exec(f[h])?(1>c&&g&&g--,l+=f[h]):(l+=n[g]+f[h],1>
c&&g&&g--);return l=l.replace(/^\n{1,}/,"").replace(/\n{1,}/g,"\n")};k.prototype.xmlmin=function(e,b){return(b?e:e.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g,"").replace(/[ \r\n\t]{1,}xmlns/g," xmlns")).replace(/>\s{0,}</g,"><")};k.prototype.jsonmin=function(e){return"undefined"===typeof JSON?e:JSON.stringify(JSON.parse(e),null,0)};k.prototype.cssmin=function(e,b){return(b?e:e.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g,"")).replace(/\s{1,}/g," ").replace(/\{\s{1,}/g,
"{").replace(/\}\s{1,}/g,"}").replace(/\;\s{1,}/g,";").replace(/\/\*\s{1,}/g,"/*").replace(/\*\/\s{1,}/g,"*/")};k.prototype.sqlmin=function(e){return e.replace(/\s{1,}/g," ").replace(/\s{1,}\(/,"(").replace(/\s{1,}\)/,")")};window.vkbeautify=new k})();



zsApp.controller('zsWebApiClientController', ['$scope', 'WebAPI', '$timeout', '$filter', function($scope, WebAPI, $timeout, $filter) {
	
	// add the ng-json-prettify module to the app
	var app = angular.module('zsApp');
	app.requires.push('ngPrettyJson');

	$scope.form = {
		method: 'get',
		host: 'localhost',
		port: 10081,
		user: 'admin',
		hash: '',
		action: '',
		_actionError: false,
		responseType: 'json',

		returnedResponseType: '',
		
		// parameters with one extra line
		parameters: [{
			name: '',
			value: '',
		}],
		
		setAction: function(action) {
			$scope.form.action = action;
		},
		
		// callback when starting to type in the newParameter input (name OR value)
		// in this case - add new parameter, and move the focus to the relevant input
		// (if started to type the name, continue with typing the name in the newly added parameter)
		parameterAdded: function() {
			// check if the new line already exists
			var totalParams = $scope.form.parameters.length;
			if ($scope.form.parameters[totalParams - 1].name == '' && $scope.form.parameters[totalParams - 1].value == '') {
				return;
			}

			// add the parameter to the list
			$scope.form.parameters.push({
				name: '',
				value: '',
			});
		},
		
		removeParam: function(paramIndex) {
			$scope.form.parameters.splice(paramIndex, 1);
		},
		
		submit: function() {
			if ($scope.form.action.trim().length === 0) {
				$scope.form._actionError = true;
				return false;
			}
			$scope.form._actionError = false;
			
			// collect parameters
			var params = {};
			$scope.form.parameters.forEach(function(paramData) {
				if (paramData.name.trim().length > 0) {
					params[paramData.name.trim()] = paramData.value;
				}
			});

			// prepare the parameters for the web API call
			var webApiRequest = {
				method: $scope.form.method,
				url: '/ZendServer/Api/' + $scope.form.action,
				apiResponseType: $scope.form.responseType
			};
			
			// add parameters
			if ($scope.form.method == 'get') {
				webApiRequest.params = params;
			} else {
				webApiRequest.data = params;
			}
			
			var promise = WebAPI(webApiRequest);
			
			promise.then(function(res) {
				$scope.result = res.data;
				$scope.form.returnedResponseType = $scope.form.responseType;
			}, function(res) {
				if (res.data && res.data.errorData && res.data.errorData.errorMessage) {
					$scope.result = res.data.errorData.errorMessage;
				} else {
					$scope.result = 'Error!';
				}
			});
			
			return promise;
		},
		
	};
	
	$scope.result = '';
	
	// assign UP/DOWN/ENTER keys to the input
	var bindUpAndDownKeysFn = function(evt) {
		
		$scope.$apply(function() {
			// DOWN
			if (evt.keyCode == 40) {
				if ($scope.availableActions.selectedIndex < ($scope.availableActions.data.length - 1)) {
					$scope.availableActions.selectedIndex++;
				}
			}
			
			// UP
			if (evt.keyCode == 38) {
				if ($scope.availableActions.selectedIndex > 0) {
					$scope.availableActions.selectedIndex--;
				}
			}
			
			// ENTER
			if (evt.keyCode == 13) {
				// get the list of action that are relevant to the current search string (current value in the `action` input)
				var currentlyRelevantActions = $filter('filter')($scope.availableActions.data, $scope.form.action);
				var currentlySelectedAction = currentlyRelevantActions[$scope.availableActions.selectedIndex];
				
				// if there's selected item and it's not the same as the current one
				if ($scope.availableActions.selectedIndex >= 0 && $scope.form.action != currentlySelectedAction) {
					$scope.form.setAction(currentlySelectedAction);
					
					evt.stopPropagation();
					evt.preventDefault();
				}
			}
		});
	};
	
	$scope.availableActions = {
		data: [],
		
		// currently selected item in the box
		selectedIndex: 0,
		
		// check if there are available actions on the current input value
		shouldBeVisible: function() {
			var retVal = false;
			if ($scope.availableActions.data.length && $scope.form.action != '') {
				$scope.availableActions.data.forEach(function(completionString) {
					if (completionString.toLowerCase().indexOf($scope.form.action.toLowerCase()) >= 0 &&
						completionString != $scope.form.action) {
						retVal = true;
					}
				});
			}
			
			// check the currently selected item
			if (retVal) {
				if ($scope.availableActions.selectedIndex > $scope.availableActions.data.length - 1) {
					$scope.availableActions.selectedIndex = $scope.availableActions.data.length - 1;
				}
			} else {
				$scope.availableActions.selectedIndex = 0;
			}
			
			return retVal;
		},
		
		initKeyPress: function() {
			angular.element('#zswac-action-input').on('keydown', bindUpAndDownKeysFn);
		},
		
		load: function() {
			WebAPI({
				url: '/ZendServer/Api/getAvailableWebApis'
			}).then(function(res) {
				$scope.availableActions.data = res.data.responseData.webapis;
			});
		},
	};
	
	$scope.availableActions.load();
	
}]);


zsApp.filter('prettifyResponse', [function() {
	return function(str, type) {
		if (type == 'json') {
			return vkbeautify.json(str, 4)
		} else if (type == 'xml') {
			return vkbeautify.xml(str, 4)
		} else {
			return str;
		}
	};
}])