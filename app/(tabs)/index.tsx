import { Image, StyleSheet, View } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BleManager, Device } from "react-native-ble-plx";
import { useEffect, useState } from "react";
import { useLiveDeviceScan } from "@/utils/bluetoothScan";

export const manager = new BleManager();

export default function HomeScreen() {
  const { devices, startScan, stopScan } = useLiveDeviceScan(manager);
  const [devicesFound, setDevicesFound] = useState(new Set<Device>());

  useEffect(() => {
    startScan();
    return () => stopScan();
  }, [startScan, stopScan]);

  useEffect(() => {
    setDevicesFound(new Set(devices.values()));
  }, [devices]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <View>
        {Array.from(devicesFound).map((device) => (
          <ThemedView key={device.id}>
            <ThemedText>{device.localName}</ThemedText>
            <ThemedText>{device.id}</ThemedText>
          </ThemedView>
        ))}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
