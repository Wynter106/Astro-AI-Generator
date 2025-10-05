import { Slice } from "@reduxjs/toolkit";
import Entity from "../framework@labs/models/Entity";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import PrepareFetchThunk from "../framework@labs/redux/DataManager";

export const useFetchList = <T extends Entity>(url:string, reduxSlice:Slice):T[] => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (url) {
            dispatch(PrepareFetchThunk(url, reduxSlice.actions.replace));
        }
    },[dispatch, url, reduxSlice]);

    const items = useSelector<any, T[]>(
        (state: any) => state.persisted[reduxSlice.name]);
    
    return items;
}
