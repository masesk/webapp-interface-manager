# webapp-interace-manager
Web Application Inteface Manager (WAIM) allows the users to show multiple displays served locally or on the web.
WAIM also supports React components; allowing users to add their render components directly to the widget manager.

![Presentation](./capture.jpg)

## Features
* Add widgets based on their URL.
* Add widgets as React components.

## Planned
* Local (browser) storage for all the user configurations.
* Support for database storage.
* Inter-widget communication using Javascript events.
* User management and authentication.
* User autherization and widget access levels.
* Remote, OS-level, application UI rendering as a widget.

## Install

```
npm install
```

## Run
```
npm run
```


## Add Widgets

### StaticWindow and Constants

StaticWindow requires an `appid` field. `appid` referrences the `src/constants.js` to retrieve information about the app.
For each new app in `src/constants.js`, provide:

* `appid`: key of the new object and the `appid` field. Must be unique otherwise it overrides an existing app.

* `title`: title of the app. Shown to the user in the menus and at the bottom and top bars.

* `width`: width of the window that displays the url or React component.

* `height`: height of the window that displays the url or React component.

* (OPTIONAL) `url`: url of the page to be displayed. If React components are used, leave this empty.

* (OPTIONAL) `single`: true or false; whether the manager can spawn a single instance or multiple instance of the app. `false` by default

* (OPTIONAL) `deletable`: true or false; whether the user can delete the app. `false` by default.

### As URL to a page

#### In Code
Using `StaticWindow` React component, reference the `id` that uses the URL you need. 

Example:
1. Change `src/constants.js` to include your new app
```
export const BUILT_IN_APPS = {
    .
    ..
    ...
    mynewapp: {
        appid: "mynewapp",
        title: "My New App",
        width: 800,
        height: 600,
        url: "http://mywebsite.com"
    },
}
```
2. Add a new StaticWindow component to `WidgetManager.js`

```
 {/* Add all static windows/apps below */}
 <StaticWindow appid="mynewapp"/>
```
#### In browser
After running the widget manager, navigate to the top left and open `Add Widget` window to add new widget providing `appid`, `title`, `url`, `width`, `height`, `deletable`, and `single` from the UI selection.

The `Add Widget` React component uses the `createWindow` redux action passing in the mentioned parameters. Any other React component can perform this action, given it connects to the Redux store.
See `src/apps/AddWidget.js` for a working example.

### As a React Component
Using `StaticWindow` React component, reference the `id` that uses the URL you need. 

Example:
1. Change `src/constants.js` to include your new app
```
export const BUILT_IN_APPS = {
    .
    ..
    ...
    mynewapp: {
        appid: "mynewapp",
        title: "My New App",
        width: 800,
        height: 600
    },
}
```
2. Add a new StaticWindow component to `WidgetManager.js`, referencing the `appid` and including your custom component as its child component
```
{/* Add all static windows/apps below */}
 <StaticWindow appid="mynewapp">
    <MyCustomReactComponent/>
 </Static App>
```

## Modify

### Header
* Change `WAIM` to any text or image in `src/main/Header.js`.
* Change the header green background in `src/css/App.css`. Refer to `.header` class.

### Footer
* Change the footer colors in `src/css/App.css`. Refer to class `.footer`.
* Change the minimize bar in `src/main/MinBar.js`
* Change the minimize bar colors in `src/css/App.css`. Refer to `.min-bar`, `.min-bar-close` and `.min-bar-title` classes.

### Window
* Change the window structure and buttons from `src/main/Window.js`
* Change the window layout and colors from `src/css/App.css`. Refer to `.window`.


## Build

Run the command
```
npm run build
```
This will generate a directory named `build`. The `build` directory will contain the newly generate WAIM; with all the custom configurations from `src/constants.js` and all your custom React components. 

## Try
Try out the latest release:
[https://masesk.github.io/webapp-interface-manager](https://masesk.github.io/webapp-interface-manager)

