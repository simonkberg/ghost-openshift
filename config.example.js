// # Ghost Configuration
// Setup your Ghost install for various environments

var path = require('path'),
    config;

// Setup environment variables.
var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP   || process.env.OPENSHIFT_NODEJS_IP   || "127.0.0.1";
var port    = process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT || 2368;
var dbdir   = process.env.OPENSHIFT_DATA_DIR;

config = {
    // ### Development **(default)**
    development: {
        // The url to use when providing links to the site, E.g. in RSS and email.
        url: 'http://my-ghost-blog.com',

        // Example mail config
        // Visit http://docs.ghost.org/mail for instructions
        // ```
        //  mail: {
        //      transport: 'sendgrid',
        //      host: 'smtp.sendgrid.net',
        //      options: {
        //          service: 'Sendgrid',
        //          auth: {
        //              user: '', // Super secret username
        //              pass: ''  // Super secret password
        //          }
        //      }
        //  },
        // ```

        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(dbdir, '/ghost-dev.db')
            },
            debug: false
        },
        server: {
            host: ipaddr,
            port: port
        }
    },

    // ### Production
    // When running Ghost in the wild, use the production environment
    // Configure your URL and mail settings here
    production: {
        url: 'http://my-ghost-blog.com',
        mail: {},
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(dbdir, '/ghost.db')
            },
            debug: false
        },
        server: {
            host: ipaddr,
            port: port
        }
    },

    // **Developers only need to edit below here**

    // ### Testing
    // Used when developing Ghost to run tests and check the health of Ghost
    // Uses a different port number
    testing: {
        url: 'http://127.0.0.1:2369',
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/content/data/ghost-test.db')
            }
        },
        server: {
            host: '127.0.0.1',
            port: '2369'
        }
    },

    // ### Travis
    // Automated testing run through Github
    travis: {
        url: 'http://127.0.0.1:2368',
        database: {
            client: 'sqlite3',
            connection: {
                filename: path.join(__dirname, '/content/data/ghost-travis.db')
            }
        },
        server: {
            host: '127.0.0.1',
            port: '2368'
        }
    }
};

// Export config
module.exports = config;
