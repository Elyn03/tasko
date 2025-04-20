import { AppState } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import findLocalisation from "@/hooks/findLocalisation";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})

// Continuously refresh the session automatically
AppState.addEventListener('change', (state) => {
    const location = findLocalisation()
    console.log(state, location)

    if (state === 'active') {
        supabase.auth.startAutoRefresh().then()
    } else {
        supabase.auth.stopAutoRefresh().then()
    }
})