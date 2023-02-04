declare namespace Cypress {
    interface Chainable {
        /**
         * Manually add data to the mochawesome report.
         * @param context string or an object confining to structure {title: 'expected output', value: {a: 1, b: '2', c: 'd'}
         */
        addTestContext(context: TestContext): void;
    }
    interface TestContextObject {
        title: string;
        value: any;
    }
    type TestContext = string | TestContextObject;
}