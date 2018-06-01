/**
 * WebDriver helper.
 *
 * @module WebDriverHelper
 */

/**
 * External dependencies
 */
import { By, Key, promise } from 'selenium-webdriver';
import fs from 'fs-extra';
import path from 'path';
import slug from 'slugs';
import temp from 'temp';

export const defaultWaitMs = 10000; // 10s

function returnFalse() {
	return false;
}

function returnTrue() {
	return true;
}

/**
 * Wait for element, located by `selector`, until present and displayed. Timeout
 * occurs after `waitMs` if element located by `selector` is not present and
 * displayed.
 *
 * @param {WebDriver} driver   - Instance of WebDriver.
 * @param {object}    selector - Instance of locator, mechanism for locating an element
 *                               on the page. For example `By.css( '#content' )`.
 * @param {number}    waitMs   - How long to wait in millisecond. Defaults to 10000.
 *
 * @example
 *
 * import { By } from 'selenium-webdriver';
 * import { WebDriverManager, WebDriverHelper as helper } from 'wp-e2e-webdriver';
 *
 * const manager = new WebDriverManager( 'chrome' );
 * const driver = manager.getDriver();
 *
 * helper.waitTillPresentAndDisplayed( driver, By.css( '#content' ) )
 *   .then( ... );
 *
 * @return {Promise} A promise that will be resolved with `true` value if element
 *                   located `selector` is present and displayed, or rejected if
 *                   times out waiting element to present and displayed.
 */
export function waitTillPresentAndDisplayed( driver, selector, waitMs = defaultWaitMs ) {
	return driver.wait( function() {
		return driver.findElement( selector ).then( function( element ) {
			return element.isDisplayed().then( returnTrue, returnFalse );
		}, returnFalse );
	}, waitMs, `Timed out waiting for element with ${ selector.using } of '${ selector.value }' to be present and displayed` );
}

/**
 * Checks whether an element located by `selector` is eventually present and displayed.
 * Timeout occurs after `waitMs` if element located by `selector` is not present and
 * displayed.
 *
 * @param {WebDriver} driver   - Instance of WebDriver.
 * @param {object}    selector - Instance of locator, mechanism for locating an element
 *                               on the page. For example `By.css( '#content' )`.
 * @param {number}    waitMs   - How long to wait in millisecond. Defaults to 10000.
 *
 * @example
 *
 * import { By } from 'selenium-webdriver';
 * import { WebDriverManager, WebDriverHelper as helper } from 'wp-e2e-webdriver';
 *
 * const manager = new WebDriverManager( 'chrome' );
 * const driver = manager.getDriver();
 *
 * helper.isEventuallyPresentAndDisplayed( driver, By.css( '#content' ) )
 *   .then( ... );
 *
 * @return {Promise} A promise that will be resolved with `true` value if element
 *                   located `selector` is eventually present and displayed, or
 *                   rejected if times out waiting the element to be present
 *                   and displayed.
 */
export function isEventuallyPresentAndDisplayed( driver, selector, waitMs = defaultWaitMs ) {
	return driver.wait( function() {
		return driver.findElement( selector ).then( function( element ) {
			return element.isDisplayed().then( returnTrue, returnFalse );
		}, returnFalse );
	}, waitMs ).then( ( shown ) => {
		return shown;
	}, returnFalse );
}

/**
 * Wait for element, located by `selector`, until not present. Timeout occurs
 * after `waitMs` if element located by `selector` still present.
 *
 * @param {WebDriver} driver   - Instance of WebDriver.
 * @param {object}    selector - Instance of locator, mechanism for locating an element
 *                               on the page. For example `By.css( '#content' )`.
 * @param {number}    waitMs   - How long to wait in millisecond. Defaults to 10000.
 *
 * @example
 *
 * import { By } from 'selenium-webdriver';
 * import { WebDriverManager, WebDriverHelper as helper } from 'wp-e2e-webdriver';
 *
 * const manager = new WebDriverManager( 'chrome' );
 * const driver = manager.getDriver();
 *
 * helper.waitTillNotPresent( driver, By.css( '#content' ) )
 *   .then( ... );
 *
 * @return {Promise} A promise that will be resolved with `true` value if element
 *                   located `selector` is eventually not present, or rejected
 *                   if times out waiting the element to be not present.
 */
