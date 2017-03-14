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

export function waitTillPresentAndDisplayed( driver, selector, waitMs = defaultWaitMs ) {
	return driver.wait( function() {
		return driver.findElement( selector ).then( function( element ) {
			return element.isDisplayed().then( returnTrue, returnFalse );
		}, returnFalse );
	}, waitMs, `Timed out waiting for element with ${ selector.using } of '${ selector.value }' to be present and displayed` );
}

export function isEventuallyPresentAndDisplayed( driver, selector, waitMs = defaultWaitMs ) {
	return driver.wait( function() {
		return driver.findElement( selector ).then( function( element ) {
			return element.isDisplayed().then( returnTrue, returnFalse );
		}, returnFalse );
	}, waitMs ).then( ( shown ) => {
		return shown;
	}, returnFalse );
}

export function waitTillNotPresent( driver, selector, waitMs = defaultWaitMs ) {
	return driver.wait( function() {
		return driver.findElement( selector ).then( function( element ) {
			return element.isDisplayed().then( returnFalse, returnTrue );
		}, returnTrue );
	}, waitMs, `Timed out waiting for element with ${ selector.using } of '${ selector.value }' to be not present` );
}

export function clickWhenClickable( driver, selector, waitMs = defaultWaitMs ) {
	return driver.wait( function() {
		return driver.findElement( selector ).then( function( element ) {
			return element.click().then( returnTrue, returnFalse );
		}, returnFalse );
	}, waitMs, `Timed out waiting for element with ${ selector.using } of '${ selector.value }' to be clickable` );
}

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

export function unsetCheckbox( driver, selector ) {
	return driver.findElement( selector ).then( ( checkbox ) => {
		checkbox.getAttribute( 'checked' ).then( ( checked ) => {
			if ( checked === 'true' ) {
				return this.clickWhenClickable( driver, selector );
			}
		} );
	} );
}

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

export function clearCookiesAndDeleteLocalStorage( driver ) {
	driver.manage().deleteAllCookies();
	return this.deleteLocalStorage( driver );
}

export function deleteLocalStorage( driver ) {
	driver.getCurrentUrl().then( ( url ) => {
		if ( url.startsWith( 'data:' ) === false && url !== 'about:blank' ) {
			return driver.executeScript( 'window.localStorage.clear();' );
		}
	} );
}

export function scrollUp( driver, waitMsToScroll = 2000 ) {
	driver.actions().
		sendKeys( Key.PAGE_UP ).
		perform();

	driver.sleep( waitMsToScroll );
}

export function mouseMoveTo( driver, selector ) {
	return driver.actions().
		mouseMove( driver.findElement( selector ) ).
		perform().then( () => {
			return true;
		}, () => {
			return false;
		} );
}

export function scrollDown( driver, waitMsToScroll = 2000 ) {
	driver.actions().
		sendKeys( Key.PAGE_DOWN ).
		perform();

	driver.sleep( waitMsToScroll );
}

export function writeImage( data, dst ) {
	fs.ensureFileSync( dst );
	return fs.writeFileSync( dst, data, 'base64' );
}

export function writeText( content, dst ) {
	fs.ensureFileSync( dst );
	return fs.writeFileSync( dst, content );
}

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
		file: dst
	} );

	return d.promise;
}

export function takeScreenshot( manager, currentTest ) {
	if ( ! currentTest ) {
		return;
	}

	const driver = manager.getDriver();
	const title = slug( currentTest.title );
	const state = currentTest.state;
	const screenSize = manager.getConfigScreenSize();
	const filename = `${ state }-${ screenSize }-${ title }.png`;

	return driver.takeScreenshot().then( data => {
		const dst = path.resolve( manager.config.screenshotsDir, filename );
		writeImage( data, dst );
	} );
}
