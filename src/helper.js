export function waitTillPresentAndDisplayed( driver, selector, waitMs = 10000 ) {
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

export function isEventuallyPresentAndDisplayed( driver, selector, waitMs = 10000 ) {
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

export function clickWhenClickable( driver, selector, waitMs = 10000 ) {
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
