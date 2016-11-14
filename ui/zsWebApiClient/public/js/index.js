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
		
		parameters: [],
		
		setAction: function(action) {
			$scope.form.action = action;
		},
		
		// callback when starting to type in the newParameter input (name OR value)
		// in this case - add new parameter, and move the focus to the relevant input
		// (if started to type the name, continue with typing the name in the newly added parameter)
		parameterAdded: function() {
			// add the parameter to the list
			$scope.form.parameters.push({
				name:$scope.newParameter.name, 
				value:$scope.newParameter.value
			});
			
			// set the focus to the new field
			if ($scope.newParameter.name) {
				$timeout(function() {
					angular.element('.zswac-parameter-block').eq($scope.form.parameters.length - 1)
						.find('.zswac-input-block input[type="text"]').eq(0).focus();
				});
			} else if ($scope.newParameter.value) {
				$timeout(function() {
					angular.element('.zswac-parameter-block').eq($scope.form.parameters.length - 1)
						.find('.zswac-input-block input[type="text"]').eq(1).focus();
				});
			}
			
			// clear the newParameter
			$scope.newParameter.name = ''; 
			$scope.newParameter.value = '';
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
			
			var webApiRequest = {
				method: $scope.form.method,
				url: '/ZendServer/Api/' + $scope.form.action
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