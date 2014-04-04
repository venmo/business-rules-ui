var conditions, actions, nameField, ageField, occupationField, submit, allData;
(function($) {
  var occupationOptions = [ "Software Engineer", "Biz Dev", "Marketing" ];

  function getInitialData() {
    return {"variables": [
            { "name": "expiration_days",
              "label": "Days until expiration",
              "variable_type": "numeric",
              "options": []},
            { "name": "current_month",
              "label": "Current Month",
              "variable_type": "string",
              "options": []},
            { "name": "goes_well_with",
              "label": "Goes Well With",
              "variable_type": "select",
              "options": ["Eggnog", "Cookies", "Beef Jerkey"]}
                        ],
          "actions": [
            { "name": "put_on_sale",
              "label": "Put On Sale",
              "params": {"sale_percentage": "numeric"}},
            { "name": "order_more",
              "label": "Order More",
              "params": {"number_to_order": "numeric"}}
          ],
          "variable_type_operators": {
            "numeric": [ {"name": "equal_to",
                          "label": "Equal To",
                          "field_type": "numeric"},
                         {"name": "less_than",
                          "label": "Less Than",
                          "field_type": "numeric"},
                         {"name": "greater_than",
                          "label": "Greater Than",
                          "field_type": "numeric"}],
            "string": [ { "name": "equal_to",
                          "label": "Equal To",
                          "field_type": "text"},
                        { "name": "non_empty",
                          "label": "Non Empty",
                          "field_type": "none"}],
            "select": [ { "name": "contains",
                          "label": "Contains",
                          "field_type": "select"},
                        { "name": "does_not_contain",
                          "label": "Does Not Contain",
                          "field_type": "select"}]
          }
    };
  };

  function onReady() {
    conditions = $("#conditions");
    actions = $("#actions");
    nameField = $("#nameField");
    occupationField = $("#occupationField");
    ageField = $("#ageField");
    submit = $("#submit");
    allData = getInitialData();

    initializeConditions(allData);
    initializeActions();
    initializeForm();
  }

  function initializeConditions(data) {
    conditions.conditionsBuilder(data)
  }

  function initializeConditionsOld() {
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
        //TODO: change fields to actions
      fields: [
        { name: "put_on_sale",
          label: "Put On Sale",
          params: {sale_percentage: "numeric"}},
        { name: "order_more",
          label: "Order More",
          params: {number_to_order: "numeric"}}
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
      console.log("CONDITIONS");
      console.log(JSON.stringify(conditions.conditionsBuilder("data")));
      console.log("ACTIONS");
      console.log(JSON.stringify(actions.actionsBuilder("data")));
    });
  }
  $(onReady);
})(jQuery);
