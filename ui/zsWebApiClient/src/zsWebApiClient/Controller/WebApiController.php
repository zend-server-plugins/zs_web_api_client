<?php
/**
 * Web API controller
 */
namespace zsWebApiClient\Controller;

use ZendServer\Mvc\Controller\WebAPIActionController;

// The Web API controller should extend Zend Server's base controller
class WebApiController extends WebAPIActionController
{
	/**
	 * Get list of all the available web APIs based on the routing information
	 * @return array
	 */
	public function getAvailableWebApisAction() {
		$config = $this->getServiceLocator()->get('config');
		$webApisRutes = array();
		
		foreach ($config['webapi_routes'] as $wRoute) {
			$webApisRutes[] = basename($wRoute['options']['route']);
		}
		
		// pass the data to the view
		return array(
			'webapis' => $webApisRutes,
		);
	}
	
}
