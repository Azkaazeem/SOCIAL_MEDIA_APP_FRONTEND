import { createContext, useReducer, useEffect } from "react";
import AuthReducer from "./AuthReducer";

let initialUser = null;
try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") {
        initialUser = JSON.parse(stored);
    }
} catch (e) {
    console.error("Failed to parse user from local storage", e);
}

const INITIAL_STATE = {
    user: initialUser,
    isFetching: false,
    error: false,
    dispatch: () => {}
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(() => {
        if (state.user !== undefined) {
            localStorage.setItem("user", JSON.stringify(state.user));
        }
    }, [state.user]);

    return (
        <AuthContext.Provider value={{ user: state.user, isFetching: state.isFetching, error: state.error, dispatch }}>
            {children}
        </AuthContext.Provider>
    )
}