wp-e2e-webdriver
================

[![npm version](https://img.shields.io/npm/v/wp-e2e-webdriver.svg?style=flat)](https://www.npmjs.com/package/wp-e2e-webdriver)
[![build status](https://api.travis-ci.org/woocommerce/wp-e2e-webdriver.svg)](http://travis-ci.org/woocommerce/wp-e2e-webdriver)
[![dependency status](https://david-dm.org/woocommerce/wp-e2e-webdriver.svg)](https://david-dm.org/woocommerce/wp-e2e-webdriver)

Webdriver manager and helper for WordPress. Most of the good stuff were shamelessly
copied from [wp-e2e-tests](https://github.com/Automattic/wp-e2e-tests). Thanks to
wp-e2e-tests authors and contributors for providing the foundation!

This package provides WebDriver manager and helper to help you test WordPress
site.

## Prerequisites

* `chromedriver`
  which can be downloaded from [here](https://chromedriver.storage.googleapis.com/index.html?path=2.25/).
  Make sure `chromedriver` is available in your `$PATH`. This package is tested
  with version 2.25 and it's recommended to use that version. From our experience
  each version has different behaviours and outcomes. Tests for this package
  are written using `chromedriver`.

You can optionally install other drivers such as [geckodriver](https://github.com/mozilla/geckodriver)
or use remote webdriver via [Sauce Labs](https://saucelabs.com/).

## Install

```
npm install wp-e2e-webdriver
```

## Usage

~~~js
import { By } from 'selenium-webdriver';
import { WebDriverManager, WebDriverHelper as helper } from 'wp-e2e-webdriver'

const manager = new WebDriverManager( 'chrome' );
const driver = manager.getDriver();

driver.get( 'https://automattic.com/work-with-us/' );
helper.waitTillPresentAndDisplayed(
	driver,
	By.css( '#content' )
);
~~~

## Docs

* [Tutorials](https://woocommerce.github.io/wp-e2e-webdriver/wp-e2e-webdriver/0.11.0/tutorial-overview.html)
* [API docs](https://woocommerce.github.io/wp-e2e-webdriver/wp-e2e-webdriver/0.11.0/)
* [Contributing](./.github/CONTRIBUTING.md)

## Dependents

The reason we pulled out manager and helper from wp-e2e-tests so that following
dependents can use that:

* [wp-e2e-page-objects](https://github.com/woocommerce/wp-e2e-page-objects) &mdash; WordPress Page Objects
  package
* [wc-e2e-page-objects](https://github.com/woocommerce/wc-e2e-page-objects) &mdash; WooCommerce Page Objects package
* WordPress plugin or WooCommerce extensions that will have e2e tests that use wp-e2e-page-objects or wc-e2e-page-objects.
