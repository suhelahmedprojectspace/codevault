import { createSlice,PayloadAction } from "@reduxjs/toolkit";

export type Notification={
    id:string;
    message:string;
    type:string;
    isRead:boolean;
    createdAt:string;
}

interface State{
    list:Notification[];
    snippetCount:number;
    blogCount:number;
    codeBuddyCount:number;
    total:number;

}

const initialState:State={list:[],
    snippetCount:0,
    blogCount:0,
    codeBuddyCount:0,
    total:0,
};


const slice=createSlice({
    name:"notifications",
    initialState,
    reducers:{
        setCounts:(state,action:PayloadAction<{
            snippetCount:number;
            blogCount:number;
            codeBuddyCount:number;
        }>)=>{
           state.snippetCount=action.payload.snippetCount;
           state.blogCount=action.payload.blogCount;
           state.codeBuddyCount=action.payload.codeBuddyCount;
           state.total=action.payload.snippetCount +
                       action.payload.blogCount +
                      action.payload.codeBuddyCount;
        },
        addNotification:(state,action:PayloadAction<Notification>)=>{
            state.list.unshift(action.payload);
        },
        markAsRead:(state,action:PayloadAction<string>)=>{
            const n=state.list.find((n)=>n.id===action.payload)
            if(n) n.isRead=true;
        },
    },
});

export const {addNotification,markAsRead,setCounts}=slice.actions;
export default slice.reducer