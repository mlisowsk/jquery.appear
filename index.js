(function ($) {
  var selectors = [];   // selectors for elements to monitor for appearance

  var checkBinded = false;  // remember whether we bound onCheck handler to scroll and resize events
  var checkLock = false;    // for throttling: skip check if true
  var defaults = {
    interval: 250,
    force_process: false,
    scroll_selector: window
  };
  var $window = $(window);

  var $priorAppeared = [];  // remembers jQ elements that we have fired appear event for, indexed by selector

  function isAppeared() {
    return $(this).is(':appeared');
  }

  function isNotTriggered() {
    return !$(this).data('_appear_triggered');
  }

  // checks elements for visibility and triggers appear or disappear event accordingly
  function process() {
    checkLock = false;  // remove throttling lock

    for (var index = 0, selectorsLength = selectors.length; index < selectorsLength; index++) {
      var $appeared = $(selectors[index]).filter(isAppeared); // all elements that are :appeared (i.e. visible to user)

      $appeared
        .filter(isNotTriggered)   // filter out already triggered elements
        .data('_appear_triggered', true)  // set triggered flag on element
        .trigger('appear', [$appeared]);  // trigger the event
      // handle disappear event
      if ($priorAppeared[index]) {
        var $disappeared = $priorAppeared[index].not($appeared);  // previously appear-ed elements minus those that have not appeared now
        $disappeared
          .data('_appear_triggered', false) // remove flag on element
          .trigger('disappear', [$disappeared]);  // trigger event
      }
      $priorAppeared[index] = $appeared;  // for each selector, remember elements that we have triggered 'appear' for
    }
  }

  function addSelector(selector) {
    selectors.push(selector);
    $priorAppeared.push();  // add an empty entry
  }

  // ":appeared" custom filter
  $.expr.pseudos.appeared = $.expr.createPseudo(function (_arg) {
    return function (element) {
      var $element = $(element);

      if (!$element.is(':visible')) {
        return false;
      }

      var windowLeft = $window.scrollLeft();
      var windowTop = $window.scrollTop();
      var offset = $element.offset();
      var left = offset.left;
      var top = offset.top;

      if (top + $element.height() >= windowTop &&
          top - ($element.data('appear-top-offset') || 0) <= windowTop + $window.height() &&
          left + $element.width() >= windowLeft &&
          left - ($element.data('appear-left-offset') || 0) <= windowLeft + $window.width()) {
        return true;
      }
      return false;
    };
  });
  // add as 'appear' plugin, so we can call $("something").appear(selector, options) and it will use the jQ object to apply appear on:
  $.fn.extend({
    // watching for element's appearance in browser viewport
    appear: function (selector, options) {
      $.appear(this, options);
      return this;
    }
  });
  // extend jQuery object with appear() function, so we can call $.appear(selector, options):
  $.extend({
    appear: function (selector, options) {
      var opts = $.extend({}, defaults, options || {});
      // bind event handler
      if (typeof $(opts.scroll_selector).data('appear_binded') === 'undefined') {
        var onCheck = function () { // scroll event handler
          if (checkLock) {  // throttle
            return;
          }
          checkLock = true;

          setTimeout(process, opts.interval);
        };

        $(opts.scroll_selector).on('scroll',on_check);  // bind onCheck handler to scroll
        $(window).resize(on_check);

        $(opts.scroll_selector).data('appear_binded',true); // remember we bound  our event handler
      }
      // trigger initial check, if specified in options:
      if (opts.force_process) {
        setTimeout(process, opts.interval);
      }

      addSelector(selector);
    },
    // force appearance check on elements
    force_appear: function () {
      if (typeof $(opts.scroll_selector).data('appear_binded') !== 'undefined') {
        process();
        return true;
      }
      return false;
    }
  });
}(function () {
  if (typeof module !== 'undefined') {
    // Node
    return require('jquery');
  }
  return jQuery;
}()));
