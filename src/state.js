import {createSelector} from 'reselect';
import {capitalize, upperCaseUnderscore, upperCaseUnderScoreToCamel} from './utils';

export default class State {
  constructor(props) {
    const {key, state, types} = props;

    if(!key) throw new Error("State requires a key");
    if(state && state.constructor !== Object)
      throw new Error("State requires param state to be an Object");
    if(types && types.constructor !== Array)
      throw new Error("State requires param types to be an Array");

    this._key = key;
    this._state = Object.freeze({...(state || {})});
    this._types = this.__createTypes(types);
    this._handlers = this.__createHandlers();
    this.__createActionsFromTypes(types);
    this.__createGetters();
    this.__createSetters();
  }

  get stateKey() {
    return this._key;
  }

  get initialState() {
    return this._state;
  }

  get actionTypes() {
    return this._types;
  }

  get actionHandlers() {
    return this._handlers;
  }

  reduce = (state, action) => {
    state = state || this.initialState;
    const handler = this.actionHandlers[action.type];
    return handler ? handler(state, action) : state;
  };

  reset = () => {
    return { type: this.actionTypes.RESET }
  };

  addHandler = (type, handler) => {
    const newHandlers = {...this._handlers, [type]: handler};
    this._handlers = Object.freeze(newHandlers);
  };

  removeHandler = (type) => {
    const newHandlers = {...this._handlers, [type]: undefined};
    this._handlers = Object.freeze(newHandlers);
  };

  getActionCreators = () => {
    
  };

  __createTypes = (types = []) => {
    const result = {};

    types.forEach(type => {
      result[type] = `${this.stateKey}/${type}`;
    });

    Object.keys(this.initialState).forEach(key => {
      result[`SET_${upperCaseUnderscore(key)}`] = `${this.stateKey}/SET/${key}`;
    });

    result['SET_STATE'] = `${this.stateKey}/SET_STATE`;
    result['RESET'] = `${this.stateKey}/RESET`;

    return Object.freeze(result);
  };

  __createHandlers = () => {
    const result = {};

    Object.keys(this.initialState).forEach(key => {
      const type = this.actionTypes[`SET_${upperCaseUnderscore(key)}`];
      result[type] = (state, action) => this.__setValue(state, action, key);
    });

    result[this.actionTypes.SET_STATE] = this.__setState;
    result[this.actionTypes.RESET] = this.__resetValue;

    return Object.freeze(result);
  };

  __createActionsFromTypes = (types = []) => {
    types.forEach(type => {
      const methodName = upperCaseUnderScoreToCamel(type);
      // console.log(`State [${this.stateKey}] creating action [${methodName}]`);
      this[methodName] = (payload) => ({
        type: this.actionTypes[type], 
        payload
      });
    });
  };

  __createSetters = () => {
    this.setState = (payload) => ({type: this.actionTypes.SET_STATE, payload});
    Object.keys(this.initialState).forEach(key => {
      // console.log(`State [${this.stateKey}] creating setter [set${capitalize(key)}]`);
      this[`set${capitalize(key)}`] = (value) => ({
        type: this.actionTypes[`SET_${upperCaseUnderscore(key)}`],
        [key]: value
      });
    });
  };

  __createGetters = () => {
    this.getState = (state) => state[this.stateKey];
    Object.keys(this.initialState).forEach(key => {
      // console.log(`State [${this.stateKey}] creating getter [get${capitalize(key)}]`);
      this[`get${capitalize(key)}`] = createSelector(
        this.getState,
        state => state[key]
      );
    });
  };

  __setValue = (state, action, key) => ({
    ...state,
    [key]: this.__clone(action[key])
  });

  __setState = (state, action, key) => ({
    ...state,
    ...action.payload,
  });

  __resetValue = (state, action) => this.initialState;

  __clone = (obj) => {
    if(obj && obj.constructor === Array)
      return [...obj];
    else if(obj && obj.constructor === Object)
      return {...obj};
    return obj;
  };
}