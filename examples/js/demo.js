var conditions, actions, nameField, ageField, occupationField, submit, allData;
(function($) {
  var occupationOptions = [ "Software Engineer", "Biz Dev", "Marketing" ];

  function getInitialData() {
    return {"variables": [
            { "name": "expiration_days",
              "label": "Days until expiration",
              "field_type": "numeric",
              "options": []},
            { "name": "current_month",
              "label": "Current Month",
              "field_type": "string",
              "options": []},
            { "name": "goes_well_with",
              "label": "Goes Well With",
              "field_type": "select",
              "options": ["Eggnog", "Cookies", "Beef Jerkey"]}
                        ],
          "actions": [
            { "name": "put_on_sale",
              "label": "Put On Sale",
              "params": [{name: "sale_percentage", label: "Sale Percentage", fieldType : "numeric"}]},
            { "name": "order_more",
              "label": "Order More",
              "params": [{name: "number_to_order", label: "Number To Order", fieldType : "numeric"}]}
          ],
          "variable_type_operators": {
            "numeric": [ {"name": "equal_to",
                          "label": "Equal To",
                          "input_type": "numeric"},
                         {"name": "less_than",
                          "label": "Less Than",
                          "input_type": "numeric"},
                         {"name": "greater_than",
                          "label": "Greater Than",
                          "input_type": "numeric"}],
            "string": [ { "name": "equal_to",
                          "label": "Equal To",
                          "input_type": "text"},
                        { "name": "non_empty",
                          "label": "Non Empty",
                          "input_type": "none"}],
            "select": [ { "name": "contains",
                          "label": "Contains",
                          "input_type": "select"},
                        { "name": "does_not_contain",
                          "label": "Does Not Contain",
                          "input_type": "select"}]
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
    initializeActions(allData);
    initializeForm();
  }

  function initializeConditions(data) {
    conditions.conditionsBuilder(data)
  }

  function initializeActions(data) {
    actions.actionsBuilder(data);
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
