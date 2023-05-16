import {Theme_Color, Theme_Color_Boolean} from '../constants';

export function themeColor(value){
    return{
        type:Theme_Color,
        payload: value
    }
}

export function themeColorBoolean(value){
    return{
        type: Theme_Color_Boolean,
        payload: value
    }
}