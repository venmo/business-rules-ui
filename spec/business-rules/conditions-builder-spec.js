describe('$.fn.conditionsBuilder', function() {
  var container, rules;
  var occupationOptions = [
    {label: "", name: ""},
    {label: "Software Engineer", name: "software-engineer"},
    {label: "Biz Dev", name: "biz-dev"},
    {label: "Marketing", name: "marketing"}
  ];

  beforeEach(function() {
    container = $("<div>");
    container.conditionsBuilder({
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
        {name: "nameField", operator: "equalTo", value: "Giuseppe"},
        {name: "ageField", operator: "greaterThanEqual", value: "21"}
      ]});
    });
  });
});
