import AsyncStorage from "@react-native-async-storage/async-storage";

export const getImageProfile = async (session: any) => {
    const key = `duck-profile-${session.user.id}`;

    const urlStorage = await AsyncStorage.getItem(key)
    const res = await fetch("https://random-d.uk/api/v2/random")

    if (urlStorage) {
        return urlStorage
    }

    const data = await res.json()
    await AsyncStorage.setItem(key, data.url)

    return data.url
}
