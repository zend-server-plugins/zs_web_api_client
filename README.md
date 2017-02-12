Zend Server Web Api Client
==========

### Overview

This plugin was written in order to demonstrate and execute Zend Server Web APIs, through web services provided by your Zend Server infrastructure.

### How to install?

To install and use this plugin on Zend Server Administration UI, you first need to [Download the latest ZIP](https://github.com/zend-server-plugins/zs_web_api_client/archive/master.zip) to you hard drive, then access Zend Server Aministration UI, visit the "Plugins -> Manage Plugins" page, and deploy the plugin by clicking the "Deploy Plugin" button, and pointing the setup wizard to the locally downloaded ZIP archive.

Once deployed, this plugin creates a brand new page under the left menu "Administration" section - simply refresh the UI browser page to reload the navigation items and reveal the new section page.

### Available Web APIs

How does the plugin operate?
This plugin scans the entire code of Zend Server, and identifies all the available web services it can call at runtime.

However, not all the possible web APIs will appear in the plugin options, and you might find some services missing. In this case, you may write the web service name directly into the action field, in order to use them live.

The page was created by Gregory Chris (gregory.chris@roguewave.com) 2016. Enjoy, and visit zend.com to check other products and services.
