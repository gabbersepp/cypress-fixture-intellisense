[![Build Status](https://travis-ci.org/gabbersepp/cypress-fixture-intellisense.svg?branch=master)](https://travis-ci.org/gabbersepp/cypress-fixture-intellisense)
-----------------------------------------------------------------------------------------------------------

# cypress-fixture-intellisense README

if you ever encountered the situation to specify one fixture file from hundreds in your tests, this extension will save you a bunch of time.

## Features

This extension parses the `cypress.json` file in your project root, reads the `fixturesFolder` property and reads all files in this directory.
If you the write `cy.fixture("")` somewhere in your code and trigger a code suggestion (CTRL+Space on Windows), the extension suggests you all fixture files that matches the currently entered text.


![Suggestion](images/example.gif)

> Note: This extension does not utilize the language server thus it is not as powerful than a real intellisense extension.

## Known Issues

No.

## Release Notes

Take a look into the [Changelog](CHANGELOG.md)

-----------------------------------------------------------------------------------------------------------
