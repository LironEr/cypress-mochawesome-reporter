# Changelog

## 1.0.0 (2025-10-28)


### ⚠ BREAKING CHANGES

* upgrade mochawesome-merge, supports node >= 22 ([#223](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/223))

### Features

* add `addTestContext` command ([#81](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/81)) ([248260f](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/248260f0e31d7063304ddc95c259ee01f92bdcb0))
* add debug flag ([#50](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/50)) ([f0de776](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/f0de776b2286fafaa1483ab5f64bbb213185d880))
* add option to embeed screenshots ([#31](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/31)) ([7b72e12](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/7b72e123a9a2503b0c69e500ca6b082d926715e9))
* add quiet option ([#40](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/40)) ([ad071be](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/ad071be3b3932128fb4019bc75b99e868775dfb1))
* add support for cypress-cucumber-preprocessor ([#172](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/172)) ([3041fd7](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/3041fd71a20e2e06bbea034eda7b2a9da59326a9))
* allow the usage of javascript configFile in mocha reporter options ([#87](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/87)) ([3539431](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/35394317a027f010344315f74da88691402df46f))
* attach videos to report ([#137](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/137)) ([68702ea](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/68702ea9ac451ed315ab753b821eae579b136b31))
* capture every screenshot (for failed & passed tests) ([#12](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/12)) ([831efee](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/831efee0280b35343d75178c2f9f7b50abbea1ab))
* **cli:** add flag to set exit code to the number of tests failed ([#169](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/169)) ([d3f22a5](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/d3f22a5d53ae98e290e7e12f734755d5ead60ef6))
* disable reporter using env var ([#79](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/79)) ([07ac3e8](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/07ac3e8f54e4b16258575a652ab4746fa0890183))
* export beforeRunHook & afterRunHook functions ([#39](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/39)) ([ebee6d6](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/ebee6d63299dff30215011870a50d771bb48bbdf))
* pass mochawesome-report-generator CLI flags to the generator ([#11](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/11)) ([437bccd](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/437bccd66c965a6cb63b2dbf4db743bdf450e34e))
* save screenshots of all test attempts ([#48](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/48)) ([ce5d295](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/ce5d29531666e7e1335bb4aa4524dcc28abf792b))
* show custom screenshot title ([#145](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/145)) ([752ec6e](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/752ec6e1236e76a467ef4fa4204574c140057893))
* support absolute path images when converting image to base64 ([#170](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/170)) ([9fcb92d](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/9fcb92d712d75939ea574e3d6632655a9495c07d))
* support cypress-parallel ([#155](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/155)) ([8906f8e](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/8906f8ec7741c90b44032f365b819d863a9bbd6b))
* Typescript support ([#131](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/131)) ([dfb4e0b](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/dfb4e0b2e20642257422abda1276095b1724a42c))
* use config from cypress.json file ([#15](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/15)) ([3320ca7](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/3320ca7c6e07870b29dde59d0cd21518cd4dd9d8))


### Bug Fixes

* add description for saveJson parameter ([1a66676](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/1a666768c89c9981c7647125ef2e45e69ae1d75d))
* bug report issue form ([7ac741c](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/7ac741cdce1a6ec381e96408ff78083f3ca86fb9))
* bump validator ([5462081](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/54620818535c6e6b4e7ee0425b76463d91af2a48))
* bump validator ([4062337](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/40623377a1b20260f7f65880aea290b00b02e965))
* Bump versions ([e40b76a](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/e40b76a278bb3d2f152ace2f3b2a23e10e7fe540))
* convert screenshots to base64 in describe hierarchy ([#46](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/46)) ([c8bed2a](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/c8bed2a7b164ff5177ae0b0b83b43315a001603e))
* cucumberSupport fail if there is no examples in scenario ([#183](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/183)) ([633da67](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/633da67f765653e36a2008cd7fcf5da6f41cade2))
* display filename in suites ([#34](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/34)) ([63205d4](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/63205d47f3eea644a0425ec859fc6bfa83d79ae2))
* dont copying screenshots if the source and destination are the same ([ff41074](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/ff41074a35390f0363fd6344d12b19a13995b3c7))
* dont copying screenshots if the source and destination are the same ([#80](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/80)) ([2d6485a](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/2d6485a6d12163e5133b0dcb187d4e940efa6e70))
* Generating reports with empty tests ([#218](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/218)) ([c6c5c66](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/c6c5c6610fbb76ec788847d51da367ca65a8cae2))
* handle special chars screenshot file name ([#110](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/110)) ([8ca3fdc](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/8ca3fdc6ade721632a53ac4fa76365362929e732))
* ignore hooks if not the active reporter ([#74](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/74)) ([16240c0](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/16240c02fa6fc8f5bce02a38b9f8edd25cc43009))
* missing "Background" in Cucumber steps ([#178](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/178)) ([51e3a81](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/51e3a81c5e783b4f3e4224a34c541b8859dd7cce))
* overwrite flag ([#60](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/60)) ([1944c4a](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/1944c4ab1387dc8f5956ce8c027d217fe64cff32))
* read reporter options from file if configFile is configured ([#24](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/24)) ([4c8ab1b](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/4c8ab1b04611c44cc554b6b7af98dd267e1bfab0))
* **readme:** add description for saveJson parameter ([#194](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/194)) ([1a66676](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/1a666768c89c9981c7647125ef2e45e69ae1d75d))
* reportDir absolute path ([#99](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/99)) ([909a785](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/909a785f971d7f11d93a61f9452cf92674563a30))
* run on tests without suite ([#71](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/71)) ([89e71fe](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/89e71fe11ef65b91c65e51f1cc078d1a66adbcc9))
* unable to find jsons folder when cypress config is not in project root ([#97](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/97)) ([3352be3](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/3352be36939db08066742ca5a2a14907bc28051e))
* wrong video path ([#162](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/162)) ([416cfe1](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/416cfe1133217e18278ffc3ee48ca9b656cee524))


### Miscellaneous Chores

* upgrade mochawesome-merge, supports node &gt;= 22 ([#223](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/issues/223)) ([386cbb3](https://github.com/CaiqueCoelho/cypress-mochawesome-reporter/commit/386cbb351d1e9abf3c144487facfce29a4f1355b))

## [4.0.0](https://github.com/LironEr/cypress-mochawesome-reporter/compare/v3.8.4...v4.0.0) (2025-07-09)


### ⚠ BREAKING CHANGES

* upgrade mochawesome-merge, supports node >= 22 ([#223](https://github.com/LironEr/cypress-mochawesome-reporter/issues/223))

### Miscellaneous Chores

* upgrade mochawesome-merge, supports node &gt;= 22 ([#223](https://github.com/LironEr/cypress-mochawesome-reporter/issues/223)) ([386cbb3](https://github.com/LironEr/cypress-mochawesome-reporter/commit/386cbb351d1e9abf3c144487facfce29a4f1355b))

## [3.8.4](https://github.com/LironEr/cypress-mochawesome-reporter/compare/v3.8.3...v3.8.4) (2025-07-09)


### Bug Fixes

* Generating reports with empty tests ([#218](https://github.com/LironEr/cypress-mochawesome-reporter/issues/218)) ([c6c5c66](https://github.com/LironEr/cypress-mochawesome-reporter/commit/c6c5c6610fbb76ec788847d51da367ca65a8cae2))

## [3.8.3](https://github.com/LironEr/cypress-mochawesome-reporter/compare/v3.8.2...v3.8.3) (2024-05-10)


### Bug Fixes

* add description for saveJson parameter ([1a66676](https://github.com/LironEr/cypress-mochawesome-reporter/commit/1a666768c89c9981c7647125ef2e45e69ae1d75d))
* **readme:** add description for saveJson parameter ([#194](https://github.com/LironEr/cypress-mochawesome-reporter/issues/194)) ([1a66676](https://github.com/LironEr/cypress-mochawesome-reporter/commit/1a666768c89c9981c7647125ef2e45e69ae1d75d))

## [3.8.2](https://github.com/LironEr/cypress-mochawesome-reporter/compare/v3.8.1...v3.8.2) (2024-02-22)


### Bug Fixes

* cucumberSupport fail if there is no examples in scenario ([#183](https://github.com/LironEr/cypress-mochawesome-reporter/issues/183)) ([633da67](https://github.com/LironEr/cypress-mochawesome-reporter/commit/633da67f765653e36a2008cd7fcf5da6f41cade2))

## [3.8.1](https://github.com/LironEr/cypress-mochawesome-reporter/compare/v3.8.0...v3.8.1) (2024-01-26)


### Bug Fixes

* missing "Background" in Cucumber steps ([#178](https://github.com/LironEr/cypress-mochawesome-reporter/issues/178)) ([51e3a81](https://github.com/LironEr/cypress-mochawesome-reporter/commit/51e3a81c5e783b4f3e4224a34c541b8859dd7cce))

## [3.8.0](https://github.com/LironEr/cypress-mochawesome-reporter/compare/v3.7.0...v3.8.0) (2023-12-29)


### Features

* add support for cypress-cucumber-preprocessor ([#172](https://github.com/LironEr/cypress-mochawesome-reporter/issues/172)) ([3041fd7](https://github.com/LironEr/cypress-mochawesome-reporter/commit/3041fd71a20e2e06bbea034eda7b2a9da59326a9))
* support absolute path images when converting image to base64 ([#170](https://github.com/LironEr/cypress-mochawesome-reporter/issues/170)) ([9fcb92d](https://github.com/LironEr/cypress-mochawesome-reporter/commit/9fcb92d712d75939ea574e3d6632655a9495c07d))
