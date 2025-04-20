import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getImageProfile(session: any) {
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

export const insertTaskImage = async (session: any, newTask: any) => {
    try {
        const key = `tasks-user-${session.user.id}`;

        const tasksImages = await AsyncStorage.getItem(key);
        let localInsert = [newTask];

        if (tasksImages) {
            localInsert = [newTask, ...JSON.parse(tasksImages)];
        }

        await AsyncStorage.setItem(key, JSON.stringify(localInsert))

        return { success: true }
    } catch (err) {
        console.log("ERROR when save task image")
        return { success: false }
    }
}

export const getLocalTaskImages = async (session: any) => {
    const key = `tasks-user-${session.user.id}`;
    const tasksImages = await AsyncStorage.getItem(key);

    if (tasksImages) {
        return JSON.parse(tasksImages)
    }
}