export function waitTillNotPresent( driver, selector, waitMs = defaultWaitMs ) {
	return driver.wait( function() {
		return driver.findElement( selector ).then( function( element ) {
			return element.isDisplayed().then( returnFalse, returnTrue );
		}, returnTrue );
	}, waitMs, `Timed out waiting for element with ${ selector.using } of '${ selector.value }' to be not present` );
}

/**
 * Wait for the clickable element then click it. Timeout occurs after `waitMs`
 * if clickable element located by `selector` is not present.
 *
 * @param {WebDriver} driver   - Instance of WebDriver.
 * @param {object}    selector - Instance of locator, mechanism for locating an element
 *                               on the page. For example `By.css( '#submit' )`.
 * @param {number}    waitMs   - How long to wait in millisecond. Defaults to 10000.
 *
 * @example
 *
 * import { By } from 'selenium-webdriver';
 * import { WebDriverManager, WebDriverHelper as helper } from 'wp-e2e-webdriver';
 *
 * const manager = new WebDriverManager( 'chrome' );
 * const driver = manager.getDriver();
 *
 * helper.clickWhenClickable( driver, By.css( 'a.button' ) )
 *   .then( ... );
 *
 * @return {Promise} A promise that will be resolved with `true` if element
 *                   located by `selector` is successfully clicked, `false` if
 *                   element is not clickable, or rejected if times out waiting
 *                   clickable element to present and displayed.
 */
export function clickWhenClickable( driver, selector, waitMs = defaultWaitMs ) {
	return driver.wait( function() {
		return driver.findElement( selector ).then( function( element ) {
			return element.click().then( returnTrue, returnFalse );
		}, returnFalse );
	}, waitMs, `Timed out waiting for element with ${ selector.using } of '${ selector.value }' to be clickable` );
}

/**
 * Check the checkbox element located by `selector`.
 *
 * @param {WebDriver} driver   - Instance of WebDriver.
 * @param {object}    selector - Instance of locator, mechanism for locating an element
 *                               on the page. For example `By.css( 'input[type="checkbox"]' )`.
 *
 * @example
 *
 * import { By } from 'selenium-webdriver';
 * import { WebDriverManager, WebDriverHelper as helper } from 'wp-e2e-webdriver';
 *
 * const manager = new WebDriverManager( 'chrome' );
 * const driver = manager.getDriver();
 *
 * helper.setCheckbox( driver, By.css( 'input[type="checkbox"]' ) )
 *   .then( ... );
 *
 * @return {Promise} A promise that will be resolved with `true` if checkbox
 *                   element located by `selector` is checked.
 */
export function setCheckbox( driver, selector ) {
	return driver.findElement( selector ).then( ( checkbox ) => {
		return checkbox.getAttribute( 'checked' ).then( ( checked ) => {
			if ( checked !== 'true' ) {
				return this.clickWhenClickable( driver, selector );
			}

			return true;
		} );
	} );
}

/**
 * Uncheck the checkbox element located by `selector`.
 *
 * @param {WebDriver} driver   - Instance of WebDriver.
 * @param {object}    selector - Instance of locator, mechanism for locating an element
 *                               on the page. For example `By.css( 'input[type="checkbox"]' )`.
 *
 * @example
 *
 * import { By } from 'selenium-webdriver';
 * import { WebDriverManager, WebDriverHelper as helper } from 'wp-e2e-webdriver';
 *
 * const manager = new WebDriverManager( 'chrome' );
 * const driver = manager.getDriver();
 *
 * helper.unsetCheckbox( driver, By.css( 'input[type="checkbox"]' ) )
 *   .then( ... );
 *
 * @return {Promise} A promise that will be resolved with `true` if checkbox
 *                   element located by `selector` is unchecked.
 */
export function unsetCheckbox( driver, selector ) {
	return driver.findElement( selector ).then( ( checkbox ) => {
		checkbox.getAttribute( 'checked' ).then( ( checked ) => {
			if ( checked === 'true' ) {
				return this.clickWhenClickable( driver, selector );
			}
		} );
	} );
}

