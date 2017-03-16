This section contains tutorials to introduce you with [Selenium](http://www.seleniumhq.org/), [Selenium WebDriver](http://www.seleniumhq.org/projects/webdriver/),
and how to write end-to-end tests. If you're familiar with Selenium and WebDriver
already, you can skip this section and jump to [writing end-to-end test](./tutorial-writing-end-to-end-test.html).

## Selenium

From [selenium-webdriver doc](http://seleniumhq.github.io/selenium/docs/api/javascript/index.html):

Selenium is a browser automation library. Most often used for testing web-applications,
Selenium may be used for any task that requires automating interaction with the browser.
You can find more information about Selenium at [http://www.seleniumhq.org/](http://www.seleniumhq.org/).

## Selenium WebDriver

A collection of language specific bindings to drive a browser &mdash; the way it is
meant to be driven. We're going to use their [JavaScript bindings](https://www.npmjs.com/package/selenium-webdriver) to write end-to-end tests later.

Under the hood, Selenium WebDriver makes direct calls to the browser using each
browser’s native support for automation. An example of the call to fill an input
field with 'webdriver' then click the submit button:

~~~js
import { Builder, By } from 'selenium-webdriver';

const driver = new Builder().forBrowser( 'chrome' ).build();

driver.get( 'https://www.google.com/' )
driver.findElement( By.name( 'q' ) ).sendKeys( 'webdriver' );
driver.findElement( By.name( 'btnG' ) ).click();
driver.quit();
~~~

where `driver` is an instance of [`WebDriver`](http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html) that talks to [`chromedriver`](https://sites.google.com/a/chromium.org/chromedriver/)
which then send the command to Chrome browser to find the input field named `q`,
fill the input with 'webdriver', click the button named 'btnG', and then quit
the browser. The nice thing about the `driver` is you can run the same commands
to various browsers, for example Firefox with [geckodriver](https://github.com/mozilla/geckodriver)
or even browser located in remote machine via Selenium Server. There are some
services such as [Sauce Labs](https://saucelabs.com/) which allow you to run
the tests across platform, OS and browser combinations.

## wp-e2e-webdriver

Like `selenium-webdriver` this is just another NPM package that provides helper
and manager. Helper contains functions to tell the driver to perform interaction
with the browser while the manager deals with the WebDriver, for example:

~~~js
import { WebDriverManager, WebDriverHelper as helper } from 'wp-e2e-webdriver';

const manager = new WebDriverManager( 'chrome' );
const driver = manager.getDriver();

driver.get( 'https://www.google.com' );
helper.setWhenSettable( driver, By.name( 'q' ), 'webdriver' );
helper.clickWhenClickable( driver, By.name( 'btnG' ) );
manager.quitBrowser();
~~~

Lots of good stuff in helper and manager comes form [`wp-e2e-tests`](https://github.com/Automattic/wp-e2e-tests)
written by good folks at [Automattic](https://automattic.com/) to test [WordPress.com](https://wordpress.com/).

## Next

In the [next section](./tutorial-quick-start.html) you will learn how to get up
and running as quickly as possible with all packages mentioned here.
