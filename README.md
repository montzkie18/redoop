# redoop

[![npm version](https://badge.fury.io/js/redoop.svg)](https://badge.fury.io/js/redoop) [![Build Status](https://travis-ci.org/montzkie18/redoop.svg?branch=master)](https://travis-ci.org/montzkie18/redoop)

Redux OOP class wrappers

Do you love how easy it is to write tests for states outside your React components but too tired of all the boilerplate in Redux? This small package might help you with that.

## Table of Contents

* [Getting Started](#getting-started)
* [Basic Usage](#basic-usage)
* [Advance Usage](#advance-usage)
* [Adding to Redux Store](#adding-to-redux-store)
* [API Reference](#api-reference)


## Getting Started

```Shell
npm install --save redoop
```


## Basic Usage

```JSX
import React from 'react';
import {State} from 'redoop';
import {connect} from 'react-redux';

const TodoList = ({todos, setTodos, text, setText, setState}) => (
  <div>
    <ul>
      {todos.map(todo => <li>{todo}</li>)}
    </ul>
    <input 
      type="text" 
      value={text} 
      onChange={e => setText(e.target.value)}
    />
    <button 
      onClick={() => {
        setTodos(todos.concat(text));
        setText("");
        // or simply
        setState({
          todos: todos.concat(text),
          text: ''
        });
      }
    />
  </div>
);

const todoState = new State("todos", {
  // define your initial state here
  todos: [],
  text: "",
});


const mapStateToProps = (state) => todoState.getState(state);
/* or get only the props you're interested in
const mapStateToProps = (state) => ({

  // reselect getters are automatically defined
  todos: todoState.getTodos(state),
  text: todoState.getText(state),
});
*/

const mapDispatchToProps = todoState.getActionCreators();
/* same here, you can just get the action creators you want to use
const mapDispatchToProps = {

  // a default action creator is also defined for each prop in initial state
  setTodos: todoState.setTodos,
  setText: todoState.setText,
  
  // and you can even use setState just like a React.Component
  // to set multiple props at once
  setState: todoState.setState
};
*/

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
```

## Advance Usage

- todo

## Adding to Redux Store

```Javascript
import {State} from 'redoop';
import {combineReducers} from 'redux';

const todoState = new State("todos");

// combine all your created states here
export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    ...asyncReducers,
    [todoState.stateKey]: todoState.reduce
  });
};

// or you can use this utility for injecting state inside your routes
export const injectState = (store, state) => {
  store.asyncReducers[state.stateKey] = state.reduce;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};
```

## API Reference

- todo