/**
 * OLD JS FILE
 */

// localStorage manager
var storage = {
	_key: 'zend-web-api-client',
	
	get: function(key) {
		var currentContent = localStorage.getItem(storage._key);
		if (currentContent) {
			currentContent = JSON.parse(currentContent);
		} else {
			currentContent = {};
		}
		
		if (key && key in currentContent) {
			return currentContent[key];
		} else if (key) {
			return null;
		}
		
		return currentContent;
	},
	
	set: function(key, value) {
		var currentContent = storage.get();
		currentContent[key] = value;
		localStorage.setItem(storage._key, JSON.stringify(currentContent));
	},
	
	remove: function(key) {
		var currentContent = storage.get();
		if (key && key in currentContent) {
			delete currentContent[key];
			localStorage.setItem(storage._key, JSON.stringify(currentContent));
		} else {
			localStorage.setItem(storage._key, '');
		}
	}
}

function getActions() {
	// get current state
	var storedActions = storage.get('actions');
	if (storedActions && storedActions instanceof Array) {
		return storedActions;
	} else {
		return [];
	}
}

function storeAction(method, action, params) {
	// get current state
	var storedActions = getActions();
	
	// check if the action is already stored
	var alreadyStored = false;
	for (var i=0; i<storedActions.length; i++) {
		if (storedActions[i].method == method && storedActions[i].action == action) {
			alreadyStored = true;
			break;
		}
	}
	
	if (!alreadyStored) {
		storedActions.push({method: method, action: action, params: params});
		storage.set('actions', storedActions);
	}
}	
function removeAction(method, action) {
	// get current state
	var storedActions = getActions();
	
	// check if the action is already stored
	var newActionsList = [];
	var alreadyStored = false;
	for (var i=0; i<storedActions.length; i++) {
		if (storedActions[i].method != method && storedActions[i].action != action) {
			newActionsList.push(storedActions[i]);
		}
	}
	
	storage.set('actions', newActionsList);
}

function updateRecentActionsList() {
	var storedActions = getActions();
	$('#stored-actions-list').empty();
	
	storedActions.forEach(function(action) {
		$('#stored-actions-list').append(
			$('<li>').addClass('list-group-item')
				.append(
					$('<span class="pull-right">').append(
						$('<a>').attr('href', 'javascript:;')
							.attr('class', 'remove-recent-action')
							.attr('action-method', action.method)
							.attr('action-action', action.action)
							.html('<i class="glyphicon glyphicon-remove"></i>')
					)
				)
				.append(
					$('<a>').attr('href', 'javascript:;')
						.attr('class', 'recent-action-item')
						.attr('action-method', action.method)
						.attr('action-action', action.action)
						.attr('action-params', action.params)
						.text(action.method.toUpperCase() + ' ' + action.action + ' ')
				)
		);
	});
}

function updateHighlighting() {
	$('pre code').each(function(i, block) {
		hljs.highlightBlock(block);
	});
}

// add new param row
function addParam(key, value, force) {
	key = key || '';
	value = value || '';
	
	var $firstRow = $('#params-list .row:eq(0)');
	
	var fieldsAreEmpty = true;
	$firstRow.find('input[type="text"]').each(function(i, obj) {
		if ($(obj).val()) {
			fieldsAreEmpty = false;
		}
	});
	
	if (fieldsAreEmpty && !force) {
		$firstRow.find('input[name="params_names\\[\\]"]').val(key);
		$firstRow.find('input[name="params_values\\[\\]"]').val(value);
	} else {
		var $newRow = $firstRow.clone();
		$newRow.find('input[name="params_names\\[\\]"]').val(key);
		$newRow.find('input[name="params_values\\[\\]"]').val(value);
		
		var buttonContent = $newRow.find('button.remove-param-button').html()
		$newRow.find('button.remove-param-button').html(buttonContent.replace('Clear', 'Remove'));
		$('#params-list').append($('<br>')).append($newRow);
	}
}

// clear the params list
function removaAllParams() {
	// remove elements
	$('#params-list').find('.row:eq(0)').nextAll().remove();
	
	// clear fields of the first row
	$('#params-list').find('.row:eq(0) input[type="text"]').val('');
}

// build a query string of params from the form
function getParamsQueryString() {
	// collect params
	var paramsQueryString = '';
	$('#params-list input[type="text"]').each(function() {
		if ($(this).val().length) {
			if ($(this).attr('name') == 'params_names[]') {
				paramsQueryString+= '&' + $(this).val();
			} else {
				paramsQueryString+= '=' + $(this).val();
			}
		}
	});
	
	if (paramsQueryString.length > 0) paramsQueryString = paramsQueryString.substr(1);
	
	return paramsQueryString;
}

