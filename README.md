# 📍 Tasktrack

**Tasktrack** est une application mobile développée avec **Expo** et **Supabase**. Elle permet de gérer des tâches associées à des lieux, avec notifications de proximité, affichage sur carte et synchronisation en ligne/hors ligne.

---

## ✨ Fonctionnalités principales

- 🔐 Authentification avec Supabase (email + mot de passe)
- 📋 Visualisation des tâches :
  - Liste scrollable avec titre, lieu et statut (fait / pas fait)
  - Carte interactive avec tâches géolocalisées et bouton de centrage
- 🧭 Tri des tâches par **distance** ou **date**
- ✅ Marquer une tâche comme faite (swipe vers la gauche)
- ➕ Création de tâches :
  - Titre
  - Description (optionnelle)
  - Position par géolocalisation ou carte cliquable
  - Image optionnelle (via expo-image-picker)
- 🌗 Mode sombre / clair dynamique
- 📡 Support offline :
  - Stockage local avec AsyncStorage
  - Synchronisation avec Supabase à la reconnexion

---

## 📦 Technologies utilisées

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Expo Router](https://expo.github.io/router/)
- [Supabase](https://supabase.com/) (Auth, BDD, géolocalisation avec PostGIS)
- [expo-location](https://docs.expo.dev/versions/latest/sdk/location/)
- [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

---

## ⚠️ Contraintes techniques

- Pas de backend lourd : uniquement Supabase
- Pagination des tâches (10 par 10 avec `range()`)
- Stockage local et sync automatique
- Authentification sécurisée
- Utilisation des capteurs et permission Android/iOS

---

## 🧪 Difficultés rencontrées

- Complexité de PostGIS avec le type `geography`, résolution après réinstallation de l’extension
- L’implémentation des notifications de proximité s’est avérée complexe à tester et à fiabiliser

---

## 🚀 Lancer le projet

```bash
git clone https://github.com/ton-user/tasktrack.git
cd tasktrack
npm install
npx expo start
```

#### 🔐 Configuration des variables d'environnement

Pour connecter l'application à votre instance Supabase, créez un fichier .env à la racine du projet avec les variables suivantes :

```BASH
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Ces variables sont utilisées pour initialiser Supabase dans l'application, afin d'interagir avec la base de données, gérer l'authentification et les tâches utilisateur.

## 🙌 Auteurs

Céline EAP et Héloïse LE LEZ

Réalisé dans le cadre d’un exercice pédagogique sur le développement mobile avec Expo et Supabase.
