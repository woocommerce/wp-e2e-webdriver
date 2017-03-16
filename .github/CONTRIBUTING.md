## Contributing to wp-e2e-webdriver

Hi! Thank you for your interest in contributing to wp-e2e-webdriver, we really
appreciate it.

There are many ways to contribute – reporting bugs, feature suggestions, fixing bugs,
submitting pull requests for enhancements.

## Reporting Bugs, Asking Questions, Sending Suggestions

Just file a GitHub issue, that’s all. If you want to prefix the title with a
“Question:”, “Bug:”, or the general area of the application, that would be helpful,
but by no means mandatory. If you have write access, add the appropriate labels.

If you’re filing a bug, specific steps to reproduce are helpful. Please include
the what you expected to see and what happened instead.

## Development Workflow

### Tests

To run the test:

```
$ npm test
```

If files in [`src` directory](https://github.com/woocommerce/wp-e2e-webdriver/tree/master/src)
is updated, make sure the test still passed.

See existing tests in [`test` directory](https://github.com/woocommerce/wp-e2e-webdriver/tree/master/test)
as an example a test should be written.

### Publishing to NPM

Make sure to bump the version, for example to bump minor version:

```
$ npm version minor
```

This will run build, creates the git tag, and push it to remote origin.

For publishing, run:

```
$ npm run pre-publish
$ npm publish
```

## Generating Docs

We use [JSDoc](http://usejsdoc.org/) to generate for API documentation and [tutorials](https://github.com/woocommerce/wp-e2e-webdriver/tree/master/docs/tutorials). To generate the eocs run:

```
$ npm run docs:generate
```
