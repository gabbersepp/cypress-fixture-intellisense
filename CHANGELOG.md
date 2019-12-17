# Change Log

## 1.2.0 - 2019-12-17
### Added
- watch for newly created fixture files (fixes #12)

### Other
- dependency updates

## 1.1.0 - 2019-12-09
### Added
- allow fixtures in routes: `cy.route(..., "fixture:....")`

## 1.0.2 - 2019-12-08
### Fixed
- package `glob` was not included as dependency but as dev-dependency and thus was not available