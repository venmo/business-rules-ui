(function($) {
  $.fn.conditionsBuilder = function(options) {
    if(options == "data") {
      var builder = $(this).eq(0).data("conditionsBuilder");
      return builder.collectData();
    } else {
      return $(this).each(function() {
        var builder = new ConditionsBuilder(this, options);
        $(this).data("conditionsBuilder", builder);
      });
    }
  };

  function ConditionsBuilder(element, options) {
    this.element = $(element);
    this.options = options || {};
    this.init();
  }

  ConditionsBuilder.prototype = {
    init: function() {
      this.fields = this.options.fields;
      this.data = this.options.data || {"all": []};
      var rules = this.buildRules(this.data);
      this.element.html(rules);
    },

    collectData: function() {
      return this.collectDataFromNode(this.element.find("> .conditional"));
    },

    collectDataFromNode: function(element) {
      var klass = null;
      var _this = this;
      if(element.is(".conditional")) {
        klass = element.find("> .all-any-wrapper > .all-any").val();
      }

      if(klass) {
        var out = {};
        out[klass] = [];
        element.find("> .conditional, > .rule").each(function() {
          out[klass].push(_this.collectDataFromNode($(this)));
        });
        return out;
      }
      else {
        return {
          name: element.find(".field").val(),
          operator: element.find(".operator").val(),
          value: element.find(".value").val()
        };
      }
    },

    buildRules: function(ruleData) {
      return this.buildConditional(ruleData) || this.buildRule(ruleData);
    },

    buildConditional: function(ruleData) {
      var kind;
      if(ruleData.all) { kind = "all"; }
      else if(ruleData.any) { kind = "any"; }
      if(!kind) { return; }

      var div = $("<div>", {"class": "conditional " + kind});
      var selectWrapper = $("<div>", {"class": "all-any-wrapper"});
      var select = $("<select>", {"class": "all-any"});
      select.append($("<option>", {"value": "all", "text": "All", "selected": kind == "all"}));
      select.append($("<option>", {"value": "any", "text": "Any", "selected": kind == "any"}));
      selectWrapper.append(select);
      selectWrapper.append($("<span>", {text: "of the following rules:"}));
      div.append(selectWrapper);

      var addRuleLink = $("<a>", {"href": "#", "class": "add-rule", "text": "Add Rule"});
      var _this = this;
      addRuleLink.click(function(e) {
        e.preventDefault();
        var f = _this.fields[0];
        var newField = {name: f.value, operator: f.operators[0], value: null};
        div.append(_this.buildRule(newField));
      });
      div.append(addRuleLink);

      var addConditionLink = $("<a>", {"href": "#", "class": "add-condition", "text": "Add Sub-Condition"});
      addConditionLink.click(function(e) {
        e.preventDefault();
        var f = _this.fields[0];
        var newField = {"all": [{name: f.value, operator: f.operators[0], value: null}]};
        div.append(_this.buildConditional(newField));
      });
      div.append(addConditionLink);

      var removeLink = $("<a>", {"class": "remove", "href": "#", "text": "Remove This Sub-Condition"});
      removeLink.click(function(e) {
        e.preventDefault();
        div.remove();
      });
      div.append(removeLink);

      var rules = ruleData[kind];
      for(var i=0; i<rules.length; i++) {
        div.append(this.buildRules(rules[i]));
      }
      return div;
    },

    buildRule: function(ruleData) {
      var div = $("<div>", {"class": "rule"});
      var fieldSelect = $("<select>", {"class": "field"});
      var operatorSelect = $("<select>", {"class": "operator"});
      var _this = this;

      for(var i=0; i < this.fields.length; i++) {
        var field = this.fields[i];
        var option = $("<option>", {
          text: field.label, 
          value: field.name, 
          selected: ruleData.name == field.name
        });
        option.data("options", field.options);
        fieldSelect.append(option);
      }
      div.append(fieldSelect);

      fieldSelect.change(function(e) {
        var operators = _this.operatorsFor($(this).val());
        operatorSelect.empty();
        for(var i=0; i < operators.length; i++) {
          var operator = operators[i];
          var option = $("<option>", {
            text: operator.label || operator.name, 
            value: operator.name, 
            selected: ruleData.operator == operator.name
          });
          option.data("fieldType", operator.fieldType);
          operatorSelect.append(option);
        }
        operatorSelect.change();
      });

      div.append(operatorSelect);
      
      operatorSelect.change(function(e) {
        var option = $(this).find("> :selected");
        var currentValue = div.find(".value");
        var val = currentValue.val();

        switch(option.data("fieldType")) {
          case "none": 
            operatorSelect.after($("<input>", {"type": "hidden", "class": "value"}));
            break;
          case "text":
            operatorSelect.after($("<input>", {"type": "text", "class": "value"}));
            break;
          case "select":
            var select = $("<select>", {"class": "value"});
            var options = fieldSelect.find("> :selected").data("options");
            for(var i=0; i < options.length; i++) {
              var opt = options[i];
              select.append($("<option>", {"text": opt.label || opt.name, "value": opt.name}));
            }
            operatorSelect.after(select);
            break;
        }
        currentValue.remove();
      });

      var removeLink = $("<a>", {"class": "remove", "href": "#", "text": "Remove"});
      removeLink.click(function(e) {
        e.preventDefault();
        div.remove();
      });
      div.append(removeLink);

      fieldSelect.change();
      div.find("> .value").val(ruleData.value);
      return div;
    },

    operatorsFor: function(fieldName) {
      for(var i=0; i < this.fields.length; i++) {
        var field = this.fields[i];
        if(field.name == fieldName) {
          return field.operators;
        }
      }
    }
  };

})(jQuery);
