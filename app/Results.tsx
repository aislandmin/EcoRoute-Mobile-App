import { getRoutes } from "@/services/routeService";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

//Unicode emoji characters used to represent modes of transport
const icons: { [key: string]: string } = {
  driving: "🚗",
  bicycling: "🚲",
  transit: "🚆",
  walking: "🚶‍♂️",
};

// Unicode emoji characters used to represent score ranking (medals).
// Score: top1 – Gold Medal, top2 – Silver Medal, top3 – Bronze Medal
const medals = ["🥇", "🥈", "🥉"];

type Params = {
  from: string;
  to: string;
};

export default function ResultsScreen() {
  const router = useRouter();
  const { from, to } = useLocalSearchParams<Params>();

  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    getRoutes().then((data) => {
      // Sort scores descending by score and display top 3
      const sorted = data.sort((a, b) => b.score - a.score).slice(0, 3);
      setRoutes(sorted);
    });
  }, []);

  const getBadgeStyle = (rank: number) => {
    switch (rank) {
      case 0:
        return styles.firstBadge;
      case 1:
        return styles.secondBadge;
      case 2:
        return styles.thirdBadge;
      default:
        return styles.scoreBadge; // fallback
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top 3 Routes</Text>
      <Text style={styles.subtitle}>
        From <Text style={styles.bold}>{from}</Text> to{" "}
        <Text style={styles.bold}>{to}</Text>
      </Text>

      <FlatList
        data={routes}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/Map",
                params: {
                  mode: item.mode,
                  from: from,
                  to: to,
                },
              })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.mode}>
                {icons[item.mode]} {item.mode}
              </Text>

              <View style={styles.scoreRow}>
                {medals[index] && (
                  <Text style={styles.medal}>{medals[index]}</Text>
                )}
                <View style={[styles.scoreBadge, getBadgeStyle(index)]}>
                  <Text style={styles.scoreText}>Score: {item.score}</Text>
                </View>
              </View>
            </View>

            <Text>Distance: {item.distance_km} km</Text>
            <Text>Time: {item.time_min} min</Text>
            <Text>CO₂: {item.co2_g} g</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  mode: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  scoreBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  scoreText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  medal: {
    fontSize: 18,
  },
  firstBadge: {
    backgroundColor: "#4CAF50", // green
  },
  secondBadge: {
    backgroundColor: "#FF9800", // orange
  },
  thirdBadge: {
    backgroundColor: "#9E9E9E", // gray
  },
  defaultBadge: {
    backgroundColor: "#2196F3", // blue
  },
});
