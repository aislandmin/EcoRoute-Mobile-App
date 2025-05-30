import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Params = {
  mode?: string;
  from: string; // user-entered strings (addresses or place names)
  to: string; // user-entered strings (addresses or place names)
};

export default function MapScreen() {
  const router = useRouter();
  const { mode, from: fromAddr, to: toAddr } = useLocalSearchParams<Params>();

  const [MapView, setMapView] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);
  const [Polyline, setPolyline] = useState<any>(null);

  const [start, setStart] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [end, setEnd] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [routeCoords, setRouteCoords] = useState<
    { latitude: number; longitude: number }[] | null
  >(null);

  // 1) Dynamically import react-native-maps on native only
  useEffect(() => {
    if (Platform.OS !== "web") {
      import("react-native-maps").then((Maps) => {
        setMapView(() => Maps.default);
        setMarker(() => Maps.Marker);
        setPolyline(() => Maps.Polyline);
      });
    }
  }, []);

  // Convert user-entered strings (addresses or place names) into latitude and longitude using Mapbox Geocoding API.
  // For this current test, not use
  // async function getCoordinates(
  //   query: string
  // ): Promise<{ lat: number; lng: number } | null> {
  //   const token = "YOUR_MAPBOX_TOKEN"; //to be replaced by real token
  //   try {
  //     const response = await fetch(
  //       `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
  //         query
  //       )}.json?access_token=${token}`
  //     );
  //     const data = await response.json();

  //     if (data.features && data.features.length > 0) {
  //       const [lng, lat] = data.features[0].center;
  //       return { lat, lng };
  //     } else {
  //       console.warn("No location found for query:", query);
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Mapbox geocoding error:", error);
  //     return null;
  //   }
  // }

  // 2) Once map loaded, geocode both addresses
  useEffect(() => {
    if (!MapView) return;

    // Convert user-entered strings (addresses or place names) into latitude and longitude
    // (async () => {
    //   try {
    //     const s = await getCoordinates(fromAddr);
    //     const e = await getCoordinates(toAddr);
    //     setStart(s);
    //     setEnd(e);
    //   } catch (err) {
    //     console.error("Geocoding failed:", err);
    //   }
    // })();

    // For this current test, use two dummy coordinates
    const start = { latitude: 43.6426, longitude: -79.3871 }; //CN Tower
    const end = { latitude: 43.6465, longitude: -79.4637 }; //High Park
    setStart(start);
    setEnd(end);
  }, [MapView, fromAddr, toAddr]);

  // 3) Once start/end known, fetch real route for drawing multi-segment polyline
  // For this current test, not uses
  useEffect(() => {
    if (!start || !end) return;

    // Fetch real route for drawing multi-segment polyline
    // for this current test, not use
    // (async () => {
    //   const token = "YOUR_MAPBOX_TOKEN"; //to be replaced by real token
    //   const coords = `${start.longitude},${start.latitude};${end.longitude},${end.latitude}`;
    //   const url =
    //     `https://api.mapbox.com/directions/v5/mapbox/driving/` +
    //     coords +
    //     `?geometries=geojson&access_token=${token}`;

    //   try {
    //     const resp = await fetch(url);
    //     const json = await resp.json();
    //     const line = json.routes[0].geometry.coordinates; // [ [lng,lat], ... ]
    //     setRouteCoords(
    //       line.map(([lng, lat]: [number, number]) => ({
    //         latitude: lat,
    //         longitude: lng,
    //       }))
    //     );
    //   } catch (err) {
    //     console.error("Route fetch failed:", err);
    //   }
    // })();

    //For this current test, use two dummy coordinate of start and end
    setRouteCoords([start, end]);
  }, [start, end]);

  // 4) Loading / fallback states
  if (Platform.OS === "web") {
    return (
      <View style={styles.webFallback}>
        <Text style={{ fontSize: 18 }}>Map is not supported on web.</Text>
      </View>
    );
  }

  // If any of those six things is still missing (MapView, Marker, Polyline, start, end, or routeCoords),
  // The user sees a loading indicator instead of a broken map or errors.
  if (!MapView || !Marker || !Polyline || !start || !end || !routeCoords) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 5) color by mode
  const strokeColor = {
    driving: "#007AFF", // Blue (standard iOS-style car/nav color)
    bicycling: "#4CD964", // Green (fresh, healthy vibe)
    transit: "#9B59B6", // Purple (often used in subway/transit apps)
    walking: "#FFA500", // Orange (energetic, matches current)
  }[mode ?? "driving"];

  // Marker title is user-entered strings (addresses or place names)
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: (start.latitude + end.latitude) / 2,
          longitude: (start.longitude + end.longitude) / 2,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker coordinate={start} title={fromAddr} />
        <Marker coordinate={end} title={toAddr} />
        <Polyline
          coordinates={routeCoords}
          strokeColor={strokeColor}
          strokeWidth={3}
        />
      </MapView>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#2c3e50" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webFallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 10,
    flexDirection: "row", // <-- Align icon and text in a row
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "500",
  },
});
