describe("$.fn.actionsBuilder", function() {
  var container, rows;

  beforeEach(function() {
    container = $("<div>");
    container.actionsBuilder({
      actions: [
        { name: "put_on_sale",
          label: "Put On Sale",
          params: [{name: "sale_percentage", label: "Sale Percentage", fieldType : "numeric"}]},
        { name: "order_more",
          label: "Order More",
          params: [{name: "number_to_order", label: "Number To Order", fieldType : "numeric"}]}
      ],
      data: [
        {name: "action-select", value: "put_on_sale", params: [
          {name: "sale_percentage", value: 10}
        ]},
        {name: "action-select", value: "order_more", params: [
          {name: "number_to_order", value: 50}
        ]}
      ]
    });
    rows = container.find(".action");
  });

  it('builds an action row for each action data', function() {
    expect(rows.length).toEqual(2);
    expect(rows.eq(0).find(".action-select").val()).toEqual("put_on_sale");
    expect(rows.eq(0).find(".field input").attr("name")).toEqual("sale_percentage");
    expect(rows.eq(0).find(".field input").val()).toEqual("10");
    expect(rows.eq(1).find(".action-select").val()).toEqual("order_more");
    expect(rows.eq(1).find(".field input").attr("name")).toEqual("number_to_order");
    expect(rows.eq(1).find(".field input").val()).toEqual("50");
    // expect(rows.eq(1).find(".field .field select").attr("name")).toEqual("newValue");
    // expect(rows.eq(1).find(".field .field select").val()).toEqual("marketing");
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
      rows.eq(0).find("input").val("40");
      expect(container.actionsBuilder("data")).toEqual([{
        name: "put_on_sale",
        params: {
          sale_percentage: '40'
        }
      }, {
        name: "order_more",
        params: {
          number_to_order: '50'
        }
      }]);
    });
  });
});
