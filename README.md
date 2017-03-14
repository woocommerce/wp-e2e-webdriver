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

## Install

```
npm install wp-e2e-webdriver
```

## Usage

~~~js
import { WebDriverManager, WebDriverHelper } from 'wp-e2e-webdriver'

const manager = new WebDriverManager( 'chrome' );
const driver = manager.getDriver();

driver.get( 'https://automattic.com/work-with-us/' );
helper.waitTillPresentAndDisplayed(
	driver,
	By.css( '#content' )
);
~~~

## Dependents

The reason we pulled out manager and helper from wp-e2e-tests so that following
dependents can use that:

* wp-e2e-page-objects &mdash; Repo will be published later. WordPress Page Objects
  package
* wc-e2e-page-objects &mdash; WooCommerce Page Objects package
* WooCommerce extensions that will have e2e tests that use wp-e2e-page-objects
