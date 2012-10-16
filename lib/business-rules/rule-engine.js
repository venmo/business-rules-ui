var global = this;

(function() {
  var standardOperators = {
    present: function(actual, target) {
      return !!actual;
    },
    blank: function(actual, target) {
      return !actual;
    },
    equalTo: function(actual, target) {
      return "" + actual === "" + target;
    },
    notEqualTo: function(actual, target) {
      return "" + actual !== "" + target;
    },
    greaterThan: function(actual, target) {
      return parseFloat(actual, 10) > parseFloat(target, 10);
    },
    greaterThanEqual: function(actual, target) {
      return parseFloat(actual, 10) >= parseFloat(target, 10);
    },
    lessThan: function(actual, target) {
      return parseFloat(actual, 10) < parseFloat(target, 10);
    },
    lessThanEqual: function(actual, target) {
      return parseFloat(actual, 10) <= parseFloat(target, 10);
    },
    includes: function(actual, target) {
      return ("" + actual).indexOf("" + target) > -1;
    },
    matchesRegex: function(actual, target) {
      var r = target.replace(/^\/|\/$/g, "");
      var regex = new RegExp(r);
      return regex.test("" + actual);
    }
  };

  var RuleEngine = global.RuleEngine = function RuleEngine(rule) {
    rule = rule || {};
    this.operators = {};
    this.actions = rule.actions || [];
    this.conditions = rule.conditions || {all: []};
    this.addOperators(standardOperators);
  }

  RuleEngine.prototype = {
    run: function(conditionsAdapter, actionsAdapter) {
      var _this = this;
      this.matches(conditionsAdapter, function(result) {
        if (result) _this.runActions(actionsAdapter);
      });
    },

    matches: function(conditionsAdapter, cb) {
      var out, err;
      handleNode(this.conditions, conditionsAdapter, this, function(e, result) {
        if (e) {
          err = e;
          console.log("ERR", e.message, e.stack);
        }
        out = result;
        if (cb) cb(e, result);
      });
      if (err) throw err;
      if (!cb) return out;
    },

    operator: function(name) {
      return this.operators[name];
    },

    addOperators: function(newOperators) {
      var _this = this;
      for(var key in newOperators) {
        if(newOperators.hasOwnProperty(key)) {
          (function() {
            var op = newOperators[key];
            // synchronous style operator, needs to be wrapped
            if (op.length == 2) {
              _this.operators[key] = function(actual, target, cb) {
                try {
                  var result = op(actual, target);
                  cb(null, result);
                } catch(e) {
                  cb(e);
                }
              };
            }
            // asynchronous style, no wrapping needed
            else if (op.length == 3) {
              _this.operators[key] = op;
            }
            else {
              throw "Operators should have an arity of 2 or 3; " + key + " has " + op.length;
            }
          })();
        }
      }
    },

    runActions: function(actionsAdapter) {
      for(var i=0; i < this.actions.length; i++) {
        var actionData = this.actions[i];
        var actionName = actionData.value;
        var actionFunction = actionsAdapter[actionName]
        if(actionFunction) { actionFunction(new Finder(actionData)); }
      }
    }
  };

  function Finder(data) {
    this.data = data;
  }

  Finder.prototype = {
    find: function() {
      var currentNode = this.data;
      for(var i=0; i < arguments.length; i++) {
        var name = arguments[i];
        currentNode = findByName(name, currentNode);
        if(!currentNode) { return null; }
      }
      return currentNode.value;
    }
  };

  function findByName(name, node) {
    var fields = node.fields || [];
    for(var i=0; i < fields.length; i++) {
      var field = fields[i];
      if(field.name === name) { return field; }
    }
    return null;
  }

  function handleNode(node, obj, engine, cb) {
    if(node.all || node.any) {
      handleConditionalNode(node, obj, engine, cb);
    } else {
      handleRuleNode(node, obj, engine, cb);
    }
  }

  function handleConditionalNode(node, obj, engine, cb) {
    try {
      var isAll = !!node.all;
      var nodes = isAll ? node.all : node.any;
      if (nodes.length == 0) return cb(null, true);
      var currentNode, i = 0;
      var next = function() {
        try {
          currentNode = nodes[i];
          i++;
          if (currentNode) {
            handleNode(currentNode, obj, engine, done);
          }
          else {
            // If we have gone through all of the nodes and gotten
            // here, either they have all been true (success for `all`)
            // or all false (failure for `any`);
            cb(null, isAll);
          }
        } catch(e) {
          cb(e);
        }
      };

      var done = function(err, result) {
        if (err) return cb(err);
        if (isAll && !result) return cb(null, false);
        if (!isAll && !!result) return cb(null, true);
        next();
      }
      next();
    } catch(e) {
      cb(e);
    }
  }

  function handleRuleNode(node, obj, engine, cb) {
    try {
      var value = obj[node.name];
      if (value && value.call) {
        if (value.length === 1) {
          return value(function(result) {
            compareValues(result, node.operator, node.value, engine, cb);
          });
        }
        else {
          value = value()
        }
      }
      compareValues(value, node.operator, node.value, engine, cb);
    } catch(e) {
      cb(e);
    }
  }

  function compareValues(actual, operator, value, engine, cb) {
    try {
      var operatorFunction = engine.operator(operator);
      if (!operatorFunction) throw "Missing " + operator + " operator";
      operatorFunction(actual, value, cb);
    } catch(e) {
      cb(e);
    }
  }

})();
