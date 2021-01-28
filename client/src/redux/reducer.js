import {NETWORK_RECV_MESSAGE, KEY_DOWN, KEY_UP, SET_TYPING} from './actions';

const initialState = {
  accountUUID: null,
  zone: null,
  messages: [],
  keyPressed: {},
  isTyping: false,
};

export default function gameReducer(state = initialState, action) {
  switch (action.type) {
    // TODO: re-architect this! split into own reducer also figure out if we want 
    // to side effect all of the network junk or what should belong in redux
    case NETWORK_RECV_MESSAGE:
      const data = action.payload;

      if (data.connect) {
        return {
          ...state,
          accountUUID: data.connect.uuid,
        }
      }

      if (data.zone && data.zone.load) {
        return {
          ...state,
          zone: data.zone.load,
        }
      }

      if (data.entity && data.entity.spawn && state.zone) {
        return {
          ...state,
          zone: {
            ...state.zone,
            entities: {
              ...state.zone.entities,
              [data.entity.uuid]: data.entity.spawn,
            }
          }
        }
      }

      if (data.entity && data.entity.despawn && state.zone) {
        const {[data.entity.uuid]: value, ...withoutEntity} = state.zone.entities;
        return {
          ...state,
          zone: {
            ...state.zone,
            entities: {
              ...withoutEntity
            }
          }
        }
      }

      if (data.entity && data.entity.move) {
        return {
          ...state,
          zone: {
            ...state.zone,
            entities: {
              ...state.zone.entities,
              [data.entity.uuid]: {
                ...state.zone.entities[data.entity.uuid],
                x: data.entity.move.x,
                y: data.entity.move.y,
              }
            }
          }
        }
      }

      return {
        ...state,
        messages: [
          ...state.messages,
          data,
        ],
      };

    case KEY_DOWN:
      const downCode = action.payload;
      return {
        ...state,
        keyPressed: {
          ...state.keyPressed,
          [downCode]: true,
        },
      };
    
    case KEY_UP:
      const upCode = action.payload;
      return {
        ...state,
        keyPressed: {
          ...state.keyPressed,
          [upCode]: false,
        },
      };
    
    case SET_TYPING:
      const isTyping = action.payload;
      return {
        ...state,
        isTyping,
      };

    default:
      return state;
  }
};