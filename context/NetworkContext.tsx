import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import NetInfo from "@react-native-community/netinfo";

const NetworkContext = createContext<{
    isConnected: boolean
}>({
    isConnected: true
})

export function NetworkContextProvider({children}: PropsWithChildren) {
    const [isConnected, setIsConnected] = useState(true)

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            console.log("Connection type:", state.type);
            console.log("Is connected?", state.isConnected);
            setIsConnected(state.isConnected ?? false); // fallback to false if undefined
        });

        return () => {
            unsubscribe(); // Clean up the listener
        };
    }, []);

    return (
        <NetworkContext.Provider value={{ isConnected }}>
            {children}
        </NetworkContext.Provider>
    )
}

export function AppNetwork() {
    return useContext(NetworkContext)
}