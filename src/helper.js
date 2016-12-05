export const defaultWaitMs = 10000; // 10s

export function waitTillPresentAndDisplayed( driver, selector, waitMs = defaultWaitMs ) {
	return driver.wait( function() {
		return driver.findElement( selector ).then( function( element ) {
			return element.isDisplayed().then( function() {
				return true;
			}, function() {
				return false;
			} );
		}, function() {
			return false;
		} );
	}, waitMs, `Timed out waiting for element with ${ selector.using } of '${ selector.value }' to be present and displayed` );
}

export function isEventuallyPresentAndDisplayed( driver, selector, waitMs = defaultWaitMs ) {
	return driver.wait( function() {
		return driver.findElement( selector ).then( function( element ) {
			return element.isDisplayed().then( function() {
				return true;
			}, function() {
				return false;
			} );
		}, function() {
			return false;
		} );
	}, waitMs ).then( ( shown ) => {
		return shown;
	}, ( ) => {
		return false;
	} );
}

export function clickWhenClickable( driver, selector, waitMs = defaultWaitMs ) {
	return driver.wait( function() {
		return driver.findElement( selector ).then( function( element ) {
			return element.click().then( function() {
				return true;
			}, function() {
				return false;
			} );
		}, function() {
			return false;
		} );
	}, waitMs, `Timed out waiting for element with ${ selector.using } of '${ selector.value }' to be clickable` );
}

export function setCheckbox( driver, selector ) {
	return driver.findElement( selector ).then( ( checkbox ) => {
		checkbox.getAttribute( 'checked' ).then( ( checked ) => {
			if ( checked !== 'true' ) {
				return this.clickWhenClickable( driver, selector );
			}
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
			}, function() {
				return false;
			} );
		}, function() {
			return false;
		} );
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
			}, function() {
				return false;
			} );
		}, function() {
			return false;
		} );
	}, waitMs, `Timed out waiting for element with ${ selector.using } of '${ selector.value }' to be settable to: '${ logValue }'` );
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
