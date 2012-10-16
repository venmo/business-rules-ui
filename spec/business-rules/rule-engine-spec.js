describe('BusinessRules.RuleEngine', function() {
  var engine;

  beforeEach(function() {
    engine = new BusinessRules.RuleEngine();
  });

  describe('initialization', function() {
    var rule, conditions, actions;
    beforeEach(function() {
      conditions = jasmine.createSpy("conditions");
      actions = jasmine.createSpy("actions");
      rule = {conditions: conditions, actions: actions};
      engine = new BusinessRules.RuleEngine(rule);
    });

    it('adds the given conditions', function() {
      expect(engine.conditions).toEqual(conditions);
    });

    it('adds the given actions', function() {
      expect(engine.actions).toEqual(actions);
    });
  });

  describe('standard operators', function() {
    describe('present', function() {
      beforeEach(function() {
        engine.conditions = {all: [{name: "name", operator: "present", value: null}]};
      });

      it('matches a truthy value', function() {
        expect(engine.matches({name: "Chris"})).toBeTruthy();
      });

      it('does not match a falsy value', function() {
        expect(engine.matches({name: ""})).toBeFalsy();
      });
    });

    describe('blank', function() {
      beforeEach(function() {
        engine.conditions = {all: [{name: "name", operator: "blank", value: null}]};
      });

      it('matches a falsy value', function() {
        expect(engine.matches({name: ""})).toBeTruthy();
      });

      it('does not match a truthy value', function() {
        expect(engine.matches({name: "Chris"})).toBeFalsy();
      });
    });

    describe('equalTo', function() {
      beforeEach(function() {
        engine.conditions = {all: [{name: "num", operator: "equalTo", value: "123"}]};
      });

      it('returns true with matching string', function() {
        expect(engine.matches({num: "123"})).toBeTruthy();
      });

      it('returns true with matching integer', function() {
        expect(engine.matches({num: 123})).toBeTruthy();
      });

      it('returns false otherwise', function() {
        expect(engine.matches({num: "124"})).toBeFalsy();
      });
    });

    describe('notEqualTo', function() {
      beforeEach(function() {
        engine.conditions = {all: [{name: "num", operator: "notEqualTo", value: "123"}]};
      });

      it('returns false with matching string', function() {
        expect(engine.matches({num: "123"})).toBeFalsy();
      });

      it('returns false with matching integer', function() {
        expect(engine.matches({num: 123})).toBeFalsy();
      });

      it('returns true otherwise', function() {
        expect(engine.matches({num: "124"})).toBeTruthy();
      });
    });

    describe('greaterThan', function() {
      beforeEach(function() {
        engine.conditions = {all: [{name: "num", operator: "greaterThan", value: "123"}]};
      });

      it('returns false when greater than value', function() {
        expect(engine.matches({num: 124})).toBeTruthy();
        expect(engine.matches({num: "124"})).toBeTruthy();
        expect(engine.matches({num: "123.5"})).toBeTruthy();
      });

      it('returns false when equal value', function() {
        expect(engine.matches({num: 123})).toBeFalsy();
        expect(engine.matches({num: "123"})).toBeFalsy();
        expect(engine.matches({num: "123.000"})).toBeFalsy();
      });

      it('returns false when less than value', function() {
        expect(engine.matches({num: 122})).toBeFalsy();
        expect(engine.matches({num: "122"})).toBeFalsy();
        expect(engine.matches({num: "122.5"})).toBeFalsy();
      });
    });

    describe('greaterThanEqual', function() {
      beforeEach(function() {
        engine.conditions = {all: [{name: "num", operator: "greaterThanEqual", value: "123"}]};
      });

      it('returns false when greater than value', function() {
        expect(engine.matches({num: 124})).toBeTruthy();
        expect(engine.matches({num: "124"})).toBeTruthy();
        expect(engine.matches({num: "123.5"})).toBeTruthy();
      });

      it('returns true when equal value', function() {
        expect(engine.matches({num: 123})).toBeTruthy();
        expect(engine.matches({num: "123"})).toBeTruthy();
        expect(engine.matches({num: "123.000"})).toBeTruthy();
      });

      it('returns false when less than value', function() {
        expect(engine.matches({num: 122})).toBeFalsy();
        expect(engine.matches({num: "122"})).toBeFalsy();
        expect(engine.matches({num: "122.5"})).toBeFalsy();
      });
    });

    describe('lessThan', function() {
      beforeEach(function() {
        engine.conditions = {all: [{name: "num", operator: "lessThan", value: "123"}]};
      });

      it('returns false when greater than value', function() {
        expect(engine.matches({num: 124})).toBeFalsy();
        expect(engine.matches({num: "124"})).toBeFalsy();
        expect(engine.matches({num: "123.5"})).toBeFalsy();
      });

      it('returns false when equal value', function() {
        expect(engine.matches({num: 123})).toBeFalsy();
        expect(engine.matches({num: "123"})).toBeFalsy();
        expect(engine.matches({num: "123.000"})).toBeFalsy();
      });

      it('returns true when less than value', function() {
        expect(engine.matches({num: 122})).toBeTruthy();
        expect(engine.matches({num: "122"})).toBeTruthy();
        expect(engine.matches({num: "122.5"})).toBeTruthy();
      });
    });

    describe('lessThanEqual', function() {
      beforeEach(function() {
        engine.conditions = {all: [{name: "num", operator: "lessThanEqual", value: "123"}]};
      });

      it('returns false when greater than value', function() {
        expect(engine.matches({num: 124})).toBeFalsy();
        expect(engine.matches({num: "124"})).toBeFalsy();
        expect(engine.matches({num: "123.5"})).toBeFalsy();
      });

      it('returns true when equal value', function() {
        expect(engine.matches({num: 123})).toBeTruthy();
        expect(engine.matches({num: "123"})).toBeTruthy();
        expect(engine.matches({num: "123.000"})).toBeTruthy();
      });

      it('returns true when less than value', function() {
        expect(engine.matches({num: 122})).toBeTruthy();
        expect(engine.matches({num: "122"})).toBeTruthy();
        expect(engine.matches({num: "122.5"})).toBeTruthy();
      });
    });

    describe('includes', function() {
      beforeEach(function() {
        engine.conditions = {all: [{name: "name", operator: "includes", value: "Joe"}]};
      });

      it('returns true when value is included', function() {
        expect(engine.matches({name: "Joe Smith"})).toBeTruthy();
      });

      it('returns false when value is not included', function() {
        expect(engine.matches({name: "Giuseppe"})).toBeFalsy();
      });
    });

    describe('matchesRegex', function() {
      beforeEach(function() {
        engine.conditions = {all: [{
          name: "num", 
          operator: "matchesRegex", 
          value: "/\\(\\d{3}\\) \\d{3}-\\d{4}/"
        }]};
      });

      it('returns true when value matches Regex', function() {
        expect(engine.matches({num: "(123) 456-7890"})).toBeTruthy();
      });

      it('returns false when value does not match Regex', function() {
        expect(engine.matches({num: "123.456.7890"})).toBeFalsy();
      });
    });
  });

  describe('with a callback', function() {
    describe("with async operators", function() {
      beforeEach(function() {
        engine.addOperators({
          delayedEqualTo: function(actual, target, done) {
            var delayed = function() { done("" + actual === "" + target); };
            setTimeout(delayed, 1);
          }
        });
        engine.conditions = {all: [{name: "num", operator: "delayedEqualTo", value: "123"}]};
      });

      it("calls the callback for async matchers", function() {
        var cb = jasmine.createSpy("listener");
        cb.myName = "woot";
        engine.matches({num: 123}, cb);
        waits(10);
        runs(function() {
          expect(cb).toHaveBeenCalledWith(true);
        });
      });
    });

    describe("with synchronous operators", function() {
      beforeEach(function() {
        engine.conditions = {all: [{name: "num", operator: "equalTo", value: "123"}]};
      });

      it("calls the callback", function() {
        var cb = jasmine.createSpy("listener");
        engine.matches({num: 123}, cb);
        expect(cb).toHaveBeenCalledWith(true);
      });
    });

    describe("with asynchronous value functions", function() {
      beforeEach(function() {
        engine.conditions = {all: [{name: "num", operator: "equalTo", value: "123"}]};
      });

      it("calls the callback after running the logic", function() {
        var cb = jasmine.createSpy("listener");
        var adapter = {
          num: function(done) {
            setTimeout(function() {
              done(123);
            }, 5);
          }
        };
        engine.matches(adapter, cb);
        waits(10);
        runs(function() {
          expect(cb).toHaveBeenCalledWith(true);
        });
      });
    });
  });

  describe('custom operators', function() {
    beforeEach(function() {
      engine.conditions = {all: [{name: "name", operator: "longerThan", value: "5"}]};
      engine.addOperators({
        longerThan: function(actual, length) {
          return actual.length > parseInt(length, 10);
        }
      });
    });

    it('uses custom logic from added operators', function() {
      expect(engine.matches({name: "Joe"})).toBeFalsy();
      expect(engine.matches({name: "Giuseppe"})).toBeTruthy();
    });
  });

  describe('complex logic', function() {
    beforeEach(function() {
      engine.conditions = {all: [
        {name: "name", operator: "present", value: null},
        {any: [
          {name: "age", operator: "greaterThanEqual", value: "18"},
          {name: "permissionSlipSigned", operator: "present", value: null}
        ]}
      ]};
    });

    it('matches nested all/any conditions', function() {
      expect(engine.matches({name: "Joe", age: 22})).toBeTruthy();
      expect(engine.matches({name: "Joe", age: 17, permissionSlipSigned: true})).toBeTruthy();
      expect(engine.matches({name: "Joe", age: 17, permissionSlipSigned: false})).toBeFalsy();
      expect(engine.matches({name: "Joe", age: 17})).toBeFalsy();
      expect(engine.matches({name: "", age: 22})).toBeFalsy();
    });
  });

  describe('matching with empty conditions', function() {
    beforeEach(function() {
      engine.rule = {
        conditions: {all: []} 
      };
    });

    it('returns true', function() {
      expect(engine.matches({anything: "whatever"})).toBeTruthy();
    });
  });

  describe('runActions', function() {
    var action1, action2;
    beforeEach(function() {
      action1 = jasmine.createSpy('action1');
      action2 = jasmine.createSpy('action2');

      engine.actions = [
        {name: "action-select", value: "action1", fields: [
          {name: "message", value: "hello"}
        ]},
        {name: "action-select", value: "action2", fields: [
          {name: "a", value: "value a", fields: [
            {name: "b", value: "value b", fields: [
              {name: "c", value: "value c"},
              {name: "d", value: "value d"}
            ]}
          ]}
        ]}
      ];

      engine.runActions({action1: action1, action2: action2});
    });

    it('runs the actions', function() {
      expect(action1).toHaveBeenCalled();
      expect(action2).toHaveBeenCalled();
    });

    context("using Finder", function() {
      it('runs actions with the data with a finder', function() {
        var finder = action2.argsForCall[0][0];
        expect(finder.find("a")).toEqual("value a");
        expect(finder.find("a", "b")).toEqual("value b");
        expect(finder.find("a", "b", "c")).toEqual("value c");
        expect(finder.find("a", "b", "d")).toEqual("value d");
      });

      it('still gives you ', function() {
        expect().toEqual();
      });
    });
  });

  describe('run', function() {
    var conditions, actions;
    beforeEach(function() {
      spyOn(engine, "runActions");
      conditions = jasmine.createSpy("conditions");
      actions = jasmine.createSpy("actions");
    });

    context("with matching conditions", function() {
      beforeEach(function() {
        spyOn(engine, "matches").andCallFake(function(conditions, cb) {
          cb(true);
        });
        engine.run(conditions, actions);
      });

      it('runs the actions', function() {
        expect(engine.runActions).toHaveBeenCalledWith(actions);
      });
    });

    context("without matching conditions", function() {
      beforeEach(function() {
        spyOn(engine, "matches").andReturn(false);
        engine.run(conditions, actions);
      });

      it('runs the actions', function() {
        expect(engine.runActions).not.toHaveBeenCalled();
      });
    });
  });
});
