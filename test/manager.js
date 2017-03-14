/**
 * External dependencies
 */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { By, WebDriver } from 'selenium-webdriver';
import test from 'selenium-webdriver/testing';

/**
 * Internal dependencies
 */
import { WebDriverHelper as helper } from '../src/index';

chai.use( chaiAsPromised );

const assert = chai.assert;
const expect = chai.expect;
const mochaTimeout = 30000;

let manager;
let driver;

test.describe( 'WebDriverManager', function() {
	this.timeout( mochaTimeout );

	test.before( 'Set baseUrl and try getPageUrl', function() {
		manager = global.__MANAGER__;
		driver = global.__DRIVER__;

		manager.config.baseUrl = 'https://wp-e2e-test-form-page.herokuapp.com';
		driver.get( manager.getPageUrl( '/page-path/' ) );

		helper.waitTillPresentAndDisplayed(
			driver,
			By.css( 'body' )
		);
	} );

	test.it( 'creates instance of WebDriver', () => {
		assert( driver instanceof WebDriver );
	} );

	test.it( 'has https://wp-e2e-test-form-page.herokuapp.com/ as the default base URL', () => {
		assert( 'https://wp-e2e-test-form-page.herokuapp.com' === manager.getBaseUrl() );
	} );

	test.it( 'can returns full url via manager.getPageUrl', () => {
		assert( 'https://wp-e2e-test-form-page.herokuapp.com/page-path/', manager.getPageUrl( '/page-path/' ) );
	} );

	test.it( 'has desktop as default screen size config', () => {
		assert( 'desktop' === manager.getConfigScreenSize() );
	} );

	test.it( 'uses desktop screen size by default', () => {
		return expect( driver.manage().window().getSize() ).
			to.eventually.deep.equal( manager.getScreenSizeAsObject( 'desktop' ) );
	} );

	test.describe( 'Resize browser by device type', () => {
		test.it( 'can resize browser to mobile size', () => {
			manager.resizeBrowser( 'mobile' );
			return expect( driver.manage().window().getSize() ).
				to.eventually.deep.equal( manager.getScreenSizeAsObject( 'mobile' ) );
		} );

		test.it( 'can resize browser to tablet size', () => {
			manager.resizeBrowser( 'tablet' );
			return expect( driver.manage().window().getSize() ).
				to.eventually.deep.equal( manager.getScreenSizeAsObject( 'tablet' ) );
		} );

		test.it( 'can resize browser to desktop size', () => {
			manager.resizeBrowser( 'desktop' );
			return expect( driver.manage().window().getSize() ).
				to.eventually.deep.equal( manager.getScreenSizeAsObject( 'desktop' ) );
		} );

		test.it( 'can resize browser to laptop size', () => {
			manager.resizeBrowser( 'laptop' );
			return expect( driver.manage().window().getSize() ).
				to.eventually.deep.equal( manager.getScreenSizeAsObject( 'laptop' ) );
		} );
	} );

	test.it( 'just visited https://wp-e2e-test-form-page.herokuapp.com/page-path/', () => {
		return assert.eventually.equal(
			driver.getCurrentUrl(),
			'https://wp-e2e-test-form-page.herokuapp.com/page-path/'
		);
	} );
} );
