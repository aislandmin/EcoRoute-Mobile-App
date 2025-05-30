import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function InputScreen() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleFindRoutes = async () => {
    setLoading(true);
    setError("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate loading
      router.push({
        pathname: "/Results",
        params: { from, to },
      });
    } catch (err) {
      console.error("Error navigating to Results:", err);
      setError("Failed to fetch routes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EcoRoute</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="From"
          value={from}
          onChangeText={setFrom}
          style={styles.input}
        />
        <TextInput
          placeholder="To"
          value={to}
          onChangeText={setTo}
          style={styles.input}
        />
        {loading ? (
          <ActivityIndicator style={{ marginVertical: 10 }} />
        ) : (
          <Button
            title="Find Routes"
            onPress={handleFindRoutes}
            disabled={!from || !to}
          />
        )}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#2c3e50",
  },
  form: {
    width: "80%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});
