(function($) {
  $.fn.actionsBuilder = function(options) {
    if(options == "data") {
      var builder = $(this).eq(0).data("actionsBuilder");
      return builder.collectData();
    } else {
      return $(this).each(function() {
        var builder = new ActionsBuilder(this, options);
        $(this).data("actionsBuilder", builder);
      });
    }
  };

  function ActionsBuilder(element, options) {
    this.element = $(element);
    this.options = options || {};
    this.init();
  }

  ActionsBuilder.prototype = {
    init: function() {
      this.fields = this.options.fields;
      this.data = this.options.data || [];
      var actions = this.buildActions(this.data);
      this.element.html(actions);
    },

    buildActions: function(data) {
      var container = $("<div>", {"class": "actions"});
      var buttons = $("<div>", {"class": "action-buttons"});
      var addButton = $("<a>", {"href": "#", "class": "add", "text": "Add Action"});
      var _this = this;

      addButton.click(function(e) {
        e.preventDefault();
        container.append(_this.buildAction({}));
      });

      buttons.append(addButton);
      container.append(buttons);

      for(var i=0; i < data.length; i++) {
        var actionObj = data[i];
        var actionDiv = this.buildAction(actionObj);

        // Add values to fields
        var fields = [actionObj];
        var field;
        while(field = fields.shift()) {
          actionDiv.find(":input[name='" + field.name + "']").val(field.value).change();
          if(field.fields) fields = fields.concat(field.fields);
        }
        container.append(actionDiv);
      }
      return container;
    },

    buildAction: function(data) {
      var field = this._findField(data.name);
      var div = $("<div>", {"class": "action"});
      var fieldsDiv = $("<div>", {"class": "subfields"});
      var select = $("<select>", {"class": "action-select", "name": "action-select"});

      for(var i=0; i < this.fields.length; i++) {
        var possibleField = this.fields[i];
        var option = $("<option>", {"text": possibleField.label, "value": possibleField.name});
        select.append(option);
      }

      var _this = this;
      select.change(function() {
        var val = $(this).val();
        var newField = _this._findField(val);
        fieldsDiv.empty();

        if(newField.fields) {
          for(var i=0; i < newField.fields.length; i++) {
            fieldsDiv.append(_this.buildField(newField.fields[i]));
          }
        }

        div.attr("class", "action " + val);
      });

      var removeLink = $("<a>", {"href": "#", "class": "remove", "text": "Remove Action"});
      removeLink.click(function(e) {
        e.preventDefault();
        div.remove();
      });

      div.append(select);
      div.append(fieldsDiv);
      div.append(removeLink);
      return div;
    },

    buildField: function(field) {
      var div = $("<div>", {"class": "field"});
      var subfields = $("<div>", {"class": "subfields"});
      var _this = this;

      var label = $("<label>", {"text": field.label});
      div.append(label);

      if(field.fieldType == "select") {
        var label = $("<label>", {"text": field.label});
        var select = $("<select>", {"name": field.name});

        for(var i=0; i < field.options.length; i++) {
          var optionData = field.options[i];
          var option = $("<option>", {"text": optionData.label, "value": optionData.name});
          option.data("optionData", optionData);
          select.append(option);
        }

        select.change(function() {
          var option = $(this).find("> :selected");
          var optionData = option.data("optionData");
          subfields.empty();
          if(optionData.fields) {
            for(var i=0; i < optionData.fields.length; i++) {
              var f = optionData.fields[i];
              subfields.append(_this.buildField(f));
            }
          }
        });

        select.change();
        div.append(select);
      }
      else if(field.fieldType == "text") {
        var input = $("<input>", {"type": "text", "name": field.name});
        div.append(input);
      }
      else if(field.fieldType == "textarea") {
        var id = "textarea-" + Math.floor(Math.random() * 100000);
        var area = $("<textarea>", {"name": field.name, "id": id});
        div.append(area);
      }

      if(field.hint) {
        div.append($("<p>", {"class": "hint", "text": field.hint}));
      }

      div.append(subfields);
      return div;
    },
                        

    collectData: function(fields) {
      var _this = this;
      fields = fields || this.element.find(".action");
      var out = [];
      fields.each(function() {
        var input = $(this).find("> :input, > .jstEditor > :input");
        var subfields = $(this).find("> .subfields > .field");
        var action = {name: input.attr("name"), value: input.val()};
        if(subfields.length > 0) {
          action.fields = _this.collectData(subfields);
        }
        out.push(action);
      });
      return out;
    },

    _findField: function(fieldName) {
      for(var i=0; i < this.fields.length; i++) {
        var field = this.fields[i];
        if(field.name == fieldName) return field;
      }
    }
  };

})(jQuery);
