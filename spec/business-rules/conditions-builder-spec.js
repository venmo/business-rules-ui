describe('$.fn.conditionsBuilder', function() {
  var container;
  beforeEach(function() {
    container = $("<div>");
    container.conditionsBuilder();
  });

  describe('without options', function() {
    it('adds an empty "all" condition', function() {
      expect(container.find("div.conditional.all").length).toEqual(1);
    });
  });
});