/**
 * Wait for the element value is cleared. Timeout occurs after `waitMs` if
 * the element located by `selector` is not present and displayed.
 *
 * @param {WebDriver} driver   - Instance of WebDriver.
 * @param {object}    selector - Instance of locator, mechanism for locating an element
 *                               on the page. For example `By.css( 'input[name="username"]' )`.
 * @param {number}    waitMs   - How long to wait in millisecond. Defaults to 10000.
 *
 * @example
 *
 * import { By } from 'selenium-webdriver';
 * import { WebDriverManager, WebDriverHelper as helper } from 'wp-e2e-webdriver';
 *
 * const manager = new WebDriverManager( 'chrome' );
 * const driver = manager.getDriver();
 *
 * helper.waitForFieldClearable( driver, By.css( 'input[name="username"]' ) )
 *   .then( ... );
 *
 * @return {Promise} A promise that will be resolved with `true` if element's value,
 *                   located by `selector`, is successfully cleared, `false` if
 *                   element's value is not cleared, or rejected if times out waiting
 *                   the element to present and displayed.
 */
export function waitForFieldClearable( driver, selector, waitMs = defaultWaitMs ) {
	return driver.wait( function() {
		return driver.findElement( selector ).then( ( element ) => {
			return element.clear().then( function() {
				return element.getAttribute( 'value' ).then( ( value ) => {
					return value === '';
				} );
			}, returnFalse );
		}, returnFalse );
	}, waitMs, `Timed out waiting for element with ${ selector.using } of '${ selector.value }' to be clearable` );
}

/**
 * Set the element's value, located by `selector`, with `value`. Timeout occurs
 * after `waitMs` if the element located by `selector` is not present and displayed.

 *
 * @param {WebDriver} driver   - Instance of WebDriver.
 * @param {object}    selector - Instance of locator, mechanism for locating an element
 *                               on the page. For example `By.css( 'input[name="username"]' )`.
 * @param {string}    value    - Value to set to the element.
 * @param {objec}     options  - Optional object where `secureValue` is a boolea
 *                               indicating the element's value shouldn't be exposed
 *                               in the log ( e.g input[type="password"] ), `waitMs`
 *                               is time in millisecond to wait for the element
 *                               to be settable.
 *
 * @example
 *
 * import { By } from 'selenium-webdriver';
 * import { WebDriverManager, WebDriverHelper as helper } from 'wp-e2e-webdriver';
 *
 * const manager = new WebDriverManager( 'chrome' );
 * const driver = manager.getDriver();
 *
 * helper.setWhenSettable( driver, By.css( 'input[name="username"]' ) )
 *   .then( ... );
 *
 * @return {Promise} A promise that will be resolved with `true` if element's value,
 *                   located by `selector`, is successfully set, `false` if
 *                   element's value is not set, or rejected if times out waiting
 *                   the element to present and displayed.
 */
export function setWhenSettable( driver, selector, value, { secureValue = false, waitMs = defaultWaitMs } = {} ) {
	const logValue = secureValue === true ? '*********' : value;
	const self = this;

	return driver.wait( function() {
		return driver.findElement( selector ).then( function( element ) {
			self.waitForFieldClearable( driver, selector );
			return element.sendKeys( value ).then( function() {
				return element.getAttribute( 'value' ).then( ( actualValue ) => {
					return actualValue === value;
				} );
			}, returnFalse );
		}, returnFalse );
	}, waitMs, `Timed out waiting for element with ${ selector.using } of '${ selector.value }' to be settable to: '${ logValue }'` );
}

/**
 * Select option with text `optionText` in select element lcoated by `dropdownSelector`.
 *
 * @param {WebDriver} driver           - Instance of WebDriver.
 * @param {object}    dropdownSelector - Instance of locator, mechanism for locating
 *                                       an element on the page. For example
 *                                       `By.css( 'select[name="country"]' )`.
 * @param {string}    optionText       - Option text.
 *
 * @return {Promise} A promise that will be resolved to `true` if option can
 *                   be selected, or `false` if not.
 */
