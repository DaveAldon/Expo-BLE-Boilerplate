import { BleManager } from "react-native-ble-plx";

export const scanAndConnect = (manager: BleManager) => {
  manager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      // Handle error (scanning will be stopped automatically)
      return;
    }
    console.log("Found device: ", device);

    // Check if it is a device you are looking for based on advertisement data
    // or other criteria.
    //if (device.name === "TI BLE Sensor Tag" || device.name === "SensorTag") {
    // Stop scanning as it's not necessary if you are scanning for one device.
    //manager.stopDeviceScan();

    // Proceed with connection.
    //}
  });
};
