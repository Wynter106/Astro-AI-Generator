import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import Entity from "../models/Entity";
import Action from "../models/Action";
import axios from "axios";

const PrepareFetchThunk = (url: string, action: any,headers?: HeadersInit): any => {
  return async (dispatch: any) => {
    const res = await fetch(url, { headers });
    const json = await res.json();
    console.log("Fetched events:", json);
    console.log("Dispatching action:", action);
    dispatch(action(json));
  };
};
export const PrepareFetchTransformedThunk = (
  url: string,
  action: any,
  transformResponse: (res: any) => any
) => {
  return async (dispatch: any) => {
    try {
      const res = await fetch(url);
      const json = await res.json();
      const transformed = transformResponse(json);
      dispatch(action(transformed));
    } catch (err) {
      console.error("Error fetching from", url, err);
    }
  };
};

//use this thunk when you want to pass to the slice the body sent to the server
export function PreparePostThunk(url: string, body: any, action: any = undefined): any {
  return async (dispatch: any) => {
    await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(action) dispatch(action(body));
  };
}

//use this thunk when you want to pass to the slice the response from the server
export function PreparePostThunkResponse(
  url: string,
  body: any,
  action: any = undefined
): any {
  return async (dispatch: any) => {
    const res = await axios
      .post(url, body, {
        headers: {  
          "Content-Type": "application/json",
        },
      })
      .catch(function (error) {
        return error.response;
      });
    const json = res && res.data;
    if(json && action) dispatch(action(json));
  };
}

export function CreateDataSlice<T>(name: string, initialState:T[] = []) {
  return {
    name: name,
    initialState: initialState,
    reducers: {
      add(state: T[], action: Action<T>) {
        state.push(action.payload);
      },
      addRange(state: T[], action: Action<T[]>) {
        state.push(...action.payload);
      },
      clear(state: T[]) {
        _.remove(state, () => true);
      },
      replace(state: T[], action: Action<T[]>) {
        _.remove(state, () => true);
        state.push(...action.payload);
      },
      clearAndAddOne(state: T[], action: Action<T>) {
        _.remove(state, () => true);
        state.push(action.payload);
      },
    },
  };
}

export function CreateTableSlice<T extends Entity>(name: string) {
  return {
    name: name,
    initialState: [],
    reducers: {
      add(state: T[], action: Action<T>) {
        state.push(setuuidIfNull(action.payload));
      },
      addRange(state: T[], action: Action<T[]>) {
        state.push(...action.payload.map((el) => setuuidIfNull(el)));
      },
      update(state: T[], action: Action<T>) {
        const item = state.find((el) => el.uuid === action.payload.uuid);
        if (item != null) {
          _.assign(item, action.payload);
        }
      },
      addOrUpdate(state: T[], action: Action<T>) {
        const item = state.find((el) => el.uuid === action.payload.uuid);
        if (item != null) {
          _.assign(item, action.payload);
        } else state.push(setuuidIfNull(action.payload));
      },
      remove(state: T[], action: Action<T>) {
        _.remove(state, (el) => el.uuid === action.payload.uuid);
      },
      clear(state: T[]) {
        _.remove(state, () => true);
      },
      replace(state: T[], action: Action<T[]>) {
        _.remove(state, () => true);
        state.push(...action.payload);
      },
      clearAndAddOne(state: T[], action: Action<T>) {
        _.remove(state, () => true);
        state.push(setuuidIfNull(action.payload));
      },
    },
  };
}

function setuuidIfNull<T extends Entity>(entity: T) {
  return entity.uuid == null ? { ...entity, uuid: uuidv4() } : entity;
}

export default PrepareFetchThunk;
