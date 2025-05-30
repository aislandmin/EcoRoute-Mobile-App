# EcoRoute Mobile App

## Quick Start

### 1. install

- Choose mobile framework:

  **React Native (Expo CLI)**

- Start a new project:

  `npx create-expo-app EcoRouteMobile`

  (note: not to use `npx expo init EcoRouteMobile`, for expo init is not supported in the local CLI, please use `npx create-expo-app` instead)

- Install required packages:

  `npm install @react-navigation/native axios react-native-maps`

  `npm install -g expo-cli`

  `npx expo install react-native-safe-area-context react-native-screens`

- Verify the blank app runs on an Android emulator (Android Studio -> Virtual Device Manager):

  `npx expo start` or `npx expo start --android`

#### Screenshots - the blank app

<img src="/screenshots/screenshot1-1.png" style="width:35%; height:35%;">
<img src="/screenshots/screenshot1-2.png" style="width:35%; height:35%;">

### 2. run app

`npx expo start --android`

### 3. start mock server (if used)

No mock server used

---

## Mock Data

### 1. location for routes.json

`/assets/routes.json`

### 2. loading method for routes.json

in `/services/routeService.ts`

direct import: `import routes from "@/assets/routes.json";`

---

## Design Decisions

### 1. framework choices

- Mobile framework choice: **React Native (Expo CLI)**

- I chose **React Native with Expo** for cross-platform mobile development, enabling rapid iteration and compatibility across Android and iOS. The app is built using **TypeScript** to enhance type safety and developer productivity.

### 2. libraries

- `expo-router`: Enables file-based routing on top of React Navigation, simplifying navigation logic and aligning routes with the file system structure.
- `react-native`: Core framework for building native mobile apps.
- `react`: JavaScript library for building user interfaces; provides the component-based architecture used throughout the app.
- `react-native-maps`: Used to display interactive maps and geolocation features, such as source and destination markers.
- `@expo/vector-icons`: Offers a large collection of customizable vector icons that integrate seamlessly with React Native components.

### 3. structure

The project is organized as follows:

```text
/app          # Input(i.e. index), Results, Map
/assets       # routes.json, icons
/services     # route fetching logic
/components   # reusable UI widgets
```

#### Short screen recording - EcoRoute Mobile App

[Watch App Demo Video](https://drive.google.com/file/d/1F8_BnH10MoeTyRfeSBeEunUcXTUFJWe8/view?usp=drive_link)

#### Screenshots - EcoRoute Mobile App

<img src="/screenshots/screenshot2.png" style="width:35%; height:35%;">
<img src="/screenshots/screenshot3.png" style="width:35%; height:35%;">
<img src="/screenshots/screenshot4.png" style="width:35%; height:35%;">
<img src="/screenshots/screenshot5.png" style="width:35%; height:35%;">
<img src="/screenshots/screenshot6.png" style="width:35%; height:35%;">

The Start or End marker can be clicked to display the address or the place name the user entered as its title.
<img src="/screenshots/screenshot7.png" style="width:35%; height:35%;">

---

## Next Steps - roadmap to production-grade app

To evolve EcoRoute from a prototype into a production-grade application, several enhancements are required:

### 1. real API

- Replace the static routes.json mock data with a real backend API that dynamically generates routes based on live geolocation and transportation data.

- Replace the two dummy hardcoded coordinates (`from` and `to`) with two real coordinates resolved from user-entered addresses or place names using a geocoding service (like Mapbox or Google Maps). (note: the function of converting user-entered strings (addresses or place names) into latitude and longitude has been impletmented by Mapbox API, but the access token needs to be aquired before going ahead)

- Relace the simple polyline between `from` and `to` to a multiple-segment polyline by fetching real route using a geocoding service. (note: the function has been implemented by Mapbox API, but the access token needs to be aquired before going ahead)

### 2. caching

- Implement local caching using libraries like react-query or AsyncStorage. This will minimize redundant API calls and enable offline access to previously viewed routes, improving performance and user experience.

### 3. auth

- Introduce authentication and user profiles using OAuth or Firebase Auth. This will allow features such as saving favorite routes, personal preferences, and usage analytics, improving security and personalization.

### 4. CI/CD

- Set up CI/CD pipelines using GitHub Actions or Expo EAS for automated testing, builds, and deployments. Integrate monitoring tools like Sentry or Firebase Crashlytics for real-time error tracking.

### 5. UI/UX

- Refine the UI for accessibility and responsiveness. Optimize for low-end devices, and conduct usability testing to ensure a smooth and inclusive user experience across platforms.

---

**The End**
