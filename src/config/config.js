/**
 * NODE_ENV environment variable defines the environment we're in:
 *  - development
 *  - test
 *  - production
 * Heroku and other providers set this environment variable to 'production'.
 * 
 * We want to default it to 'development' if we are running the server locally,
 * and set it to 'test' (this is done in the package.json "test" script) when we
 * are running our tests.
 * 
 * In the two situations that are under our control ('test' and 'development'),
 * we will set the values of PORT and MONGODB_URI environment variables just
 * like a hosting provider (like Heroku) would in a production environment.
 */


 // Get the execution environment and if isn't set, default to 'development'.
 const env = process.env.NODE_ENV || 'development';

 /**
  * If we aren't running in a production environment, then we have to set some
  * things ourselves.
  * This settings are in the config.json file which isn't included in Version
  * Control (Git) (config.json is being ignored in .gitignore).
  * 
  * When requiring a .json file, require will parse the JSON entity into a
  * JavaScript plain object.
  * This object properties are all (sub-object) configuration settings and so we
  * want to grab the property mapped by our execution environment
  * (i.e. 'development' or 'test') and then put all of those object properties
  * in the process.env global in order to set it, as it would be set in a
  * production environment.
  */
 if (env === 'development' || env === 'test') {
    const config = require('./config.json');
    const envConfig = config[env];
    const envVariables = Object.keys(envConfig);

    // For each var in our config, set it in process.env .
    envVariables.forEach((_var) => {
        process.env[_var] = envConfig[_var];
    });
 }
 