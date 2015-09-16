# Ember - Web API

[![Ember Observer Score](http://emberobserver.com/badges/ember-web-api.svg)](http://emberobserver.com/addons/ember-web-api)
[![npm version](https://badge.fury.io/js/ember-web-api.svg)](http://badge.fury.io/js/ember-web-api)
[![Travis CI Status](https://travis-ci.org/CrshOverride/ember-web-api.svg?branch=master)](https://travis-ci.org/CrshOverride/ember-web-api.svg?branch=master)

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

Installation is a breeze. Simply run (from your Ember CLI project):

```
ember install ember-web-api
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

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
