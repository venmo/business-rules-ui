describe('$.fn.conditionsBuilder', function() {
  var container, rules;
  var occupationOptions = [
    {label: "", value: ""},
    {label: "Software Engineer", value: "software-engineer"},
    {label: "Biz Dev", value: "biz-dev"},
    {label: "Marketing", value: "marketing"}
  ];

  beforeEach(function() {
    container = $("<div>");
    container.conditionsBuilder({
      fields: [
        {label: "Name", value: "nameField", operators: [
          {label: "is present", value: "present", fieldType: "none"},
          {label: "is blank", value: "blank", fieldType: "none"},
          {label: "is equal to", value: "equalTo", fieldType: "text"},
          {label: "is not equal to", value: "notEqualTo", fieldType: "text"},
          {label: "includes", value: "includes", fieldType: "text"},
          {label: "matches regex", value: "matchesRegex", fieldType: "text"}
        ]},
        {label: "Age", value: "ageField", operators: [
          {label: "is present", value: "present", fieldType: "none"},
          {label: "is blank", value: "blank", fieldType: "none"},
          {label: "is equal to", value: "equalTo", fieldType: "text"},
          {label: "is not equal to", value: "notEqualTo", fieldType: "text"},
          {label: "is greater than", value: "greaterThan", fieldType: "text"},
          {label: "is greater than or equal to", value: "greaterThanEqual", fieldType: "text"},
          {label: "is less than", value: "lessThan", fieldType: "text"},
          {label: "is less than or equal to", value: "lessThanEqual", fieldType: "text"},
        ]},
        {label: "Occupation", value: "occupationField", options: occupationOptions, operators: [
          {label: "is present", value: "present", fieldType: "none"},
          {label: "is blank", value: "blank", fieldType: "none"},
          {label: "is equal to", value: "equalTo", fieldType: "select"},
          {label: "is not equal to", value: "notEqualTo", fieldType: "select"},
        ]}
      ],
      data: {"all": [
        {field: "nameField", operator: "equalTo", value: "Godzilla"},
        {field: "ageField", operator: "greaterThanEqual", value: "21"}
      ]}
    });
    rules = container.find(".all .rule");
  });

  it('adds a condition row for each data point', function() {
    expect(rules.length).toEqual(2);
    expect(rules.eq(0).find("select.field").val()).toEqual("nameField");
    expect(rules.eq(0).find("select.operator").val()).toEqual("equalTo");
    expect(rules.eq(0).find("input.value").val()).toEqual("Godzilla");
    expect(rules.eq(1).find("select.field").val()).toEqual("ageField");
    expect(rules.eq(1).find("select.operator").val()).toEqual("greaterThanEqual");
    expect(rules.eq(1).find("input.value").val()).toEqual("21");
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

  describe('$.fn.conditionsBuilder("data")', function() {
    it('returns serialized data', function() {
      rules.eq(0).find("input.value").val("Giuseppe");
      expect(container.conditionsBuilder("data")).toEqual({"all":[
        {field: "nameField", operator: "equalTo", value: "Giuseppe"},
        {field: "ageField", operator: "greaterThanEqual", value: "21"}
      ]});
    });
  });
});