// generate query string from the form
function getQueryStringFromForm() {

	params = {
		method: $('#method').val(),
		action: $('#action').val(),
		response_type: $('#response_type').val(),
	};
	
	if ($('#host').val().trim()) {
		params['host'] = $('#host').val();
		storage.set('host', params['host']);
	}
	
	if ($('#port').val().trim()) {
		params['port'] = $('#port').val();
		storage.set('port', params['port']);
	}
	
	if ($('#user').val().trim()) {
		params['user'] = $('#user').val();
		storage.set('user', params['user']);
	}
	
	if ($('#hash').val().trim()) {
		params['hash'] = $('#hash').val();
		storage.set('hash', params['hash']);
	}
	
	// build query string
	queryString = '';
	$.each(params, function(k, v) {
		queryString+= '&' + k + '=' + v;
	});
	queryString += '&' + getParamsQueryString();
	
	// remove the first '&' sign
	if (queryString.length > 0) {
		queryString = queryString.substr(1);
	}
	
	return queryString;
}

function loadActionsAutocompleteList() {
	
	var currentPlaceholder = $('#action').attr('placeholder');
	$('#action').attr('placeholder', 'Loading autocomplete list...');
	
	$.ajax({
		type: 'get',
		url: BASE_URL + 'scan_web_apis.php',
		success: function(res) {
			$('#action').typeahead({
				source: res
			});
		},
		complete: function() {
			$('#action').attr('placeholder', currentPlaceholder);
		},
		'dataType': 'json',
	});
	
}

// update remote host data in the local storage
var storeRemoteHostData = function() {
	storage.set('host', $('#host').val());
	storage.set('port', $('#port').val());
	storage.set('user', $('#user').val());
	storage.set('hash', $('#hash').val());
}

// load previously stored auth data, and fill the auth fields
function loadAuthData() {
	if (storage.get('host')) {
		$('#host').val(storage.get('host'));
	}
	if (storage.get('port')) {
		$('#port').val(storage.get('port'));
	}
	if (storage.get('user')) {
		$('#user').val(storage.get('user'));
	}
	if (storage.get('hash')) {
		$('#hash').val(storage.get('hash'));
	}
}

$(function() {
	
	loadActionsAutocompleteList();
	
	loadAuthData();
	
	// form submit
	$('#webapi-client-form').on('submit', function(e) {
		e.preventDefault();
		
		// store remote data
		storeRemoteHostData();
		
		// start "loader"
		$('#submit-button').addClass('disabled');
		
		// gather parameters from the form
		var params = getQueryStringFromForm();
		
		// send web API
		$.get(BASE_URL + 'callapi.php?' + params, function(res) {
			
			// store successful actions
			if (res.indexOf('errorCode') == -1) {
				storeAction($('#method').val(), $('#action').val(), getParamsQueryString());
				updateRecentActionsList();
			}
			
			if ($('#response_type').val().toLowerCase() == 'json') {
				try {
					res = JSON.stringify(JSON.parse(res), undefined, 4);
					console.log('res', res);
				} catch (e) {
					console.warn(e.message);
				}
			} else if ($('#response_type').val().toLowerCase() == 'xml') {
				res = vkbeautify.xml(res, 4);
			}
			
			// enable the download link
			$('#download-link').removeClass('disabled')
				.attr('href', 'data:,' + encodeURIComponent(res))
				.attr('download', 'output.' + $('#response_type').val().toLowerCase());
			
			$('#webapi-result').attr('class', $('#response_type')).text(res);
			
			updateHighlighting();
		}).fail(function(errXHR) {
			$('#webapi-result').html('Request failed<br><span style="color:red;">' + errXHR.status + ' ' + errXHR.statusText + '</span>');
		}).always(function() {
			// stop "loader"
			$('#submit-button').removeClass('disabled');
		});
	});
	
	
	// assign add param button
	$('#add-param-button').on('click', function() {
		addParam(null, null, 'force = true');
	});
	
	// assign remove param button
	$('#params-list').on('click', '.remove-param-button', function() {
		$row = $(this).parents('.row');
		if ($row.index() == 0) {
			$row.find('input[type="text"]').val('');
		} else {
			$row.prev('br').remove();
			$row.remove();
		}
	});
	
	// load stored actions
	updateRecentActionsList();
	
	// bind "remove-recent-action" button
	
	
	$('#stored-actions-list').on('click', 'a.remove-recent-action', function() {
		var method = $(this).attr('action-method');
		var action = $(this).attr('action-action');
		
		removeAction(method, action);
		updateRecentActionsList();
	});
	
	$('#stored-actions-list').on('click', 'a.recent-action-item', function() {
		$('#method').val($(this).attr('action-method'));
		$('#action').val($(this).attr('action-action'));
		
		// clear params list
		removaAllParams();
		
		// prepare params list
		var paramsQS = $(this).attr('action-params');
		while (paramsQS.length > 0 && paramsQS.charAt(0) == '&') paramsQS = paramsQS.substr(1);
		
		// create params rows
		$.each(paramsQS.split('&'), function(i, paramQS) {
			if (paramQS.indexOf('=') < 0) return;
			addParam(paramQS.split('=')[0], paramQS.split('=')[1]);
		});
	});
	
	$('#stored-actions-list-link').on('click', function() {
		$('#stored-actions-list-wrapper').slideToggle();
	});
});
