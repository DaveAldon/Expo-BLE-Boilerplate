import { BleManager, Device } from "react-native-ble-plx";
import { useState, useEffect, useCallback, useRef } from "react";

interface ExtendedDevice extends Device {
  lastSeen: number;
}

export const useLiveDeviceScan = (manager: BleManager) => {
  const [devices, setDevices] = useState<Map<string, ExtendedDevice>>(
    new Map()
  );
  const discoveredDevices = useRef(new Map<string, ExtendedDevice>());

  const updateDevice = useCallback((device: Device) => {
    discoveredDevices.current.set(device.id, {
      ...device,
      lastSeen: Date.now(),
    } as ExtendedDevice);
    setDevices(new Map(discoveredDevices.current));
  }, []);

  const startScan = useCallback(() => {
    manager.onStateChange((state) => {
      if (state === "PoweredOn") {
        manager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            console.error(error);
            return;
          }
          if (device && device.id) {
            updateDevice(device);
          }
        });
      }
    }, true);
  }, [manager, updateDevice]);

  const stopScan = useCallback(() => {
    manager.stopDeviceScan();
  }, [manager]);

  useEffect(() => {
    startScan();

    const availabilityCheck = setInterval(() => {
      const now = Date.now();
      discoveredDevices.current.forEach((value, id) => {
        if (now - value.lastSeen > 10000) {
          discoveredDevices.current.delete(id);
          setDevices(new Map(discoveredDevices.current));
        }
      });
    }, 1000);

    const scanRestart = setInterval(() => {
      stopScan();
      startScan();
    }, 5000); // Restart scan every 5 seconds to ensure devices are discovered again

    return () => {
      stopScan();
      clearInterval(availabilityCheck);
      clearInterval(scanRestart);
    };
  }, [startScan, stopScan]);

  return { devices, startScan, stopScan };
};
