export const JSQuestions = {
  questions: [
    {
      id: 1,
      question: "What are the possible ways to create objects in JavaScript?",
      answer:
        "There are 8 common ways to create objects:\n\n1. **Object Literal:**\n```javascript\nconst obj = { name: 'John' };\n```\n2. **Object Constructor:**\n```javascript\nconst obj = new Object();\n```\n3. **Object.create():**\n```javascript\nconst obj = Object.create(null);\n```\n4. **Function Constructor:**\n```javascript\nfunction Person(name) {\n  this.name = name;\n}\nconst obj = new Person('John');\n```\n5. **Class Syntax:**\n```javascript\nclass Person {\n  constructor(name) {\n    this.name = name;\n  }\n}\n```\n6. **Singleton Pattern:**\n```javascript\nconst obj = new (function() {\n  this.name = 'John';\n})();\n```\n7. **Object.assign():**\n```javascript\nconst obj = Object.assign({}, sourceObj);\n```\n8. **Factory Function:**\n```javascript\nfunction createPerson(name) {\n  return { name };\n}\n```",
      category: "Objects",
    },
    {
      id: 2,
      question: "What is a prototype chain?",
      answer:
        "The prototype chain is JavaScript's inheritance mechanism. When accessing a property/method:\n1. Checks object itself\n2. Checks prototype via __proto__\n3. Continues up chain until null\n\nExample:\n```javascript\nfunction Car() {}\nCar.prototype.drive = function() {};\nconst myCar = new Car();\nmyCar.drive(); // Uses prototype method\n```",
      category: "Prototypes",
    },
    {
      id: 3,
      question: "What is the difference between Call, Apply and Bind?",
      answer:
        "**Call:** Immediate execution with individual args\n```javascript\nfunc.call(context, arg1, arg2);\n```\n**Apply:** Immediate execution with array args\n```javascript\nfunc.apply(context, [arg1, arg2]);\n```\n**Bind:** Returns new bound function\n```javascript\nconst boundFunc = func.bind(context);\n```",
      category: "Functions",
    },
    {
      id: 4,
      question: "What is JSON and its common operations?",
      answer:
        "**JSON (JavaScript Object Notation)** is a data format:\n\n```javascript\n// Stringify\nconst jsonString = JSON.stringify({ name: 'John' });\n\n// Parse\nconst obj = JSON.parse('{\"name\":\"John\"}');\n```\nMIME Type: application/json",
      category: "JSON",
    },
    {
      id: 5,
      question: "What is the purpose of the array slice method?",
      answer:
        "**slice()** creates new array subset:\n```javascript\nconst arr = [1,2,3,4];\narr.slice(1,3); // [2,3]\n```\n- Doesn't mutate original\n- Negative indexes supported",
      category: "Arrays",
    },
    {
      id: 6,
      question: "What is the purpose of the array splice method?",
      answer:
        "**splice()** modifies array contents:\n```javascript\nconst arr = [1,2,3];\narr.splice(1, 1, 'a'); // [1,'a',3]\n```\n- Mutates original array\n- Returns deleted items",
      category: "Arrays",
    },
    {
      id: 7,
      question: "What is the difference between slice and splice?",
      answer:
        "| Feature        | slice       | splice      |\n|----------------|-------------|-------------|\n| Mutates Original | No         | Yes         |\n| Return Value    | New array   | Deleted items |\n| Parameters      | (start, end) | (start, deleteCount, items) |",
      category: "Arrays",
    },
    {
      id: 8,
      question: "How do you compare Object and Map?",
      answer:
        "**Object:**\n- String/Symbol keys only\n- No insertion order\n- Prototype chain\n\n**Map:**\n- Any value as key\n- Maintains order\n- Better performance\n- Direct iteration",
      category: "Data Structures",
    },
    {
      id: 9,
      question: "What is the difference between == and ===?",
      answer:
        "**== (Loose Equality):**\n- Type coercion\n```javascript\n'5' == 5 // true\n```\n\n**=== (Strict Equality):**\n- No coercion\n```javascript\n'5' === 5 // false\n```",
      category: "Operators",
    },
    {
      id: 10,
      question: "What are arrow functions?",
      answer:
        "Arrow functions provide concise syntax:\n```javascript\nconst add = (a, b) => a + b;\n```\nFeatures:\n- No own `this`\n- Can't be constructors\n- No arguments object",
      category: "ES6",
    },
    {
      id: 11,
      question: "What is a first class function?",
      answer:
        "When functions are treated like variables:\n```javascript\n// Assign to variable\nconst greet = function() {};\n\n// Pass as argument\nbutton.addEventListener('click', greet);\n\n// Return from function\nfunction createGreeter() {\n  return function() {};\n}```",
      category: "Functions",
    },
    {
      id: 12,
      question: "What is a first order function?",
      answer:
        "Function that:\n- Doesn't accept functions as arguments\n- Doesn't return functions\n\nExample:\n```javascript\nfunction square(x) {\n  return x * x;\n}```",
      category: "Functions",
    },
    {
      id: 13,
      question: "What is a higher order function?",
      answer:
        "Function that:\n- Accepts functions as arguments\n- Returns functions\n\nExample:\n```javascript\nfunction multiplier(factor) {\n  return function(x) {\n    return x * factor;\n  };\n}```",
      category: "Functions",
    },
    {
      id: 14,
      question: "What is a unary function?",
      answer:
        "Function accepting exactly one argument:\n```javascript\nfunction square(x) {\n  return x * x;\n}```",
      category: "Functions",
    },
    {
      id: 15,
      question: "What is currying?",
      answer:
        "Breaking multi-arg function into single-arg functions:\n```javascript\nconst add = a => b => a + b;\nadd(2)(3); // 5\n```\nBenefits:\n- Partial application\n- Function composition",
      category: "Functional Programming",
    },
    {
      id: 16,
      question: "What is a pure function?",
      answer:
        "Function that:\n1. Same input ⇒ Same output\n2. No side effects\n\nExample:\n```javascript\nfunction pureAdd(a, b) {\n  return a + b;\n}```\nImpure example:\n```javascript\nlet counter = 0;\nfunction impure() {\n  return counter++;\n}```",
      category: "Functional Programming",
    },
    {
      id: 17,
      question: "What is the let keyword?",
      answer:
        "Block-scoped variable declaration:\n```javascript\nif (true) {\n  let x = 10;\n}\nconsole.log(x); // ReferenceError```\nFeatures:\n- No hoisting\n- Temporal Dead Zone\n- No redeclaration",
      category: "Variables",
    },
    {
      id: 18,
      question: "What is the difference between let and var?",
      answer:
        "| Feature        | let          | var          |\n|----------------|--------------|--------------|\n| Scope           | Block        | Function     |\n| Hoisting        | TDZ          | Undefined    |\n| Redeclaration   | Not allowed  | Allowed      |\n| Global object   | Not added    | Added        |",
      category: "Variables",
    },
    {
      id: 19,
      question: "Why was 'let' chosen as a keyword?",
      answer:
        "Historical reasons:\n- Mathematical `let` in lambda calculus\n- Used in Scheme/other languages\n- Similar semantics to `var`",
      category: "Variables",
    },
    {
      id: 20,
      question: "How to redeclare variables in switch blocks?",
      answer:
        "Use block scoping:\n```javascript\nswitch(value) {\n  case 1: {\n    let x = 10;\n    break;\n  }\n  case 2: {\n    let x = 20; // No error\n    break;\n  }\n}```",
      category: "Variables",
    },
    {
      id: 21,
      question: "What is the Temporal Dead Zone?",
      answer:
        "Period between entering scope and declaration where variable is inaccessible:\n```javascript\nconsole.log(x); // ReferenceError\nlet x = 10;```\nApplies to `let` and `const` declarations.",
      category: "Variables",
    },
    {
      id: 22,
      question: "What is an IIFE?",
      answer:
        "Immediately Invoked Function Expression:\n```javascript\n(function() {\n  // Private scope\n})();\n```\nUses:\n- Avoid polluting global scope\n- Module pattern implementation",
      category: "Functions",
    },
    {
      id: 23,
      question: "How to encode/decode URLs?",
      answer:
        "Use built-in functions:\n```javascript\n// Encode\nconst encoded = encodeURIComponent('Hello World!');\n\n// Decode\nconst decoded = decodeURIComponent(encoded);\n```",
      category: "Web APIs",
    },
    {
      id: 24,
      question: "What is memoization?",
      answer:
        "Optimization technique caching function results:\n```javascript\nfunction memoize(fn) {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    return cache.has(key) ? cache.get(key) : cache.set(key, fn(...args)).get(key);\n  };\n}```",
      category: "Optimization",
    },
    {
      id: 25,
      question: "What is hoisting?",
      answer:
        "JavaScript's default behavior of moving declarations to top:\n```javascript\nconsole.log(x); // undefined\nvar x = 5;\n```\nDoesn't work with `let`/`const`.",
      category: "Variables",
    },
    {
      id: 26,
      question: "What are ES6 classes?",
      answer:
        "Syntactic sugar over prototypes:\n```javascript\nclass Person {\n  constructor(name) {\n    this.name = name;\n  }\n\n  greet() {\n    return `Hello ${this.name}`;\n  }\n}```",
      category: "ES6",
    },
    {
      id: 27,
      question: "What are closures?",
      answer:
        "Function retaining access to outer scope:\n```javascript\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    return count++;\n  };\n}\nconst counter = createCounter();\ncounter(); // 0\ncounter(); // 1```",
      category: "Functions",
    },
    {
      id: 28,
      question: "What are modules?",
      answer:
        "Reusable code units:\n```javascript\n// math.js\nexport function add(a, b) {\n  return a + b;\n}\n\n// app.js\nimport { add } from './math.js';```",
      category: "Modules",
    },
    {
      id: 29,
      question: "Why use modules?",
      answer:
        "Benefits:\n1. Encapsulation\n2. Reusability\n3. Dependency management\n4. Namespace organization",
      category: "Modules",
    },
    {
      id: 30,
      question: "What is scope?",
      answer:
        "Accessibility/visibility of variables:\n1. Global Scope\n2. Function Scope\n3. Block Scope (ES6)\n4. Module Scope",
      category: "Variables",
    },
    {
      id: 31,
      question: "What is a service worker?",
      answer:
        "Script running in background:\n- Offline experiences\n- Push notifications\n- Caching strategies\n- Background sync",
      category: "Web APIs",
    },
    {
      id: 32,
      question: "How to manipulate DOM via service worker?",
      answer:
        "Service workers can't directly access DOM. Communication via:\n1. postMessage API\n2. Client-side message handlers",
      category: "Web APIs",
    },
    {
      id: 33,
      question: "How to persist data across service worker restarts?",
      answer:
        "Use storage APIs:\n1. IndexedDB\n2. Cache API\n3. localStorage (not recommended)",
      category: "Web APIs",
    },
    {
      id: 34,
      question: "What is IndexedDB?",
      answer:
        "Low-level NoSQL database:\n- Structured data storage\n- Indexed queries\n- Transactional\n- Large storage limits",
      category: "Web APIs",
    },
    {
      id: 35,
      question: "What is web storage?",
      answer:
        "Client-side storage APIs:\n1. localStorage - Persistent\n2. sessionStorage - Tab session\n\n```javascript\nlocalStorage.setItem('key', 'value');\nconst data = localStorage.getItem('key');```",
      category: "Web APIs",
    },
    {
      id: 36,
      question: "What is postMessage?",
      answer:
        "Cross-origin communication method:\n```javascript\n// Sending\notherWindow.postMessage(data, targetOrigin);\n\n// Receiving\nwindow.addEventListener('message', handler);```",
      category: "Web APIs",
    },
    {
      id: 37,
      question: "What are cookies?",
      answer:
        "Small text data stored by browser:\n```javascript\ndocument.cookie = 'name=John; expires=Fri, 31 Dec 2023 23:59:59 GMT; path=/';\n```\nFeatures:\n- 4KB limit\n- Sent with requests\n- Manual management",
      category: "Web APIs",
    },
    {
      id: 38,
      question: "Why use cookies?",
      answer:
        "Common use cases:\n- Session management\n- Personalization\n- Tracking\n- Authentication tokens",
      category: "Web APIs",
    },
    {
      id: 39,
      question: "What are cookie options?",
      answer:
        "1. Expires/Max-Age\n2. Domain\n3. Path\n4. Secure\n5. HttpOnly\n6. SameSite\n\nExample:\n```javascript\ndocument.cookie = 'name=John; Secure; SameSite=Strict';```",
      category: "Web APIs",
    },
    {
      id: 40,
      question: "How to delete cookies?",
      answer:
        "Set expiration to past date:\n```javascript\ndocument.cookie = 'name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';```",
      category: "Web APIs",
    },
    {
      id: 41,
      question: "Cookie vs localStorage vs sessionStorage",
      answer:
        "| Feature        | Cookie          | localStorage    | sessionStorage |\n|----------------|-----------------|-----------------|----------------|\n| Capacity       | 4KB             | 5-10MB          | 5-10MB         |\n| Server Access  | Automatic       | None            | None           |\n| Lifetime       | Configurable    | Persistent       | Tab session    |\n| Scope          | Domain+Path     | Origin          | Origin+Tab     |",
      category: "Web APIs",
    },
    {
      id: 42,
      question: "localStorage vs sessionStorage",
      answer:
        "Main difference:\n- localStorage persists across sessions\n- sessionStorage cleared when tab closes",
      category: "Web APIs",
    },
    {
      id: 43,
      question: "How to access web storage?",
      answer:
        "Through global objects:\n```javascript\n// Store\nlocalStorage.setItem('key', 'value');\n\n// Retrieve\nconst data = localStorage.getItem('key');\n\n// Remove\nlocalStorage.removeItem('key');```",
      category: "Web APIs",
    },
    {
      id: 44,
      question: "sessionStorage methods",
      answer:
        "Same interface as localStorage:\n```javascript\nsessionStorage.setItem('key', 'value');\nconst data = sessionStorage.getItem('key');\nsessionStorage.clear();```",
      category: "Web APIs",
    },
    {
      id: 45,
      question: "What is the storage event?",
      answer:
        "Event triggered when storage changes:\n```javascript\nwindow.addEventListener('storage', (e) => {\n  console.log('Storage changed:', e.key);\n});```",
      category: "Web APIs",
    },
    {
      id: 46,
      question: "Why use web storage?",
      answer:
        "Advantages over cookies:\n- Larger capacity\n- No server transmission\n- Cleaner API\n- Better performance",
      category: "Web APIs",
    },
    {
      id: 47,
      question: "Check web storage support",
      answer:
        "Feature detection:\n```javascript\nif (typeof Storage !== 'undefined') {\n  // Supported\n} else {\n  // Fallback\n}```",
      category: "Web APIs",
    },
    {
      id: 48,
      question: "Check web worker support",
      answer:
        "Feature detection:\n```javascript\nif (typeof Worker !== 'undefined') {\n  // Supported\n} else {\n  // Fallback\n}```",
      category: "Web APIs",
    },
    {
      id: 49,
      question: "Web worker example",
      answer:
        "**worker.js:**\n```javascript\nself.onmessage = (e) => {\n  const result = e.data * 2;\n  self.postMessage(result);\n};\n```\n**Main script:**\n```javascript\nconst worker = new Worker('worker.js');\nworker.postMessage(10);\nworker.onmessage = (e) => {\n  console.log(e.data); // 20\n};```",
      category: "Web APIs",
    },
    {
      id: 50,
      question: "Web worker limitations",
      answer:
        "Cannot access:\n- DOM\n- window object\n- document object\n- parent object\n\nUse postMessage for communication",
      category: "Web APIs",
    },
    {
      id: 51,
      question: "What is a Promise?",
      answer:
        "Object representing async operation:\n```javascript\nconst promise = new Promise((resolve, reject) => {\n  setTimeout(() => resolve('Done!'), 1000);\n});\n\npromise\n  .then(result => console.log(result))\n  .catch(error => console.error(error));\n```\nStates: pending, fulfilled, rejected",
      category: "Async",
    },
  ],
};
