import React, {useState, useEffect} from 'react';
import {StripeProvider} from '@stripe/stripe-react-native';

import {StyleSheet, Button, View, Text} from 'react-native';
import {useStripe} from '@stripe/stripe-react-native';

const App = () => {
  const API_URL = 'http://localhost:8000';
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const {clientSecret, customer} = await response.json();

    return {
      clientSecret,
      customer,
    };
  };
  const initializePaymentSheet = async () => {
    const {clientSecret, customer} = await fetchPaymentSheetParams();

    const {error} = await initPaymentSheet({
      customerId: customer,
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: 'Merchant Name',
    });
    if (!error) {
      setLoading(true);
    }
  };
  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      console.log(`Error code: ${error.code}`, error.message);
    } else {
      console.log('Success', 'Your order is confirmed!');
    }
  };
  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <StripeProvider publishableKey="your publishable key here">
      <View style={styles.container}>
        {!loading ? (
          <Text style={{color: 'black'}}>Loading...</Text>
        ) : (
          <Button
            style={styles.button}
            disabled={!loading}
            title="Checkout"
            color="#841584"
            onPress={openPaymentSheet}
          />
        )}
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginHorizontal: 100,
    marginVertical: 100,
  },
  button: {
    backgroundColor: '#00aeef',
    borderColor: 'red',
    borderWidth: 5,
    borderRadius: 15,
  },
});

export default App;
