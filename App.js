import React, {useEffect, useState} from 'react';
import {StyleSheet, Alert} from 'react-native';
import NotificationComp from './Src/NotificationComp';

import messaging from '@react-native-firebase/messaging';
const gettingtoken = async () => {
  const token = await messaging().getToken();
  Alert.alert('Your FCM Token is ', token);
};

const App = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    gettingtoken(); // getting the FCM Token Here

    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        setLoading(false);
      });

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);
  if (loading) {
    return null;
  }
  return <NotificationComp />;
};

const styles = StyleSheet.create({});

export default App;
