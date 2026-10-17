import {createContext, useReducer} from 'react';

export const AppContext = createContext();

const initialState = {
    login: false,
    loading: true,
    token: localStorage.getItem('token')? localStorage.getItem('token'): null,
    user: localStorage.getItem('user')? localStorage.getItem('user'):null,
    subscribtion:[]
}

const reducer = (state, action) => {
    
    switch(action.type){
        case 'LOGIN':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                login: true,
                loading: false,
                token: action.payload.token
            };

        case 'LOAD_USER': {
            const user = {
                id: action.payload.id,
                email: action.payload.email,
                chanelName: action.payload.chanelName,
                description: action.payload.description,
                thumbnail: action.payload.thumbnail,
                photo: action.payload.photo
            };
            localStorage.setItem('user', JSON.stringify(user));
            return {
                ...state,
                login: true,
                loading: false,
                user
            };
        }
        case 'LOAD_SUBSCRIBTION':
            return{
                ...state,
                subscribtion: action.payload.subscribtion
            }
        case 'SUBSCRIBE':
            return {
                ...state,
                subscribtion: action.payload.subscribtion
            }
        case 'UNSUBSCRIBE':
            return {
                ...state,
                subscribtion: action.payload.subscribtion
            }

        case 'AUTH_ERROR':
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return {
                ...state,
                login: false,
                loading: false,
                token: null,
                user: null
            };
        
        case 'LOGOUT':
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return {
                ...state,
                login: false,
                loading: false
            }
        default:
            throw new Error();
    }
}



export const AppContextProvider = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return(
        <AppContext.Provider value={[state, dispatch]}>
            {props.children}
        </AppContext.Provider>
    )
}