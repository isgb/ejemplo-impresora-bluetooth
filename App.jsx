import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, PermissionsAndroid } from 'react-native';
import BluetoothClassic from 'react-native-bluetooth-classic';

const BluetoothApp = () => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        ]);

        if (
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Bluetooth permissions granted');
        } else {
          console.log('Bluetooth permissions denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    const startBluetooth = async () => {
      try {
        const enabled = await BluetoothClassic.isBluetoothEnabled();
        if (!enabled) {
          console.log('Bluetooth is not enabled');
        }
      } catch (error) {
        console.error('Error checking Bluetooth status:', error);
      }
    };

    startBluetooth();
  }, []);

  const listPairedDevices = async () => {
    try {
      const pairedDevices = await BluetoothClassic.getBondedDevices();
      setDevices(pairedDevices);
    } catch (error) {
      console.error('Error listing paired devices:', error);
    }
  };

  const connectToDevice = async (device) => {
    try {
      await BluetoothClassic.connectToDevice(device.id);
      setConnectedDevice(device);
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  const disconnectFromDevice = async () => {
    try {
      await BluetoothClassic.disconnect();
      setConnectedDevice(null);
    } catch (error) {
      console.error('Error disconnecting from device:', error);
    }
  };

  const printTicket = async () => {
    if (!connectedDevice) {
      console.log('No device connected');
      return;
    }
    try {
      const ticket = '**********\n* Ejemplo de Ticket *\n**********\nGracias por su compra!\n';
      await BluetoothClassic.writeToDevice(ticket);
      console.log('Ticket printed successfully');
    } catch (error) {
      console.error('Error printing ticket:', error);
    }
  };

  return (
    <View>
      <Text>{connectedDevice ? `Connected to ${connectedDevice.name}` : 'Not Connected'}</Text>
      <Button title="List Paired Devices" onPress={listPairedDevices} />
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Button title={`Connect to ${item.name}`} onPress={() => connectToDevice(item)} />
        )}
      />
      {connectedDevice && (
        <>
          <Button title="Print Ticket" onPress={printTicket} />
          <Button title="Disconnect" onPress={disconnectFromDevice} />
        </>
      )}
    </View>
  );
};

export default BluetoothApp;
