# meteor-rest-python
Example setup of a basic meteor application with two REST api endpoints that allows an external application (in this case, a python script) to insert elements in a collection, with the possibility of allowing the operation only if authenticated as a user with a specific role (e.g. admin, editor or such). 

This could be a good setup to use for a Meteor application hosting data collected via web scraping by a separate script / service.

## Installation
This example setup includes a meteor app, and a python script. 

To start the meteor app, cd inside `meteor-app` and run `meteor npm install`. Then run `npm start` to start the meteor app using `settings.json` as the settings file.

To start the python app, cd inside `python-app` and run `pip install requirements.txt` to install the `requests` package needed by the script. Then, run the script passing the username and password of the meteor app's admin account as arguments: `python meteor-rest.py admin password`.

If all goes well, the meteor app running on `localhost:3000` should display a GitHub and a StackOverflow link in the list of links, which were both created on request of the pythong script.

## How this works

### Meteor
The Meteor app inside `meteor-app` is pretty much the basic meteor react skeleton, with added ability of creating and deleting documents in the Links collection. Moreover, it uses:
- `accounts-password` to set up user accounts
- `mdg:validated-method`for built-in validation and being able to easily call methods from server
- `alanning:roles` to enable roles for the users
- `nimble:restivus`to create REST API endpoints

The api endpoints for the Links collection are defined in `imports/api/links/server/rest.js`. There are two routes: one allows for any requests to create a link, the other only allows requests that have been authenticated as a user with an admin role.

Note that while restivus has built-in role checking, it doesn't seem to work the latest version of alanning:roles (v3), that's why I'm doing a manual check - see https://github.com/kahmali/meteor-restivus/issues/305

The app creates an `admin` user on startup, at `server/fixtures.js`, reading username, email and password from the `settings.json` file. In a production environment, you'd keep this file secret and avoid committing it to version control, as it's likely to contain other private keys to be used withing the app. Alternativetl, you could set the amdin's password to `Random.secret()`, then call `Accounts.sendResetPasswordEmail(adminUserId)` to have the admin reset their password manually.

### Python
The python script inside `python-app` is a simple python script to submit requests to the endpoints defined in the meteor application. You run it by passing the username and password of the admin account: `python meteor-rest.py admin password` to avoid storing secrets in the script. It first makes a request to the public endpoint `api/links/insert/public` to create a link to GitHub. Then, it uses the username and password to authenticate as the admin user, and get an authorization token back. That token is used to make a request to the private endpoint `api/links/insert/private` to create a link to StackOverflow. Finally, it logs out.

## Testing in production
This approach has been tested by deploying the meteor app to a digital ocean droplet via [meteor-up](http://meteor-up.com/), and running the python script from both my local machine or another droplet - works like a charm. Just make sure to change the `protocol`, `url` and `port` parameters in the python script accordingly.