export function selectOption( driver, dropdownSelector, optionText ) {
	const dropdown = driver.findElement( dropdownSelector );

	return dropdown.then( ( select ) => {
		return select.click().then( () => {
			const option = select.findElement(
				By.xpath( `.//option[contains(text(),"${ optionText }")]` )
			);

			return option.then( ( opt ) => {
				return opt.click().then( returnTrue, returnFalse );
			}, returnFalse );
		}, returnFalse );
	}, returnFalse );
}

/**
 * Clear cookies and delete localStorage.
 *
 * @param {WebDriver} driver - Instance of WebDriver.
 *
 * @return {bool} Returns true once localStorage is cleared.
 */
export function clearCookiesAndDeleteLocalStorage( driver ) {
	driver.manage().deleteAllCookies();
	return this.deleteLocalStorage( driver );
}

/**
 * Empty all keys out of the `localStorage`.
 *
 * Under the hood invoke `window.localStorage.clear()`.
 *
 * @param {WebDriver} driver - Instance of WebDriver.
 */
export function deleteLocalStorage( driver ) {
	driver.getCurrentUrl().then( ( url ) => {
		if ( url.startsWith( 'data:' ) === false && url !== 'about:blank' ) {
			return driver.executeScript( 'window.localStorage.clear();' );
		}
	} );
}

/**
 * Scroll up once by pressing page up key.
 *
 * @param {WebDriver} driver - Instance of WebDriver.
 * @param {number}    waitMs - Sleep for `waitMs` after pressing page up.
 */
export function scrollUp( driver, waitMs = 2000 ) {
	driver.actions().
		sendKeys( Key.PAGE_UP ).
		perform();

	driver.sleep( waitMs );
}

/**
 * Mouse move into element located by `selector`.
 *
 * @param {WebDriver} driver   - Instance of WebDriver.
 * @param {object}    selector - Instance of locator, mechanism for locating an element
 *                               on the page. For example `By.css( 'input[name="username"]' )`.
 *
 * @example
 *
 * import { By } from 'selenium-webdriver';
 * import { WebDriverManager, WebDriverHelper as helper } from 'wp-e2e-webdriver';
 *
 * const manager = new WebDriverManager( 'chrome' );
 * const driver = manager.getDriver();
 * const selector = By.css( '#submit' );
 *
 * helper.mouseMoveTo( driver, selector ).then( () => {
 *   helper.clickWhenClickable( driver, selector );
 * } );
 *
 * @return {Promise} A promise that will be resolved to `true` if mouse can
 *                   be moved to the element located by `selector`, `false`
 *                   if can not be moved.
 */
export function mouseMoveTo( driver, selector ) {
	return driver.actions().
		mouseMove( driver.findElement( selector ) ).
		perform().then( () => {
			return true;
		}, () => {
			return false;
		} );
}

/**
 * Scroll down once by pressing page down key.
 *
 * @param {WebDriver} driver - Instance of WebDriver.
 * @param {number}    waitMs - Sleep for `waitMs` after pressing page down.
 */
export function scrollDown( driver, waitMs = 2000 ) {
	driver.actions().
		sendKeys( Key.PAGE_DOWN ).
		perform();

	driver.sleep( waitMs );
}

/**
 * Write image `data` to `dst`.
 *
 * @param {String|Buffer|Uint8Array} data - Date to write.
 * @param {dst}                      dst  - Path of the file where data being
 *                                          written into.
 *
 * @example
 *
 * import path from 'path';
 * import { WebDriverManager, WebDriverHelper as helper } from 'wp-e2e-webdriver';
 *
 * const manager = new WebDriverManager( 'chrome' );
 * const driver = manager.getDriver();
 *
 * driver.takeScreenshot().then( data => {
 *   const dst = path.resolve( manager.config.screenshotsDir, 'screenshot.png' );
 *   helper.writeImage( data, dst );
 * } );
 *
 * @return {unefined} Returns value from `fs.writeFileSync` which is `undefined`.
 */
export function writeImage( data, dst ) {
	fs.ensureFileSync( dst );
	return fs.writeFileSync( dst, data, 'base64' );
}

