import { defineConfig } from 'cypress';

export default defineConfig({
    reporter: 'cypress-mochawesome-reporter',
    video: true,
    e2e: {
        setupNodeEvents(on, config) {
            require('cypress-mochawesome-reporter/plugin')(on);
        },
    },
});
