var conditions, actions, nameField, occupationField, submit;
(function($) {
  var occupationOptions = [
    {label: "", value: ""},
    {label: "Software Engineer", value: "se"},
    {label: "Biz Dev", value: "bd"},
    {label: "Marketing", value: "marketing"}
  ];

  function onReady() {
    conditions = $("#conditions");
    actions = $("#actions");
    nameField = $("#nameField");
    occupationField = $("#occupationField");
    submit = $("#submit");

    initializeConditions();
    initializeActions();
    initializeForm();
  }

  function initializeConditions() {
    conditions.conditionsBuilder({
      fields: [
        {label: "Name", value: "nameField", operators: [
          {label: "is present", value: "present", fieldType: "none"},
          {label: "is blank", value: "blank", fieldType: "none"},
          {label: "is equal to", value: "equalTo", fieldType: "text"},
          {label: "is not equal to", value: "notEqualTo", fieldType: "text"},
          {label: "is greater than", value: "greaterThan", fieldType: "text"},
          {label: "is greater than or equal to", value: "greaterThanEqual", fieldType: "text"},
          {label: "is less than", value: "lessThan", fieldType: "text"},
          {label: "is less than or equal to", value: "lessThanEqual", fieldType: "text"},
          {label: "includes", value: "includes", fieldType: "text"},
          {label: "matches regex", value: "matchesRegex", fieldType: "text"}
        ]},
        {label: "Occupation", value: "occupationField", options: occupationOptions, operators: [
          {label: "is present", value: "present", fieldType: "none"},
          {label: "is blank", value: "blank", fieldType: "none"},
          {label: "is equal to", value: "equalTo", fieldType: "select"},
          {label: "is not equal to", value: "notEqualTo", fieldType: "select"},
        ]}
      ],
      data: {"all": [
        {field: "nameField", operator: "equalTo", value: "Godzilla"}
      ]}
    });
  }

  function initializeActions() {
    actions.actionsBuilder({
      fields: [
        {label: "Show Alert", value: "alert", fields: [
          {label: "Message", value: "message", fieldType: "textarea"}
        ]},
        {label: "Update Field", value: "updateField", fields: [
          {label: "Field", value: "field", fieldType: "select", options: [
            {label: "Name to", value: "nameField", fields: [
              {label: "New Value", value: "value", fieldType: "text"}
            ]},
            {label: "Occupation to", value: "occupationField", fields: [
              {label: "New Value", value: "value", fieldType: "select", options: occupationOptions}
            ]}
          ]},
        ]}
      ],
      data: [
        {name: "action-select", value: "alert", fields: [
          {name: "message", value: "Hello world!"}
        ]},
        {name: "action-select", value: "updateField", fields: [
          {name: "field", value: "occupationField", fields: [
            {name: "value", value: "marketing"}
          ]}
        ]}
      ]
    });
  }

  function initializeForm() {
    for(var i=0; i < occupationOptions.length; i++) {
      var o = occupationOptions[i];
      occupationField.append($("<option>", {value: o.value, text: o.label}));
    }

    submit.click(function(e) {
      e.preventDefault();
      var engine = new BusinessRules.RuleEngine({
        conditions: conditions.conditionsBuilder("data"),
        actions: actions.actionsBuilder("data")
      });
      engine.run({nameField: nameField.val(), occupationField: occupationField.val()}, {
        alert: function(fields) { alert(fields[0].message); },
        updateField: function(fields) {
          var fieldId = fields[0].value;
          var field = $("#" + fieldId);
          var val = fields[0].fields[0].value;
          field.val(val);
        }        
      });
    });
  }

  function runRule() {
    var shouldRun = handleNode(conditions.conditionsBuilder("data"));
    if(shouldRun) {
      runActions(actions.actionsBuilder("data"));
    }
  }

  function handleNode(node) {
    if(node.all || node.any) {
      return handleConditionalNode(node);
    } else {
      return handleRuleNode(node);
    }
  }

  function handleConditionalNode(node) {
    var isAll = !!(node.all);
    var nodes = isAll ? node.all : node.any;
    for(var i=0; i < nodes.length; i++) {
      var result = handleNode(nodes[i]);
      if(isAll && !result) { return false; }
      if(!isAll && !!result) { return true; }
    }
    return isAll;
  }

  function handleRuleNode(node) {
    var fieldValue = $("#" + node.field).val();
    return compareValues(fieldValue, node.operator, node.value);
  }

  function compareValues(actual, operator, value) {
    if(operator === "present") {
      return !!actual;
    } 
    else if(operator === "blank") {
      return !actual;
    } 
    else if(operator === "equalTo") {
      return "" + actual === "" + value;
    } 
    else if(operator === "notEqualTo") {
      return "" + actual !== "" + value;
    } 
    else if(operator === "greaterThan") {
      return parseFloat(actual) > parseFloat(value);
    }
    else if(operator === "lessThan") {
      return parseFloat(actual) < parseFloat(value);
    }
    else if(operator === "greaterThanEqual") {
      return parseFloat(actual) >= parseFloat(value);
    }
    else if(operator === "lessThanEqual") {
      return parseFloat(actual) <= parseFloat(value);
    }
    else if(operator === "includes") {
      return ("" + actual).indexOf("" + value) > -1;
    }
    else if(operator === "matchesRegex") {
      var r = value.gsub(/^\/|\/$/, "");
      var regex = new RegExp(r);
      return regex.test("" + actual);
    }
  }

  function runActions(actions) {
    for(var i=0; i < actions.length; i++) {
      var action = actions[i];
      var actionType = action.value;
      if(actionType === "alert") { 
        var message = action.fields[0].value;
        alert(message); 
      }
      else if(actionType === "updateField") {
        var fieldId = action.fields[0].value;
        var field = $("#" + fieldId);
        var val = action.fields[0].fields[0].value;
        field.val(val);
      }
    }
  }
  $(onReady);
})(jQuery);
