import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    user: {
        "_id": "6a6eebf8b19b454046a134e0",
        "username": "Azka1",
        "email": "azka1@gmail.com",
        "password": "$2b$10$neuYLoW.FY3px2/WhbayCeO.Ologgq5C3HFowCOWVI1NG3fTStAyK",
        "profilePicture": "",
        "coverPicture": "",
        "followers": [],
        "followings": [],
        "isAdmin": false,
        "createdAt": {"$date": "2026-08-02T07:04:24.907Z"},
        "updatedAt": {"$date": "2026-08-02T08:24:08.675Z"},
        "__v": 0,
        "desc": "my name is Azka.. It's my 1st ID.",
        "city": "Lahore",
        "from:": "Pakistan",
        "relationship": "1"
    },
    isFetching: false,
    error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    return (
        <AuthContext.Provider value={{ user: state.user, isFetching: state.isFetching, error: state.error, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}