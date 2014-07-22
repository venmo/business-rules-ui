# Business Rules for JavaScript


When you're working in a business environment (especially an "enterprisy" environment),
business rules make the world go 'round. Business-level decision makers need to be able
to alter application behavior and logic with minimal technical invasiveness.

Usually, business rule engines come packaged as $100K Java installations and a gaggle
of business consultants. Let's just call this a lighter-weight solution.

The goal of this library is to:

1. Give JavaScript developers drop-in jQuery UI widgets for building business rule interfaces.
2. Give developers a rule engine that can be ported to any server-side language for running business rules built with the UI tools.

## Getting Started

Try out the [demo here](http://venmo.github.io/business-rules-ui/examples/).

You can build rules based on the defined variables and operators (they're
hard-coded in this demo, but they'd normally be sent dynamically from the
server or rendered server-side). When you click `submit` the json document
containing the rules you just defined gets printed to `console.log`.

The demo code is just the `examples` directory which is a great place to get
started, it demonstrates all the features pretty well!

If you want to play around with the example code and try out making changes,
just fork the project and make some changes in the `gh-pages` branch. When you
push it they'll propagate to
`<your-username>.github.io/business-rules-ui/examples/`

## API

### $.fn.conditionsBuilder()

The `$.fn.conditionsBuilder()` method has two forms, the first being:

```javascript
$("#myDiv").conditionsBuilder({fields: [...], data: {...});
```

The first form creates a `ConditionsBuilder` object for the given DOM element with the passed fields and data.
The `fields` param is an array of objects that define the factors that can be used in conditional statements.
Each has a `label`, `name` and an array of `operators`. It may also have an `options` array of objects
with `label` and `name`.

Each operator is an object with `label`, `name` and `fieldType`. The `fieldType` can be:

* `"none"` - The operator does not require further data entry (ie `"present"`, `"blank"`).
* `"text"` - User will be presented with an input of `type=text`.
* `"textarea"` - User will be presented with a textarea.
* `"select"` - User will be presented with a select dropdown populated with the parent field's `options` array.

The `data` param is an object that will be used to initially populate the UI (ie if business rules have already
been created and the user wants to edit them). If the `data` option is not passed, the UI will be
generated without any initial conditions.

The object passed as `data` should be a "conditional object", meaning it has a single key of `all` or `any`
and a value of an array of nodes. These nodes can either be rule objects or nested conditional objects.

A rule object has `name`, `operator` and `value` strings. The `name` should match a field's `name` property,
the `operator` should match an operator's `name` property, and the `value` is an arbitrary string value
entered by the user in the UI.

Once the UI has been built by the `ConditionsBuilder` and the user has entered information, the data can
be retrieved by using the second form of the `conditionsBuilder` method:

```javascript
var data = $("#myDiv").conditionsBuilder("data");
```

This will serialize the entered conditionals into a data object. This object can be persisted and then later
used to create a new `ConditionsBuilder` for editing. This data object will also be used to instantiate
a `BusinessRules.RuleEngine` object for running the conditional logic.


### $.fn.actionsBuilder()

The `$.fn.actionsBuilder` has an identical API to `$.fn.conditionsBuilder`, but it uses a different data structure.
The `fields` property should be an array of action objects. Each action object has a `label` and `name`.
An action object may have a `fields` property that is an array of action objects, allowing for nested action data. 
All action objects that are not "top level" should also have a `fieldType` of `text`, `textarea` or `select`.

Here's an example of what a "Send Email" action could look like:

```javascript
$("#myDiv").actionsBuilder({fields: [
  {label: "Send Email", value: "sendEmail", fields: [
    {label: "To", name: "to", fieldType: "text"},
    {label: "CC", name: "cc", fieldType: "text"},
    {label: "BCC", name: "bcc", fieldType: "text"},
    {label: "Subject", name: "subject", fieldType: "text"},
    {label: "Body", name: "body", fieldType: "textarea"}
  ]}
]});
```

Action objects with a `fieldType` of `select` should not have a `fields` property -- rather they have an `options`
property with a `label` and `name` for each option. That option object, however, can have a `fields` property.
This allows you to specify nested fields that will only be displayed if the given option has been selected.

Building on the last example, this allows the user to specify an email template, or use a custom Subject and Body:

```javascript
$("#myDiv").actionsBuilder({fields: [
  {label: "Send Email", value: "sendEmail", fields: [
    {label: "To", name: "to", fieldType: "text"},
    {label: "CC", name: "cc", fieldType: "text"},
    {label: "BCC", name: "bcc", fieldType: "text"},
    {label: "Email Template", name: "template", fieldType: "select", options: [
      {label: "Welcome Email", name: "welcomeEmail"},
      {label: "Followup Email", name: "followupEmail"},
      {label: "Custom Email", name: "customEmail", fields: [
        {label: "Subject", name: "subject", fieldType: "text"},
        {label: "Body", name: "body", fieldType: "textarea"}
      ]}
    ]}
  ]}
]});
```

In this example, the "Subject" and "Body" fields will only be displayed if the user has selected the "Custom Email"
template option.

To get the data out of the UI, run the `actionsBuilder` method with `"data"`:

```javascript
var data = $("#myDiv").actionsBuilder("data");
```

Each action data object has a `name` that matches the corresponding field's `value`, and a `value` property with the
user-entered value. It may also have a `fields` array of nested action data objects, which correspond to the nested
field structure of the builder.

### BusinessRules.RuleEngine

While the `ConditionsBuilder` and `ActionsBuilder` give us a UI to build business rule configurations, we still need
something to interpret the configuration, apply the logic and conditionally run the actions. This is where the
`BusinessRules.RuleEngine` comes in.

The `RuleEngine` is initialized with a `conditions` object and an `actions` array, just as they would be when fetched
from the UI using `conditionsBuilder("data")` and `actionsBuilder("data")`. This would be a common way of instantiating
a `RuleEngine`:

```javascript
var engine = new BusinessRules.RuleEngine({
  conditions: $("#myConditions").conditionsBuilder("data"),
  actions: $("#myActions").actionsBuilder("data")
});
```

Once your engine has been instantiated, you can use the `#run` method to apply the conditional logic to a set of data,
and then conditionally run the actions. Since the engine is only responsible for running logic and shouldn't have to
be aware of the actual data, you need to pass in an object that represents the context to run conditionals on,
and another object with functions that map to the actions. For example:

```javascript
var engine = new BusinessRules.RuleEngine({
  conditions: {all: [{name: "name", operator: "present", value: ""}, {name: "age", operator: "greaterThanEqual", value: "21"}]},
  actions: [{name: "action-select", value: "giveDrink", fields: [{name: "drinkType", value: "martini"}]}]
});

var conditionsAdapter = {name: "Joe", age: 22};
var actionsAdapter = {giveDrink: function(data) { alert("Gave user a " + data.find("drinkType")); } };

engine.run(conditionsAdapter, actionsAdapter);
```

Values used in the `conditionsAdapter` can be simple strings and numbers, but it can also be a function that will be lazily executed.
For example, this adapter would pull the name and age from fields on the page (a more likely scenario than hard coded values):

```javascript
var conditionsAdapter = {
  name: function() { $("#nameField").val(); },
  age: function() { $("#ageField").val(); }
};
```

It is also possible to use *asynchronous* functions in your conditionsAdapter. To do so,
have your function accept a callback function and call it when you have your value.

```javascript
var conditionsAdapter = {
  logoVisible: function(done) {
    // Cannot determine if logo is visible until DOM ready
    $(function() {
      var visible = $("#logo").is(":visible");
      done(visible);
    });
  }
};
```

The `BusinessRules.RuleEngine` object can be used in either the browser or in a server environment (ie Node.js). It could also
be ported to another language simply enough, or run inside a JavaScript runtime within Ruby, Java, etc.

### Conditional Operators

The `RuleEngine` comes with the following standard operators that can be used inside conditionals:

* present
* blank
* equalTo
* notEqualTo
* greaterThan
* greaterThanEqual
* lessThan
* lessThanEqual
* includes
* matchesRegex

Custom operators can be added to a `RuleEngine` using the `addOperators` method:

```javascript
var engine = new BusinessRules.RuleEngine({
  conditions: {all: [{name: "password", operator: "longerThan", value: "6"}]},
  actions: []
});

engine.addOperators({
  longerThan: function(actual, length) {
    return actual.length > parseInt(length, 10);
  }
});
```

It is also possible to create *asynchronous* operators if your logic cannot be run synchronously.
To do so, simply have your operator function accept a third callback param and call it when
you have your result:

```javascript
engine.addOperators({
  delayedOperator: function(actual, target, done) {
    setTimeout(function() { done(true); }, 1000);
  }
});
```

The `addOperators` method also allows you to override the standard operators if, heaven forbid, you find that necessary.

### Action Functions

When a function on your `actionsAdapter` object is called, it is passed a `Finder` object. The `Finder` object has a
`data` property that will return the action's data structure so that you can traverse it yourself. This data
structure can look something like:

```javascript
[{name: "drinkType", value: "martini", fields: [
  {name: "oliveCount", value: "3"},
  {name: "shaken", value: "yes"}
]}]
```

While you certainly can traverse this structure, chances are you just want to quickly access the values. This is why
the `Finder` gives you the `find` convenience method, which takes one or more names and returns the matching value:

```javascript
var actionsAdapter = {
  giveDrink: function(data) {
    var drinkType = data.find("drinkType"),
        oliveCount = data.find("drinkType", "oliveCount"),
        shaken = data.find("drinkType", "shaken");
    console.log(drinkType, oliveCount, shaken); // "martini", "3", "yes"
  }
};
```

## License

MIT - see the LICENSE.txt file.

This is from a fork of https://github.com/chrisjpowers/business-rules, the semantics have been modified a bit and we have split off the UI code so it can be used with a RESTful API to let the business logic run on the server.
