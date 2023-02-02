import { defineConfig } from 'cypress';

export default defineConfig({
    reporter: 'cypress-mochawesome-reporter',
    video: false,
    retries: 1,
    e2e: {
        setupNodeEvents(on, config) {
            require('cypress-mochawesome-reporter/plugin')(on);
        },
    },
});
