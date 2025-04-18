import {createContext, useState, useEffect, useContext, PropsWithChildren} from "react";
import {supabase} from "@/lib/supabase";

type AuthResponse = {
    success: boolean;
    data?: any;
    error?: string;
};

const AuthContext = createContext<{
    session: any;
    signUpNewUser: (name: string, email: string, password: string) => Promise<AuthResponse>;
    signInUser: (email: string, password: string) => Promise<AuthResponse>;
    signOut: () => Promise<void>;
}>({
    session: undefined,
    signUpNewUser: async (name: string, email: string, password: string) => ({ success: false, data: null }),
    signInUser: async (email: string, password: string) => ({ success: false, data: null }),
    signOut: async () => {},
})


export function AuthContextProvider({children}: PropsWithChildren) {
    const [session, setSession] = useState(undefined)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session: any } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session: any) => {
            setSession(session)
        })
    }, []);


    const signUpNewUser = async (name: string, email: string, password: string) => {
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) {
            let errorMessage = "other"
            if (error.message === "Anonymous sign-ins are disabled") errorMessage = "disabled"
            if (error.message === "Signup requires a valid password") errorMessage = "password"
            if (error.message === "Password should be at least 6 characters.") errorMessage = "password invalid"
            if (error.message === "Unable to validate email address: invalid format") errorMessage = "email invalid"

            return {success: false, error: errorMessage}
        }

        const userCreated = await createUser(name, email)

        if (userCreated.error) {
            console.log("userCreated.error", userCreated.error)
            return {success: false, error: "insert user"}
        }
        return {success: true, data: data}
    }

    const createUser = async (name: string, email: string) => {
        const { error } = await supabase
            .from("users")
            .insert({
                name: name,
                email: email
            })

        if (error) return {success: false, error: error}
        return {success: true}
    }

    const signInUser = async (email: string, password: string) => {
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) {
            let errorMessage = "other"
            if (error.message === "Invalid login credentials") errorMessage = "invalid"
            if (error.message === "missing email or phone") errorMessage = "missing"
            return { success: false, error: errorMessage }
        }
        return { success: true, data: data }
    }

    const signOut = async () => {
        const {error} = await supabase.auth.signOut()
        if (error) {
            console.error("error", error)
        }
    }

    return (
        <AuthContext.Provider value={{ session, signUpNewUser, signInUser, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function UserAuth() {
    return useContext(AuthContext)
}