/**
 * External dependencies
 */
import test from 'selenium-webdriver/testing';

/**
 * Internal dependencies
 */
import { WebDriverHelper as helper } from '../src/index';

const afterHookTimeoutMs = 30000;

test.afterEach( 'Take screenshot', function() {
	this.timeout( afterHookTimeoutMs );
	return helper.takeScreenshot( global.__MANAGER__, this.currentTest );
} );

test.after( 'Quit browser', function() {
	this.timeout( afterHookTimeoutMs );
	if ( global.__MANAGER__ ) {
		global.__MANAGER__.quitBrowser();
	}
} );
