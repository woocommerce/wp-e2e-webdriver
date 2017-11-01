/**
 * WebDriver helper.
 *
 * @module WebDriverManager
 */

/**
 * External dependencies
 */
import urljoin from 'url-join';
import webdriver from 'selenium-webdriver';
import proxy from 'selenium-webdriver/proxy';
import firefox from 'selenium-webdriver/firefox';
import chrome from 'selenium-webdriver/chrome';
import SauceLabs from 'saucelabs';
import path from 'path';

const implicitWait = 2000;
const pageLoadWaitMs = 60000;
const chromeUA = 'Mozilla/5.0 (wp-e2e-tests) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36';
const firefoxUA = 'Mozilla/5.0 (wp-e2e-tests) Gecko/20100101 Firefox/46.0';
const saucePreRunScriptURL = 'https://raw.githubusercontent.com/Automattic/wp-e2e-tests/master/fix-saucelabs-etc-hosts.sh';
const saucePreRunWinScriptURL = 'https://raw.githubusercontent.com/Automattic/wp-e2e-tests/master/fix-saucelabs-etc-hosts.bat';

const defaultArgs = {
	baseUrl: 'https://automattic.com',
	resizeBrowserWindow: true,
	useCustomUA: true,
	proxy: 'direct',
	screenshotsDir: path.resolve( process.cwd(), 'screenshots' ),
	headless: false
};

/**
 * Class representing WebDriver manager.
 */
export default class Manager {
	/**
	 * Creates a manager.
	 *
	 * @param {String} browser - Browser to use. Valid value includes `chrome`
	 *                           and 'firefox'.
	 * @param {object} config  - Manager configuration.
	 */
	constructor( browser = 'chrome', config = {} ) {
		this.browser = browser;
		this.config = Object.assign( defaultArgs, config );

		this.setupDriver();
	}

	/**
	 * Returns instance of WebDriver.
	 *
	 * @example
	 *
	 * import { WebDriverManager } from 'wp-e2e-webdriver';
	 *
	 * const manager = new WebDriverManager( 'chrome' );
	 * const driver = manager.getDriver();
	 *
	 * @return {WebDriver} Instance of WebDriver.
	 */
	getDriver() {
		return this.driver;
	}

	setupDriver() {
		if ( this.config.useSauce ) {
			this.driver = this.buildSauceDriver();
		} else {
			const browserName = this.browser.toLowerCase();
			switch ( browserName ) {
				case 'chrome':
					this.driver = this.buildChromeDriver();
					break;
				case 'firefox':
					this.driver = this.buildFirefoxDriver();
					break;
				default:
					throw new Error(
						`The specified browser: '${ browserName }' in the config` +
						'is not supported. Supported browsers are "chrome" and "firefox"'
				);
			}

			this.browserName = browserName;
		}

		this.driver.manage().timeouts().implicitlyWait( implicitWait );
		this.driver.manage().timeouts().pageLoadTimeout( pageLoadWaitMs );

		if ( this.config.resizeBrowserWindow ) {
			this.resizeBrowser( this.getConfigScreenSize() );
		}
	}

	buildSauceDriver() {
		const caps = this.config.sauceConfig;

		caps.username = this.config.sauceCreds.sauceUsername;
		caps.accessKey = this.config.sauceCreds.sauceAccessKey;
		caps.name = caps.browserName + ' - [' + this.getConfigScreenSize() + ']';
		caps.maxDuration = 2700; // 45 minutes

		let preRunScript = saucePreRunScriptURL;
		if ( caps.platform.match( /Windows/ ) ) {
			preRunScript = saucePreRunWinScriptURL;
		}
		caps.prerun = { executable: preRunScript };

		if ( process.env.CIRCLE_BUILD_NUM ) {
			caps.name += ' - CircleCI Build #' + process.env.CIRCLE_BUILD_NUM;
		}

		global._sauceLabs = new SauceLabs( {
			username: caps.username,
			password: caps.accessKey
		} );

		const builder = new webdriver.Builder();
		this.browserName = caps.browserName;
		const driver = builder.usingServer( 'http://ondemand.saucelabs.com:80/wd/hub' ).
			withCapabilities( caps ).
			build();

		driver.getSession().then( function( sessionid ) {
			driver.allPassed = true;
			driver.sessionID = sessionid.id_;
		} );

		this.driver = driver;

		return this.driver;
	}

	buildChromeDriver() {
		const builder = new webdriver.Builder();
		builder.setChromeOptions( this.createChromeOptions() );

		return builder.forBrowser( 'chrome' ).
			setLoggingPrefs( this.createLoggingPreference() ).
			build();
	}

