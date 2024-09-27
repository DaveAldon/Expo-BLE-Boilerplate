import { useState, useEffect } from "react";
import { BleManager } from "react-native-ble-plx";

const useConnectedDeviceInfo = (deviceId: string) => {
  const [deviceInfo, setDeviceInfo] = useState({ name: "", id: "", rssi: "" });
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const manager = new BleManager();

    const fetchDeviceInfo = async () => {
      try {
        setIsFetching(true);
        const device = await manager.connectedDevices([deviceId]);
        if (device.length > 0) {
          const { localName, id, rssi } = device[0];
          setDeviceInfo({ name: `${localName}`, id, rssi: `${rssi}` });
        } else {
          setError("No device found");
        }
      } catch (err) {
        setError("Failed to fetch device info");
      } finally {
        setIsFetching(false);
      }
    };

    fetchDeviceInfo();

    return () => {
      manager.destroy();
    };
  }, [deviceId]);

  return { deviceInfo, isFetching, error };
};

export default useConnectedDeviceInfo;
