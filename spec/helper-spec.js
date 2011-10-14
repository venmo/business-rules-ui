function context() {
  describe.apply(this, arguments);
}

beforeEach(function() {
  this.addMatchers({
    toHave: function(selector) {
      return this.actual.find(selector).length > 0;
    }
  });
});