/**
 * Write text `data` to `dst`.
 *
 * @param {String|Buffer|Uint8Array} content - Date to write.
 * @param {dst}                      dst     - Path of the file where data being
 *                                             written into.
 *
 * @example
 *
 * import path from 'path';
 * import { WebDriverManager, WebDriverHelper as helper } from 'wp-e2e-webdriver';
 *
 * const manager = new WebDriverManager( 'chrome' );
 * const driver = manager.getDriver();
 * const dst = path.resolve( process.cwd(), 'browser-log.txt' );
 *
 * driver.manage().logs().get( 'browser' ).then( logs => {
 *   logs.forEach( log => {
 *     helper.writeText( log.message, dst );
 *   } );
 * } );
 *
 * @return {unefined} Returns value from `fs.writeFileSync` which is `undefined`.
 */
export function writeText( content, dst ) {
	fs.ensureFileSync( dst );
	return fs.writeFileSync( dst, content );
}

/**
 * Get path of example media where filename is `filename` and media type is `type`.
 *
 * This function can be used for testing file upload of various where various
 * media types is allowed to be uploaded. Under the hood it copies pre-defined
 * media in this package into `filename` and returns the file details.
 *
 * @param {String} filename - Full path of filename where new media is going
 *                            to be created.
 * @param {String} type     - Media type.
 *
 * @example
 *
 * import { By } from 'selenium-webdriver';
 * import path from 'path';
 * import { WebDriverManager, WebDriverHelper as helper } from 'wp-e2e-webdriver';
 *
 * const manager = new WebDriverManager( 'chrome' );
 * const driver = manager.getDriver();
 *
 * helper.getMediaWithFilename( 'test-upload-image.jpg', 'jpg' ).then( data => {
 *   driver.findElement( By.css( 'input[type="file"]' ) ).sendKeys( data.file );
 *   helper.clickWhenClickable( driver, By.css( '#submit' ) );
 * } );
 *
 * @returns {Promise} Promise of file details.
 */
export function getMediaWithFilename( filename, type = 'jpg' ) {
	const src = path.resolve( __dirname, `../media/media.${ type }` );
	if ( ! fs.existsSync( src ) ) {
		throw new Error( `Source media ${ src } does not exist` );
	}

	const dst = path.resolve( temp.mkdirSync( 'media' ), filename );
	const d = promise.defer();

	fs.copySync( src, dst );

	d.fulfill( {
		imageName: filename,
		fileName: filename,
		file: dst,
	} );

	return d.promise;
}

/**
 * Take a screenshot from `currentTest`.
 *
 * The best place to use this is in `test.afterEach` hook where all tests
 * are captured.
 *
 * @param {WebDriverManager} manager     - Instance of `WebDriverManager`.
 * @param {Object}           currentTest - Current test.
 *
 * @example
 *
 * import test from 'selenium-webdriver/testing';
 * import { WebDriverHelper as helper } from 'wp-e2e-webdriver';
 *
 * test.afterEach( 'Take screenshot', function() {
 *   return helper.takeScreenshot( global.__MANAGER__, this.currentTest );
 * } );

 * @return {Promise} A promise that will be resolved with `undefined` once
 *                   screenshot is written to `manager.config.screenshotsDir`.
 */
export function takeScreenshot( manager, currentTest ) {
	if ( ! currentTest ) {
		return;
	}

	const driver = manager.getDriver();
	const title = slug( currentTest.title );
	const state = currentTest.state;
	const screenSize = manager.getConfigScreenSize();
	const datetime = new Date().toJSON().replace( /:/g, '-' );
	const filename = `${ state }-${ screenSize }-${ title }-${ datetime }.png`;

	driver.getCurrentUrl().then(
		url => console.log( `Taking screenshot of: '${ url }'` ),
		err => {
			console.log( `Could not capture the URL when taking a screenshot: '${ err }'` );
		}
	);

	return driver.takeScreenshot().then( data => {
		const dst = path.resolve( manager.config.screenshotsDir, filename );
		return writeImage( data, dst );
	} );
}
