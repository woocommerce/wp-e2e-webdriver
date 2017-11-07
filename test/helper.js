/**
 * External dependencies
 */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { By, until } from 'selenium-webdriver';
import test from 'selenium-webdriver/testing';

/**
 * Internal dependencies
 */
import { WebDriverHelper as helper } from '../src/index';

const mochaTimeout = 30000;

chai.use( chaiAsPromised );

const assert = chai.assert;

let driver;

test.describe( 'WebDriverHelper', function() {
	this.timeout( mochaTimeout );

	// Open wp-e2e-test-form-page.herokuapp.com
	test.before( function() {
		driver = global.__DRIVER__;
		driver.get( 'https://wp-e2e-test-form-page.herokuapp.com/index.html' );
	} );

	test.it( 'has function "waitTillPresentAndDisplayed" to wait until element is present and displayed', () => {
		assert.eventually.ok(
			helper.waitTillPresentAndDisplayed( driver, By.css( '.container' ) ),
			'failed to wait .container until present and displayed'
		);
	} );

	test.it( 'has function "isEventuallyPresentAndDisplayed" to assert that an element is eventually present and displayed', () => {
		assert.eventually.ok(
			helper.isEventuallyPresentAndDisplayed( driver, By.css( '.container' ) ),
			'element .container was not present and displayed'
		);
	} );

	test.it( 'has function "clickWhenClickable" to perform click on clickable element', () => {
		const clickableElements = [
			'label[for="exampleInputEmail1"]',
			'button[type="submit"]',
		];

		clickableElements.forEach( ( cssSelector ) => {
			assert.eventually.ok(
				helper.clickWhenClickable( driver, By.css( cssSelector ) ),
				`"${ cssSelector }" is not clickable`
			);
		} );
	} );

	test.it( 'has function "setCheckbox" to check the checkbox', () => {
		const checkboxes = [
			'#exampleCheckbox',
			'#inlineCheckbox1',
			'#inlineCheckbox2',
			'#inlineCheckbox3',
		];

		checkboxes.forEach( ( cssSelector ) => {
			helper.setCheckbox( driver, By.css( cssSelector ) ),
			assert.eventually.equal(
				driver.findElement( By.css( cssSelector ) ).getAttribute( 'checked' ),
				'true',
				`failed to set checkbox "${ cssSelector }"`
			);
		} );
	} );

	test.it( 'has function "unsetCheckbox" to uncheck the checkbox', () => {
		const checkboxes = [
			'#exampleCheckbox',
			'#inlineCheckbox1',
			'#inlineCheckbox2',
			'#inlineCheckbox3',
		];

		checkboxes.forEach( ( cssSelector ) => {
			helper.unsetCheckbox( driver, By.css( cssSelector ) ),
			assert.eventually.notEqual(
				driver.findElement( By.css( cssSelector ) ).getAttribute( 'checked' ),
				'true',
				`failed to unset checkbox "${ cssSelector }"`
			);
		} );
	} );

	test.it( 'has function "setWhenSettable" to set or fill input element with a value', () => {
		const textFields = [
			'#exampleInputEmail1',
			'#exampleInputPassword1',
		];

		textFields.forEach( ( cssSelector ) => {
			helper.setWhenSettable( driver, By.css( cssSelector ), 'value' );
			assert.eventually.equal(
				driver.findElement( By.css( cssSelector ) ).getAttribute( 'value' ),
				'value',
				`failed to set value of "${ cssSelector }" to "value"`
			);
		} );
	} );

	test.it( 'has function "clearCookiesAndDeleteLocalStorage" to delete cookies and localStorage', () => {
		driver.executeScript( 'document.cookie="hello=world"; localStorage.setItem( "hello", "world" )' );
		assert.eventually.equal(
			driver.executeScript( 'return document.cookie;' ),
			'hello=world'
		);
		assert.eventually.equal(
			driver.executeScript( 'return localStorage.getItem( "hello" );' ),
			'world'
		);
		helper.clearCookiesAndDeleteLocalStorage( driver );
		assert.eventually.equal(
			driver.executeScript( 'return document.cookie;' ),
			''
		);
		assert.eventually.equal(
			driver.executeScript( 'return localStorage.getItem( "hello" );' ),
			null
		);
	} );

	test.it( 'has function "selectOption" to select option in select element', () => {
		const simpleSelect = [
			{ option: 'Option one', value: 'one' },
			{ option: 'Option two', value: 'two' },
			{ option: 'Option three', value: 'three' },
			{ option: 'Option four', value: 'four' },
			{ option: 'Option five', value: 'five' },
		];

		simpleSelect.forEach( ( expect ) => {
			helper.selectOption( driver, By.css( '#exampleSelect' ), expect.option );
			assert.eventually.equal(
				driver.findElement( By.css( '#exampleSelect' ) ).getAttribute( 'value' ),
				expect.value
			);
		} );

		const selectWithOptgroup = [
			{ option: 'Simple product', value: 'simple' },
			{ option: 'Grouped product', value: 'grouped' },
			{ option: 'External/Affiliate product', value: 'external' },
			{ option: 'Variable product', value: 'variable' },
		];

		selectWithOptgroup.forEach( ( expect ) => {
			helper.selectOption( driver, By.css( '#exampleSelect2' ), expect.option );
			assert.eventually.equal(
				driver.findElement( By.css( '#exampleSelect2' ) ).getAttribute( 'value' ),
				expect.value,
				`Could not select option ${ expect.option } with value ${ expect.value } in #exampleSelect2`
			);
		} );
	} );

	test.describe( 'upload files', () => {
		const waitLocated = 15000;
		const uploadInput = By.css( 'input[type="file"]' );
		const submit = By.css( '#submit' );
		const uploadedImg = By.css( 'img' );
		const uploadedAudio = By.css( 'audio' );

		let fileDetails;

		// open wp-e2e-test-form-page.herokuapp.com/upload/
		test.before( () => {
			driver.get( 'https://wp-e2e-test-form-page.herokuapp.com/upload/' );
		} );

		test.it( 'prepare image to upload', () => {
			helper.getMediaWithFilename( 'test-image.jpg', 'jpg' ).then( data => {
				fileDetails = data;
			} );
		} );

		test.it( 'can upload image file', () => {
			driver.wait( until.elementLocated( uploadInput ), waitLocated, 'Could not locate upload input' );
			driver.findElement( uploadInput ).sendKeys( fileDetails.file );
			helper.clickWhenClickable( driver, submit );
			driver.wait( until.elementLocated( uploadedImg ), waitLocated, 'Could not located uploaded image' );
		} );

		test.it( 'prepare audio to upload', () => {
			helper.getMediaWithFilename( 'test-audio.mp3', 'mp3' ).then( data => {
				fileDetails = data;
			} );
		} );

		test.it( 'can upload mp3 file', () => {
			driver.wait( until.elementLocated( uploadInput ), waitLocated, 'Could not locate upload input' );
			driver.findElement( uploadInput ).sendKeys( fileDetails.file );
			helper.clickWhenClickable( driver, submit );
			driver.wait( until.elementLocated( uploadedAudio ), waitLocated, 'Could not located uploaded audio' );
		} );
	} );
} );
