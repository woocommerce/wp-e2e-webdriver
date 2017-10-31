/**
 * External dependencies
 */
import test from 'selenium-webdriver/testing';

/**
 * Internal dependencies
 */
import { WebDriverHelper as helper } from '../src/index';

const afterHookTimeoutMs = 30000;

// Take screenshot
test.afterEach( function() {
	this.timeout( afterHookTimeoutMs );
	return helper.takeScreenshot( global.__MANAGER__, this.currentTest );
} );

// Quit browser
test.after( function() {
	this.timeout( afterHookTimeoutMs );
	if ( global.__MANAGER__ ) {
		global.__MANAGER__.quitBrowser();
	}
} );
