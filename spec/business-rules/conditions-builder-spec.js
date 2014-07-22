describe('$.fn.conditionsBuilder', function() {
  var container, rules;
  var occupationOptions = [ "Software Engineer", "Biz Dev", "Marketing" ];

  beforeEach(function() {
    container = $("<div>");
    container.conditionsBuilder({
      variables: [
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
      variable_type_operators: {
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
      },
      data: {"all": [
        {name: "expiration_days", operator: "greater_than", value: 3},
        {name: "current_month", operator: "equal_to", value: "December"}
      ]}
    });
    rules = container.find(".all .rule");
  });

  it('adds a condition row for each data point', function() {
    expect(rules.length).toEqual(2);
    expect(rules.eq(0).find("select.field").val()).toEqual("expiration_days");
    expect(rules.eq(0).find("select.operator").val()).toEqual("greater_than");
    expect(rules.eq(0).find("input.value").val()).toEqual('3');
    expect(rules.eq(1).find("select.field").val()).toEqual("current_month");
    expect(rules.eq(1).find("select.operator").val()).toEqual("equal_to");
    expect(rules.eq(1).find("input.value").val()).toEqual("December");
  });

  it('gives each row a remove link', function() {
    rules.eq(0).find(".remove").click();
    expect(container.find(".all .rule").length).toEqual(1);
  });

  it('adds an "Add Rule" link', function() {
    var addLink = container.find(".add-rule");
    addLink.click();
    expect(container.find(".all .rule").length).toEqual(3);
  });

  it('denormalizes the response from the server', function() {
    var variables = [{ "name": "expiration_days",
                      "label": "Days until expiration",
                      "field_type": "numeric",
                      "options": []}];
    var operators = { "numeric": [ {"name": "equal_to",
                                  "label": "Equal To",
                                  "field_type": "numeric"},
                                 {"name": "less_than",
                                  "label": "Less Than",
                                  "field_type": "numeric"}]};
    var results = ConditionsBuilder.prototype.denormalizeOperators(variables, operators);
    expect(results.length).toEqual(1);
    expect(results[0].operators.length).toEqual(2);
    expect(results[0].operators[0].name).toEqual("equal_to");
    expect(results[0].operators[1].name).toEqual("less_than");
  });

  describe('$.fn.conditionsBuilder("data")', function() {
    it('returns serialized data', function() {
      rules.eq(0).find("input.value").val("4");
      expect(container.conditionsBuilder("data")).toEqual({"all":[
        {name: "expiration_days", operator: "greater_than", value: 4},
        {name: "current_month", operator: "equal_to", value: "December"}
      ]});
    });
  });
});
