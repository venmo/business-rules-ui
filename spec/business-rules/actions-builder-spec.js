describe("$.fn.actionsBuilder", function() {
  var container, rows;
  var occupationOptions = [
    {label: "", name: ""},
    {label: "Software Engineer", name: "software-engineer"},
    {label: "Biz Dev", name: "biz-dev"},
    {label: "Marketing", name: "marketing"}
  ];

  beforeEach(function() {
    container = $("<div>");
    container.actionsBuilder({
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
          ]}
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
    rows = container.find(".action");
  });

  it('builds an action row for each action data', function() {
    expect(rows.length).toEqual(2);
    expect(rows.eq(0).find(".action-select").val()).toEqual("alert");
    expect(rows.eq(0).find(".field textarea").attr("name")).toEqual("message");
    expect(rows.eq(0).find(".field textarea").val()).toEqual("Hello world!");
    expect(rows.eq(1).find(".action-select").val()).toEqual("updateField");
    expect(rows.eq(1).find(".field select").attr("name")).toEqual("fieldId");
    expect(rows.eq(1).find(".field select").val()).toEqual("occupationField");
    expect(rows.eq(1).find(".field .field select").attr("name")).toEqual("newValue");
    expect(rows.eq(1).find(".field .field select").val()).toEqual("marketing");
  });

  it('gives each row a remove link', function() {
    rows.eq(0).find(".remove").click();
    expect(container.find(".action").length).toEqual(1);
  });

  it('adds an "Add Rule" link', function() {
    var addLink = container.find(".add");
    addLink.click();
    expect(container.find(".action").length).toEqual(3);
  });

  describe('$.fn.actionsBuilder("data")', function() {
    it('returns serialized data', function() {
      rows.eq(0).find("textarea").val("Goodbye world!");
      expect(container.actionsBuilder("data")).toEqual([
        {name: "action-select", value: "alert", fields: [
          {name: "message", value: "Goodbye world!"}
        ]},
        {name: "action-select", value: "updateField", fields: [
          {name: "fieldId", value: "occupationField", fields: [
            {name: "newValue", value: "marketing"}
          ]}
        ]}
      ]);
    });
  });
});
