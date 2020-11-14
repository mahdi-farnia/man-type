# Getting Started
For testing usage:
```
npm i --save-dev man-type
```
For production usage:
```
npm i man-type
```
# Introduction
This library is using for checking values.

You can customize type checking and validate every thing.

# Usage
```
const is = require("man-type")

// Checking values
 is(2, 2);
> true

// Checking types
 is(2, "number");
> true

// Advance type check (NAME SHOULD MATCH)
 is({}, "plainobject");
> true

// Reverse result
 is(function() {}, "!plainobject");
> true

 is([1, 2, 3, 4], "array");
> true

// Checking multiple things
 is(2, ["number", "!object"]); // equal to this: if(typeof 2 === "number" && typeof 2 !== "object")
> true

// Check array elements     vvvvv (Should pass true)
 is([1, 2, 3, 4], "number", true);
> true
```
# Advance Type Check
| Values           | Description                                     |
|------------------|-------------------------------------------------|
| null             | should be in quotes                             |
| undefined        | alias of null (should be in quotes)             |
| number           | nan and infinit not acceptable                  |
| object           | null not acceptable                             |
| bigint           |                                                 |
| function         |                                                 |
| array            |                                                 |
| plain-object     |                                                 |
| nan              |                                                 |
| finite           |                                                 |
| infinite         |                                                 |
| empty            | check for empty array or plain object or string |
| symbol           |                                                 |
| promise          |                                                 |
| buffer           |                                                 |
# Customize
You can customize this library using function.
```
// Use plain object (SHOULD RETURN TRUE OR FALSE)
 is.register({
     "greater-than-two"(arg) {
         // This type refers to is function
        return this(arg, "number") && arg > 2;
     },
 });

 is(3, "greater-than-two");
> true

// Path to file or path to directory (with js extension)
    is.register("./func/fn.js");

    // File name will use for checking
    is(3, "fn");

    is.register("./func");
    //......

```