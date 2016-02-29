(function(app) {
  app.AppComponent =
    ng.core.Component({
      selector: 'graph-editor',
      template: '<h1>My First Angular 2 App: a graph editor</h1>'
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
