# jquery-appear-original

This is a total revamp of original jquery.appear plugin hosted on http://code.google.com/p/jquery-appear/

[Demo page](http://morr.github.com/appear.html)

This plugin can be used to prevent unnecessary processing for content that is hidden or is outside of the browser viewport.

It implements a custom *appear*/*disappear* events which are fired when an element became visible/invisible in the browser viewport by scrolling or resizing the window, or optionally by scrolling other specified elements.

The `appear` event will be fired once for each element when it becomes visible.

The `disappear` event will be fired once for each element that was visible before (and `appear` event was fired) and it becomes invisible after that. The `disappear` event will not fire for elements that were never visible.

### Limitations

#### Manipulation of DOM not tracked
Manipulation of the DOM will not trigger the `appear` or `disappear` events. Therefore, if you manipulate the DOM in a way that might change the layout (and therefore visibility) you should call `$.force_appear()` to trigger an appearance check.

Performing the visibility check may trigger a browser reflow, i.e. is computationally expensive - use sparingly.

#### Visibility check limitations
Visibility check is done with respect to the (browser) `window` as viewport. An element might become invisible to the user if contained in another scrolling element, but `disappear` event will not fire unless it is scrolled outside the window viewport. Likewise, an `appear` event might be fired although the element is not (yet) visible to the user, if element is contained in another scrolling element.

The visibility check is not 100% precise, for example an element might be actually invisible because it is covered by scroll bars, but the corresponding events will not fire unless the entire element is outside the window viewport.

#### No teardown functions
There is not teardown functionality, i.e. once initialized the visibility check will remain operational in scroll and resize handlers.

There is no function to remove elements from the visibility check. However you can work around that by using a class dedicated to the visibility check (example "track") and subsequently removing that class from elements you no longer want to track: `$.appear(".track.myelements")` will only track elements that have both classes "track" and "myelements".

## Installation

yarn

```sh
yarn add jquery-appear-original
```

npm

```sh
npm i -S jquery-appear-original
```

## Usage

### Step 1: Initialize plugin

You must specify which elements you want to track the visibilty for, either by using 'someselector' or by initializing the plugin on a jQuery object:

```javascript
  $.appear('someselector', {  // 'someselector' identifies the elements to check for appearance (selector or jQuery object)
    interval: 250,          // interval in milliseconds for checking for appearance (default 250ms)
    force_process: false,   // if true, will do appearance check and trigger events upon initialization (default false)
    scroll_selector: "#myscroller"  // selector or jQuery object for elements to check for scrolling (default: window)
  });

  $('<div>test</div>').appear(); // It also supports raw DOM nodes wrapped in jQuery.
```

### Step 2: Hook up your event handlers

```javascript
  $('someselector').on('appear', function(event, $all_appeared_elements) {
    // this element is now inside browser viewport
  });
  $('someselector').on('disappear', function(event, $all_disappeared_elements) {
    // this element is now outside browser viewport
  });
```
### Additional options and functions

If you want to fire *appear* event for elements which are close to viewport but are not visible yet, you may add data attributes *appear-top-offset* and *appear-left-offset* to DOM nodes.

```html
  <div class="postloader" data-appear-top-offset="600">...</div> # appear will be fired when an element is below browser viewport for 600 or less pixels
```

Appear check can be forced by calling `$.force_appear()`. This is suitable in cases when page is in initial state (not scrolled and not resized) and when you want manually trigger appearance check, for example because you manipulated the DOM (changing layout or adding or removing elements).

Also this plugin provides a custom jQuery filter for manually checking element appearance.

```javascript
  $('someselector').is(':appeared')
```

Note that according to the jQuery documentation https://api.jquery.com/is/#is-selector the `.is()` method will return true if at least one of the selected elements is visible by the definition of this plugin.w

## License
[MIT](http://opensource.org/licenses/MIT)
