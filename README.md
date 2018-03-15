# Ember - Web API

[![Ember Observer Score](http://emberobserver.com/badges/ember-web-api.svg)](http://emberobserver.com/addons/ember-web-api)
[![npm version](https://badge.fury.io/js/ember-web-api.svg)](http://badge.fury.io/js/ember-web-api)
[![Travis CI Status](https://travis-ci.org/CrshOverride/ember-web-api.svg?branch=master)](https://travis-ci.org/CrshOverride/ember-web-api.svg?branch=master)
[![codecov.io](https://codecov.io/github/CrshOverride/ember-web-api/coverage.svg?branch=master)](https://codecov.io/github/CrshOverride/ember-web-api?branch=master)

This project is simply a Serializer and Adapter for working with Microsoft ASP.NET Web API endpoints.

## Usage

### Prerequisites

Currently, the Serializer assumes that your Web API endpoint's response will contain `camelCased` property names rather than the default .NET `PascalCase` names.

Luckily, [Newtonsoft's JSON.NET](http://www.newtonsoft.com/json) makes this relatively trivial and it's already the default serializer, so you're all set. You just need to add the following code to your API's startup configuration:

```csharp
var formatters = GlobalConfiguration.Configuration.Formatters;
var jsonFormatter = formatters.JsonFormatter;
var settings = jsonFormatter.SerializerSettings;
settings.Formatting = Formatting.Indented;
settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
```

### Installation

Installation is a breeze. You just need to ensure that you install the proper version of Ember Web API for your version of Ember Data.

If you're using Ember Data 2.0+, you're in luck! You can just install the latest stable release:

```
ember install ember-web-api
```

For versions between 1.13.0 and 1.13.15, you should be on the `0.0.7` release:

```
ember install ember-web-api@0.0.7
```

If you're using an older version of Ember, you'll have to use one of the older releases:

```
ember install ember-web-api@0.0.5
```

### Usage

First, generate your application Adapter:

```
ember generate adapter application
```

And then modify your code to extend the Web API Adapter instead:

```javascript
import WebApiAdapter from 'ember-web-api/adapters/web-api';

export default WebApiAdapter.extend({
});
```

Now do the same for the Serializer:

```
ember generate serializer application
```

```javascript
import WebApiSerializer from 'ember-web-api/serializers/web-api';

export default WebApiSerializer.extend({

});
```

That's it! Your application should now be configured to consume Web API endpoints.

### Extending and Configuring
The Web API Adapter and Serializer both extend Ember Data's DS.RESTAdapter and DS.RESTSerializer and accept the same options.

## Contributing
------------------------------------------------------------------------------

Installation
------------------------------------------------------------------------------

```
ember install my-addon
```


Usage
------------------------------------------------------------------------------

[Longer description of how to use the addon in apps.]


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd my-addon`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `npm test` – Runs `ember try:each` to test your addon against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).
>>>>>>> 1206dc0... message

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
