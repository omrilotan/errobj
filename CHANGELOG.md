# CHANGELOG

## 3.0.1

- Fix: error.cause should remain its original structure instead of being "stringified"

## 3.0.0

- New builds for commonjs and esm
- export is now named

```diff
- import errobj from 'errobj'
+ import { errobj } from 'errobj'
```

## 2.4.4

- Workaround for [ErrorStackParser.parse is not a function](https://github.com/stacktracejs/error-stack-parser/issues/80)

## 2.4.3

- Add `babel` and ensure bundle is `es5` compliance.

## 2.4.2

- Replace parcel build with webpack

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
