export const reactQuestion = [
  {
    id: 1,
    question: "What is React?",
    category: "Core React",
    answer:
      "React (aka React.js or ReactJS) is an **open-source front-end JavaScript library** that is used for building composable user interfaces, especially for single-page applications. It is used for handling view layer for web and mobile apps based on components in a declarative approach.\n\nReact was created by [Jordan Walke](https://github.com/jordwalke), a software engineer working for Facebook. React was first deployed on Facebook's News Feed in 2011 and on Instagram in 2012.",
  },
  {
    id: 2,
    category: "Core React",
    question: "What is the history behind React evolution?",
    answer:
      "The history of ReactJS started in 2010 with the creation of **XHP**. XHP is a PHP extension which improved the syntax of the language such that XML document fragments become valid PHP expressions and the primary purpose was used to create custom and reusable HTML elements.\n\nThe main principle of this extension was to make front-end code easier to understand and to help avoid cross-site scripting attacks. The project was successful to prevent the malicious content submitted by the scrubbing user.\n\nBut there was a different problem with XHP in which dynamic web applications require many roundtrips to the server, and XHP did not solve this problem. Also, the whole UI was re-rendered for small change in the application. Later, the initial prototype of React is created with the name **FaxJ** by Jordan inspired from XHP. Finally after sometime React has been introduced as a new library into JavaScript world.\n\n**Note:** JSX comes from the idea of XHP",
  },
  {
    id: 3,
    category: "Core React",
    question: "What are the major features of React?",
    answer:
      "The major features of React are:\n\n- Uses **JSX** syntax, a syntax extension of JS that allows developers to write HTML in their JS code.\n- It uses **Virtual DOM** instead of Real DOM considering that Real DOM manipulations are expensive.\n- Supports **server-side rendering** which is useful for Search Engine Optimizations(SEO).\n- Follows **Unidirectional or one-way** data flow or data binding.\n- Uses **reusable/composable** UI components to develop the view.",
  },
  {
    id: 4,
    question: "What is JSX?",
    category: "Core React",
    answer:
      '_JSX_ stands for _JavaScript XML_ and it is an XML-like syntax extension to ECMAScript. Basically it just provides the syntactic sugar for the `React.createElement(type, props, ...children)` function, giving us expressiveness of JavaScript along with HTML like template syntax.\n\nIn the example below, the text inside `<h1>` tag is returned as JavaScript function to the render function.\n\n```jsx harmony\nexport default function App() {\n  return <h1 className="greeting">{"Hello, this is a JSX Code!"}</h1>;\n}\n```\n\nIf you don\'t use JSX syntax then the respective JavaScript code should be written as below,\n\n```javascript\nimport { createElement } from "react";\n\nexport default function App() {\n  return createElement(\n    "h1",\n    { className: "greeting" },\n    "Hello, this is a JSX Code!"\n  );\n}\n```\n\n<details><summary><b>See Class</b></summary>\n<p>\n\n```jsx harmony\nclass App extends React.Component {\n  render() {\n    return <h1 className="greeting">{"Hello, this is a JSX Code!"}</h1>;\n  }\n}\n```\n\n</p>\n</details>\n\n**Note:** JSX is stricter than HTML',
  },
  {
    id: 5,
    question: "What is the difference between Element and Component?",
    category: "Core React",
    answer:
      'An _Element_ is a plain object describing what you want to appear on the screen in terms of the DOM nodes or other components. _Elements_ can contain other _Elements_ in their props. Creating a React element is cheap. Once an element is created, it cannot be mutated.\n\nThe JavaScript representation(Without JSX) of React Element would be as follows:\n\n```javascript\nconst element = React.createElement("div", { id: "login-btn" }, "Login");\n```\n\nand this element can be simiplified using JSX\n\n```html\n<div id="login-btn">Login</div>\n```\n\nThe above `React.createElement()` function returns an object as below:\n\n```javascript\n{\n  type: \'div\',\n  props: {\n    children: \'Login\',\n    id: \'login-btn\'\n  }\n}\n```\n\nFinally, this element renders to the DOM using `ReactDOM.render()`.\n\nWhereas a **component** can be declared in several different ways. It can be a class with a `render()` method or it can be defined as a function. In either case, it takes props as an input, and returns a JSX tree as the output:\n\n```javascript\nconst Button = ({ handleLogin }) => (\n  <div id={"login-btn"} onClick={handleLogin}>\n    Login\n  </div>\n);\n```\n\nThen JSX gets transpiled to a `React.createElement()` function tree:\n\n```javascript\nconst Button = ({ handleLogin }) =>\n  React.createElement(\n    "div",\n    { id: "login-btn", onClick: handleLogin },\n    "Login"\n  );',
  },
  {
    id: 6,
    question: "How to create components in React?",
    category: "Core React",
    answer:
      "Components are the building blocks of creating User Interfaces(UI) in React. There are two possible ways to create a component.\n\n1. **Function Components:** This is the simplest way to create a component. Those are pure JavaScript functions that accept props object as the one and only one parameter and return React elements to render the output:\n\n   ```jsx harmony\n   function Greeting({ message }) {\n     return <h1>{`Hello, ${message}`}</h1>;\n   }\n   ```\n\n2. **Class Components:** You can also use ES6 class to define a component. The above function component can be written as a class component:\n\n   ```jsx harmony\n   class Greeting extends React.Component {\n     render() {\n       return <h1>{`Hello, ${this.props.message}`}</h1>;\n     }\n   }\n   ```",
  },
  {
    id: 7,
    question: "When to use a Class Component over a Function Component?",
    category: "Core React",
    answer:
      'After the addition of Hooks(i.e. React 16.8 onwards) it is always recommended to use Function components over Class components in React. Because you could use state, lifecycle methods and other features that were only available in class component present in function component too.\n\nBut even there are two reasons to use Class components over Function components.\n\n1. If you need a React functionality whose Function component equivalent is not present yet, like Error Boundaries.\n2. In older versions, If the component needs _state or lifecycle methods_ then you need to use class component.\n\nSo the summary to this question is as follows:\n\n**Use Function Components:**\n\n- If you don\'t need state or lifecycle methods, and your component is purely presentational.\n- For simplicity, readability, and modern code practices, especially with the use of React Hooks for state and side effects.\n\n**Use Class Components:**\n\n- If you need to manage state or use lifecycle methods.\n- In scenarios where backward compatibility or integration with older code is necessary.\n\n**Note:** You can also use reusable [react error boundary](https://github.com/bvaughn/react-error-boundary) third-party component without writing any class. i.e, No need to use class components for Error boundaries.\n\nThe usage of Error boundaries from the above library is quite straight forward.\n\n> **_Note when using react-error-boundary:_** ErrorBoundary is a client component. You can only pass props to it that are serializable or use it in files that have a `"use client";` directive.\n\n```jsx\n"use client";\n\nimport { ErrorBoundary } from "react-error-boundary";\n\n<ErrorBoundary fallback={<div>Something went wrong</div>}>\n  <ExampleApplication />\n</ErrorBoundary>;```',
  },
  {
    id: 8,
    question: "What are Pure Components?",
    category: "Core React",
    answer:
      'Pure components are the components which render the same output for the same state and props. In function components, you can achieve these pure components through memoized `React.memo()` API wrapping around the component. This API prevents unnecessary re-renders by comparing the previous props and new props using shallow comparison. So it will be helpful for performance optimizations.\n\nBut at the same time, it won\'t compare the previous state with the current state because function component itself prevents the unnecessary rendering by default when you set the same state again.\n\nThe syntactic representation of memoized components looks like below,\n\n```jsx\nconst MemoizedComponent = memo(SomeComponent, arePropsEqual?);\n```\n\nBelow is the example of how child component(i.e., EmployeeProfile) prevents re-renders for the same props passed by parent component(i.e.,EmployeeRegForm).\n\n```jsx\nimport { memo, useState } from "react";\n\nconst EmployeeProfile = memo(function EmployeeProfile({ name, email }) {\n  return (\n    <>\n      <p>Name:{name}</p>\n      <p>Email: {email}</p>\n    </>\n  );\n});\nexport default function EmployeeRegForm() {\n  const [name, setName] = useState("");\n  const [email, setEmail] = useState("");\n  return (\n    <>\n      <label>\n        Name:{" "}\n        <input value={name} onChange={(e) => setName(e.target.value)} />\n      </label>\n      <label>\n        Email:{" "}\n        <input value={email} onChange={(e) => setEmail(e.target.value)} />\n      </label>\n      <hr />\n      <EmployeeProfile name={name} />\n    </>\n  );\n}\n```\n\nIn the above code, the email prop has not been passed to child component. So there won\'t be any re-renders for email prop change.\n\nIn class components, the components extending _`React.PureComponent`_ instead of _`React.Component`_ become the pure components. When props or state changes, _PureComponent_ will do a shallow comparison on both props and state by invoking `shouldComponentUpdate()` lifecycle method.\n\n**Note:** `React.memo()` is a higher-order component.',
  },
  {
    id: 9,
    question: "What is state in React?",
    category: "Core React",
    answer:
      '_State_ of a component is an object that holds some information that may change over the lifetime of the component. The important point is whenever the state object changes, the component re-renders. It is always recommended to make our state as simple as possible and minimize the number of stateful components.\n\n![state](images/state.jpg)\n\nLet\'s take an example of **User** component with `message` state. Here, **useState** hook has been used to add state to the User component and it returns an array with current state and function to update it.\n\n```jsx harmony\nimport { useState } from "react";\n\nfunction User() {\n  const [message, setMessage] = useState("Welcome to React world");\n\n  return (\n    <div>\n      <h1>{message}</h1>\n    </div>\n  );\n}\n```\n\nWhenever React calls your component or access `useState` hook, it gives you a snapshot of the state for that particular render.\n\n<details><summary><b>See Class</b></summary>\n<p>\n\n```jsx harmony\nimport React from "react";\nclass User extends React.Component {\n  constructor(props) {\n    super(props);\n\n    this.state = {\n      message: "Welcome to React world",\n    };\n  }\n\n  render() {\n    return (\n      <div>\n        <h1>{this.state.message}</h1>\n      </div>\n    );\n  }\n}\n```\n\n</p>\n</details>\n\nState is similar to props, but it is private and fully controlled by the component ,i.e., it is not accessible to any other component till the owner component decides to pass it.',
  },
  {
    id: 10,
    question: "What are props in React?",
    category: "Core React",
    answer:
      '_Props_ are inputs to components. They are single values or objects containing a set of values that are passed to components on creation similar to HTML-tag attributes. Here, the data is passed down from a parent component to a child component.\n\nThe primary purpose of props in React is to provide following component functionality:\n\n1. Pass custom data to your component.\n2. Trigger state changes.\n3. Use via `this.props.reactProp` inside component\'s `render()` method.\n\nFor example, let us create an element with `reactProp` property:\n\n```jsx harmony\n<Element reactProp={"1"} />\n```\n\nThis `reactProp` (or whatever you came up with) attribute name then becomes a property attached to React\'s native props object which originally already exists on all components created using React library.\n\n```jsx harmony\nprops.reactProp;\n```\n\nFor example, the usage of props in function component looks like below:\n\n```jsx\nimport React from "react";\nimport ReactDOM from "react-dom";\n\nconst ChildComponent = (props) => {\n  return (\n    <div>\n      <p>{props.name}</p>\n      <p>{props.age}</p>\n      <p>{props.gender}</p>\n    </div>\n  );\n};\n\nconst ParentComponent = () => {\n  return (\n    <div>\n      <ChildComponent name="John" age="30" gender="male" />\n      <ChildComponent name="Mary" age="25" geneder="female" />\n    </div>\n  );\n};```\n\nThe properties from props object can be accessed directly using destructing feature from ES6 (ECMAScript 2015). It is also possible to fallback to default value when the prop value is not specified. The above child component can be simplified like below.\n\n```jsx harmony\nconst ChildComponent = ({ name, age, gender = "male" }) => {\n  return (\n    <div>\n      <p>{name}</p>\n      <p>{age}</p>\n      <p>{gender}</p>\n    </div>\n  );\n};\n```\n\n**Note:** The default value won\'t be used if you pass `null` or `0` value. i.e, default value is only used if the prop value is missed or `undefined` value has been passed.\n\n<details><summary><b>See Class</b></summary>\n   The Props accessed in Class Based Component as below\n\n```jsx\nimport React from "react";\nimport ReactDOM from "react-dom";\n\nclass ChildComponent extends React.Component {\n  render() {\n    return (\n      <div>\n        <p>{this.props.name}</p>\n        <p>{this.props.age}</p>\n        <p>{this.props.gender}</p>\n      </div>\n    );\n  }\n}\n\nclass ParentComponent extends React.Component {\n  render() {\n    return (\n      <div>\n        <ChildComponent name="John" age="30" gender="male" />\n        <ChildComponent name="Mary" age="25" gender="female" />\n      </div>\n    );\n  }</details>```',
  },
  {
    id: 11,
    question: "What are React Hooks?",
    category: "Hooks",
    answer:
      "Hooks are functions introduced in React 16.8 that let you use state and other React features without writing a class. The most commonly used hooks are useState, useEffect, useContext, useReducer, and useRef.",
  },
  {
    id: 12,
    question: "What is the useEffect hook used for?",
    category: "Hooks",
    answer:
      "useEffect is used to perform side effects in function components. It can be used for data fetching, setting up subscriptions, or manually changing the DOM. It runs after every render by default but can be controlled using the dependency array.",
  },
  {
    id: 13,
    question: "What is the difference between useState and useReducer?",
    category: "Hooks",
    answer:
      "useState is simpler and better for basic state changes. useReducer is more suitable for complex state logic involving multiple sub-values or when the next state depends on the previous one.",
  },
  {
    id: 14,
    question: "How does React handle reconciliation?",
    category: "Performance",
    answer:
      "React uses a diffing algorithm to compare the previous and current virtual DOM trees. It tries to minimize the number of DOM operations by reusing existing DOM elements where possible.",
  },
  {
    id: 15,
    question: "What is the role of keys in React lists?",
    category: "Core React",
    answer:
      "Keys help React identify which items have changed, are added, or removed in a list. They should be unique and stable. Using indexes as keys is discouraged unless items are static.",
  },
  {
    id: 16,
    question: "What is the Context API in React?",
    category: "Advanced",
    answer:
      "The Context API is a way to manage global state and avoid prop drilling. It allows data to be passed through the component tree without manually passing props at every level.",
  },
  {
    id: 17,
    question: "What is React.memo?",
    category: "Performance",
    answer:
      "React.memo is a higher-order component that memoizes a functional component. It prevents unnecessary re-renders if the props haven't changed using a shallow comparison.",
  },
  {
    id: 18,
    question:
      "How is controlled vs uncontrolled components different in React?",
    category: "Forms",
    answer:
      "Controlled components have their form data controlled by React state. Uncontrolled components store data in the DOM and are accessed using refs. Controlled is preferred for form validation and updates.",
  },
  {
    id: 19,
    question: "What are fragments in React?",
    category: "Core React",
    answer:
      "Fragments let you group multiple elements without adding extra nodes to the DOM. They are used when returning multiple elements from a component: `<></>` or `<React.Fragment>`.",
  },
  {
    id: 20,
    question: "What is the purpose of useRef?",
    category: "Hooks",
    answer:
      "useRef returns a mutable ref object whose .current property is initialized to the passed argument. It can hold DOM references or any mutable value that persists across renders without causing re-renders.",
  },
];
