var conditions, actions, nameField, ageField, occupationField, submit;
(function($) {
  var occupationOptions = [
    {label: "", name: ""},
    {label: "Software Engineer", name: "software-engineer"},
    {label: "Biz Dev", name: "biz-dev"},
    {label: "Marketing", name: "marketing"}
  ];

  function onReady() {
    conditions = $("#conditions");
    actions = $("#actions");
    nameField = $("#nameField");
    occupationField = $("#occupationField");
    ageField = $("#ageField");
    submit = $("#submit");

    initializeConditions();
    initializeActions();
    initializeForm();
  }

  function initializeConditions() {
    conditions.conditionsBuilder({
      fields: [
        {label: "Name", name: "nameField", operators: [
          {label: "is present", name: "present", fieldType: "none"},
          {label: "is blank", name: "blank", fieldType: "none"},
          {label: "is equal to", name: "equalTo", fieldType: "text"},
          {label: "is not equal to", name: "notEqualTo", fieldType: "text"},
          {label: "includes", name: "includes", fieldType: "text"},
          {label: "matches regex", name: "matchesRegex", fieldType: "text"}
        ]},
        {label: "Age", name: "ageField", operators: [
          {label: "is present", name: "present", fieldType: "none"},
          {label: "is blank", name: "blank", fieldType: "none"},
          {label: "is equal to", name: "equalTo", fieldType: "text"},
          {label: "is not equal to", name: "notEqualTo", fieldType: "text"},
          {label: "is greater than", name: "greaterThan", fieldType: "text"},
          {label: "is greater than or equal to", name: "greaterThanEqual", fieldType: "text"},
          {label: "is less than", name: "lessThan", fieldType: "text"},
          {label: "is less than or equal to", name: "lessThanEqual", fieldType: "text"},
        ]},
        {label: "Occupation", name: "occupationField", options: occupationOptions, operators: [
          {label: "is present", name: "present", fieldType: "none"},
          {label: "is blank", name: "blank", fieldType: "none"},
          {label: "is equal to", name: "equalTo", fieldType: "select"},
          {label: "is not equal to", name: "notEqualTo", fieldType: "select"},
        ]}
      ],
      data: {"all": [
        {name: "nameField", operator: "equalTo", value: "Godzilla"},
        {name: "ageField", operator: "greaterThanEqual", value: "21"}
      ]}
    });
  }

  function initializeActions() {
    actions.actionsBuilder({
      fields: [
        {label: "Show Alert", name: "alert", fields: [
          {label: "Message", name: "message", fieldType: "textarea"}
        ]},
        {label: "Update Field", name: "updateField", fields: [
          {label: "Field", name: "fieldId", fieldType: "select", options: [
            {label: "Name to", name: "nameField", fields: [
              {label: "New Value", name: "newValue", fieldType: "text"}
            ]},
            {label: "Age to", name: "ageField", fields: [
              {label: "New Value", name: "newValue", fieldType: "text"}
            ]},
            {label: "Occupation to", name: "occupationField", fields: [
              {label: "New Value", name: "newValue", fieldType: "select", options: occupationOptions}
            ]}
          ]},
        ]}
      ],
      data: [
        {name: "action-select", value: "alert", fields: [
          {name: "message", value: "Hello world!"}
        ]},
        {name: "action-select", value: "updateField", fields: [
          {name: "fieldId", value: "occupationField", fields: [
            {name: "newValue", value: "marketing"}
          ]}
        ]}
      ]
    });
  }

  function initializeForm() {
    for(var i=0; i < occupationOptions.length; i++) {
      var o = occupationOptions[i];
      occupationField.append($("<option>", {value: o.name, text: o.label}));
    }

    submit.click(function(e) {
      e.preventDefault();
      var engine = new BusinessRules.RuleEngine({
        conditions: conditions.conditionsBuilder("data"),
        actions: actions.actionsBuilder("data")
      });
      var conditionsAdapter = {
        nameField: nameField.val(), 
        ageField: ageField.val(),
        occupationField: occupationField.val()
      };
      var actionsAdapter = {
        alert: function(data) { alert(data.find("message")); },
        updateField: function(data) {
          console.log("data", data);
          var fieldId = data.find("fieldId");
          console.log("fieldId", fieldId);
          var field = $("#" + fieldId);
          var val = data.find("fieldId", "newValue");
          field.val(val);
        }        
      };
      engine.run(conditionsAdapter, actionsAdapter);
    });
  }
  $(onReady);
})(jQuery);
