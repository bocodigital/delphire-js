# Delphire.js

Delphire.js is a pure javascript implimentation of the Delphire Bridge in ES6.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installation

Follow the instructions below to install

```
npm i delphire-js-npm
```

Then include. Here is a sample using require

```
var delphireJsNpm = require("delphire-js-npm")
```

Call delphireJS

```
delphireJsNpm.delphireJS();
```
Lastly call the init function and a promise will be returned ocne the bridge recieves data from the app

```
Delphire.init().then(function(){
	document.getElementById('token').innerHTML = window.Delphire.params.token;
	document.getElementById('api').innerHTML = window.Delphire.params.url;
	document.getElementById('user').innerHTML = window.Delphire.params.currentUser.name;
});
```

## Available calls

In addition to the standard data returned from the Delphire bridge there are also methods for: 
 * Tracking

```
 var props = {"action":"open","createdAt":unicodetimestamp, "service":"LayoutService","target":{"description":"Main Layout","id":"$guid","type":"layout"}}
 window.Delphire.track(props);
```
 * Get a users employees (manager to employee relationships)

```
window.Delphire.getSubordinates().then(function(users){
	console.log(users)
}

returns a JSON objects of users in a promise
```

 * Inter Tile Linking to open one module from another

```
window.Delphire.internalLink({ key, payload })
```
 * Closing and Returning to the Dashboard

```
window.Delphire.close();
```
 * Opening Resources in Delphire

```
window.Delphire.openResource({ 'optimized', 'resourceId' }) 
```
 * Get a users manager (employee to manager relationships)

```
window.Delphire.getManager().then(function(manager){
	console.log(manager)
}

returns a JSON objects of manager in a promise
```


## Testing




## Authors
* **Frank Rue** - *Initial work* - [Delphire.js](http://gitlab.bocodigital.com/delphire/delphire-js)
* **Bruce Hubbard** - *Current build* - [Delphire.js](http://gitlab.bocodigital.com/delphire/delphire-js)

## License

This project is licensed under the MIT License
