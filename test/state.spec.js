import State from '../src/state';

const stateKey = "testState";

class TestState extends State {
  constructor(key) {
    const props = {
      key, 
      state: {
        arrayValue: [],
        objectValue: {},
      }, 
      types: ['ADD_ITEM']
    };
    super(props);
  }
}

describe("State", () => {
  describe("#constructor", () => {

    it("requires stateKey", () => {
      expect(() => new State()).toThrow()
    })

    it("requires state param to be an object", () => {
      expect(() => new State({key: stateKey, state: []})).toThrow()
    })

    it("requires types param to be an array", () => {
      expect(() => new State({key: stateKey, types: {}})).toThrow()
    })

    it("creates default getters", () => {
      const testState = new State({
        key: stateKey, 
        state: {
          arrayValue: [],
          objectValue: {},
        }
      })
      expect(testState.getArrayValue).toBeInstanceOf(Function)
      expect(testState.getObjectValue).toBeInstanceOf(Function)
    })

    it("creates default setters", () => {
      const testState = new State({
        key: stateKey, 
        state: {
          arrayValue: [],
          objectValue: {},
        }
      })
      expect(testState.setArrayValue).toBeInstanceOf(Function)
      expect(testState.setObjectValue).toBeInstanceOf(Function)
    })

    it("creates actions from passed in types", () => {
      const testState = new State({key: stateKey, types: ["ADD_ITEM"]})
      expect(testState.addItem).toBeInstanceOf(Function)
    })

  })

  describe("#reducer", () => {

    it("handles default array set action", () => {
      const testState = new State({
        key: stateKey, 
        state: {arrayValue: []}
      })
      const newValue = ["Item1", "Item2", "Item3"]
      const newState = {
        [stateKey]: testState.reduce(null, testState.setArrayValue(newValue))
      }
      expect(testState.getArrayValue(newState)).toEqual(newValue)
    })

    it("handles default object set action", () => {
      const testState = new State({
        key: stateKey, 
        state: {objectValue: {}}
      })
      const newValue = {"1":{id:"1",name:"Test1"}, "2":{id:"2",name:"Test2"}};
      const newState = {
        [stateKey]: testState.reduce(null, testState.setObjectValue(newValue))
      }
      expect(testState.getObjectValue(newState)).toEqual(newValue)
    })

    it("handles reset action", () => {
      const testState = new State({key: stateKey, state: { value: 5 }})
      const newState = {
        [stateKey]: testState.reduce(null, testState.reset())
      }
      expect(testState.getState(newState)).toEqual(testState.initialState)
    })

    it("handles setState action", () => {
      const testState = new State({
        key: stateKey, 
        state: { 
          value: 5, 
          object: { someData: true } 
        }
      })

      const newState = {
        [stateKey]: testState.reduce(null, testState.setState({ 
          value: 10, 
          object: { someData: false } 
        }))
      }

      expect(testState.getValue(newState)).toBe(10)
      expect(testState.getObject(newState)).toEqual({ someData: false })
    });

    it("handles actions with user-defined handler", () => {
      const testState = new State({
        key: stateKey, 
        state: {
          todos: []
        },
        types: ["ADD_TODO"]
      })

      const addTodo = (state, action) => ({
        ...state,
        todos: [...state.todos, action.payload]
      });

      testState.addHandler(testState.actionTypes.ADD_TODO, addTodo);

      const newItem = "Item1"
      const newState = {
        [stateKey]: testState.reduce(null, testState.addTodo(newItem))
      }
      expect(testState.getTodos(newState)).toContain(newItem)
    })

  })
})