	createChromeOptions() {
		const options = new chrome.Options();
		options.setProxy( this.getProxyType() );
		options.addArguments( '--no-sandbox' );
		if ( process.env.HEADLESS || this.config.headless ) {
			options.addArguments( '--headless' );
		}
		if ( this.config.useCustomUA ) {
			options.addArguments( 'user-agent=' + chromeUA );
		}

		return options;
	}

	buildFirefoxDriver() {
		const builder = new webdriver.Builder();
		builder.setFirefoxOptions( this.createFirefoxOptions() );

		return builder.forBrowser( 'firefox' ).
			setLoggingPrefs( this.createLoggingPreference() ).
			build();
	}

	createFirefoxProfile() {
		const profile = new firefox.Profile();

		profile.setNativeEventsEnabled( true );
		profile.setPreference( 'browser.startup.homepage_override.mstone', 'ignore' );
		profile.setPreference( 'browser.startup.homepage', 'about:blank' );
		profile.setPreference( 'startup.homepage_welcome_url.additional', 'about:blank' );

		if ( this.config.useCustomUA ) {
			profile.setPreference( 'general.useragent.override', firefoxUA );
		}

		return profile;
	}

	createFirefoxOptions() {
		const options = new firefox.Options().setProfile( this.createFirefoxProfile() );
		options.setProxy( this.getProxyType() );

		return options;
	}

	createLoggingPreference() {
		const pref = new webdriver.logging.Preferences();
		pref.setLevel( 'browser', webdriver.logging.Level.SEVERE );

		return pref;
	}

	/**
	 * Get screen size from manager's configuration.
	 *
	 * @return {String} Screen size like 'desktop' or 'mobile'.
	 */
	getConfigScreenSize() {
		let screenSize = this.config.screenSize || process.env.BROWSERSIZE;
		if ( screenSize === undefined || screenSize === '' ) {
			screenSize = 'desktop';
		}
		return screenSize.toLowerCase();
	}

	/**
	 * Get object representation of `screenSize`.
	 *
	 * @param {String} screenSize - Screen size like 'desktop' or 'mobile'.
	 *
	 * @return {object} Object representation of screen size.
	 */
	getScreenSizeAsObject( screenSize ) {
		switch ( screenSize ) {
			case 'mobile':
				return { width: 400, height: 1000 };
			case 'tablet':
				return { width: 1024, height: 1000 };
			case 'desktop':
				return { width: 1440, height: 1000 };
			case 'laptop':
				return { width: 1400, height: 790 };
			default:
				throw new Error(
					'Unsupported screen size specified (' + screenSize + '). ' +
					'Supported values are desktop, tablet and mobile.'
				);
		}
	}

	/**
	 * Resize the browser to `screenSize`.
	 *
	 * @param {String} screenSize - Screen size like 'desktop' or 'mobile'.
	 */
	resizeBrowser( screenSize ) {
		if ( typeof ( screenSize ) === 'string' ) {
			switch ( screenSize.toLowerCase() ) {
				case 'mobile':
					this.driver.manage().window().setSize( 400, 1000 );
					break;
				case 'tablet':
					this.driver.manage().window().setSize( 1024, 1000 );
					break;
				case 'desktop':
					this.driver.manage().window().setSize( 1440, 1000 );
					break;
				case 'laptop':
					this.driver.manage().window().setSize( 1400, 790 );
					break;
				default:
					throw new Error(
						'Unsupported screen size specified (' + screenSize + '). ' +
						'Supported values are desktop, tablet and mobile.'
					);
			}
		} else {
			throw new Error(
				'Unsupported screen size specified (' + screenSize + '). ' +
				'Supported values are desktop, tablet and mobile.' );
		}
	}

	/**
	 * Quit currently running browser.
	 *
	 * @param {Number} waitForMs - Wait time in millisecond before quit.
	 *
	 * @return {Promise} A promise that will be resolved once browser quitted.
	 */
	quitBrowser( waitForMs = 0 ) {
		const driver = this.driver;

		return driver.sleep( waitForMs ).then( () => {
			return driver.quit();
		} );
	}

	getProxyType() {
		const proxyType = this.config.proxy;

		switch ( proxyType.toLowerCase() ) {
			case 'direct':
				return proxy.direct();
			case 'system':
				return proxy.system();
			default:
				throw new Error(
					`Unknown proxy type specified of: '${ proxyType }'. Supported` +
					'values are "direct" or "system"'
				);
		}
	}

	/**
	 * Get base URL from manager's configuration.
	 *
	 * @return {String} Base URL from manager's configuration.
	 */
	getBaseUrl() {
		return this.config.baseUrl;
	}

	/**
	 * Get page url given a `pagePath` without the hostname.
	 *
	 * @param {String} pagePath - Page path.
	 *
	 * @return {String} Full URL. Joined base URL with `pagePath`.
	 */
	getPageUrl( pagePath = '/' ) {
		return urljoin( this.getBaseUrl(), pagePath );
	}
}
