// Small shim to restore jQuery 1.x/2.x .load(imageHandler) shorthand used by some legacy plugins
// This avoids modifying third-party minified libs while keeping compatibility with jQuery 3+.
(function($){
  if (typeof $.fn.load === 'undefined') {
    $.fn.load = function(arg){
      // Only implement the old image shorthand usage: .load(handler) or .load() (no args)
      // Do NOT attempt to emulate the deprecated AJAX .load(url, ...) here — leave that to other polyfills.
      if (arguments.length === 0) {
        return this.trigger('load');
      }
      if (typeof arg === 'function') {
        return this.on('load', arg);
      }
      // For other signatures (e.g. .load(url,...)), do nothing — return the jQuery collection
      return this;
    };
  }
})(jQuery);
