# Change Log

## 3.0.0
- Breaking: Remove bundled "browser" entry. If you are transpiling for the browser please do not exclude this package.
- Otherwise - no code changes.

## 2.4.1
- [FIX] Don't add cause field when cause is undefined

## 2.4.0
- Support error.cause, add "description" custom field

## 2.3.0
- Add more fields to error

## 2.2.1
- Move repo - no change

## 2.2.0
- Support error.toJSON

## 2.1.0
- Parsed stack specific depth instead of just with or without

## 2.0.0
- Breaking: parsedStack is not attached by default
- Add stack offset

## 1.0.0
- Stabailse package - no change

## 0.0.0
- Serialise errors to literal (JSONable) object
