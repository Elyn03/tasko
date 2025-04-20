import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import {storeDatabaseOfflineTask} from "@/hooks/handleOfflineTasks";

const NetworkContext = createContext<{
    isConnected: boolean
}>({
    isConnected: true
})

export function NetworkContextProvider({ children }: PropsWithChildren) {
    const [isConnected, setIsConnected] = useState(true);
    const [wasOffline, setWasOffline] = useState(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(async (state) => {
            const currentlyConnected = state.isConnected ?? false;
            console.log("Is connected?", currentlyConnected);

            if (currentlyConnected && wasOffline) {
                console.log("Sync offline tasks...");
                await storeDatabaseOfflineTask();
                setWasOffline(false); // reset
            }

            if (!currentlyConnected) {
                setWasOffline(true);
            }

            setIsConnected(currentlyConnected);
        });

        return () => {
            unsubscribe();
        };
    }, [wasOffline]);

    return (
        <NetworkContext.Provider value={{ isConnected }}>
            {children}
        </NetworkContext.Provider>
    )
}

export function AppNetwork() {
    return useContext(NetworkContext)
}
