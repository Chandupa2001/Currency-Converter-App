import { View, Text, StyleSheet, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import axios from 'axios';
import { Button } from 'react-native-paper';


const App = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [sourceCurrency, setSourceCurrency] = useState("");
  const [targetCurrency, setTargetCurrency] = useState("");
  const [amountInSourceCurrency, setAmountInSourceCurrency] = useState(0);
  const [amountInTargetCurrency, setAmountInTargetCurrency] = useState(0);
  const [currencyNames, setCurrencyNames] = useState([]);
  const [loading, setLoading] = useState(true);

  const dropdownCatItems = Object.keys(currencyNames).map((currency: any) => (
    { label: currencyNames[currency], value: currency }
  ));

  useEffect(() => {
    const getCurrencyNames = async () => {
      try {

        const response = await axios.get("http://10.0.2.2:5000/getAllCurrencies");
        setCurrencyNames(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCurrencyNames();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const formattedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    try {
      const response = await axios.get("http://10.0.2.2:5000/convert", {
        params: {
          date: formattedDate,
          sourceCurrency,
          targetCurrency,
          amountInSourceCurrency,
        },
      });
      console.log(response.data);
      setAmountInTargetCurrency(response.data);
      setLoading(false);

    } catch (err) {
      console.error(err);
    }
  };

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShow(false);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.main}>
      <StatusBar backgroundColor={'#121212'} />
      <Text style={styles.heading}>Convert Your Currency</Text>
      <View style={styles.inputSection}>
        <View style={styles.inputfield}>
          <Text style={styles.inputLabel}>Date</Text>
          <View>
            <TouchableOpacity activeOpacity={0.7} onPress={showDatePicker}>
              <Text style={styles.inputText}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                display="default"
                is24Hour={true}
                onChange={onChange}
              />
            )}
          </View>
        </View>
        <View style={styles.inputfield}>
          <Text style={styles.inputLabel}>Source Currency</Text>
          <Dropdown
            data={dropdownCatItems}
            value={sourceCurrency}
            onChange={(item) => setSourceCurrency(item.value)}
            search = {true}
            inputSearchStyle={{color: 'white'}}
            searchPlaceholder='Search currency'
            placeholder="Select source currency"
            labelField={'label'}
            valueField={'value'}
            placeholderStyle={{ color: '#9ca3af' }}
            style={styles.inputText}
            selectedTextStyle={{ color: 'white' }}
            itemTextStyle={{ color: 'white' }}
            containerStyle={{ backgroundColor: '#374151' }}
          />
        </View>
        <View style={styles.inputfield}>
          <Text style={styles.inputLabel}>Target Currency</Text>
          <Dropdown
            data={dropdownCatItems}
            value={targetCurrency}
            onChange={(item) => setTargetCurrency(item.value)}
            search = {true}
            inputSearchStyle={{color: 'white'}}
            searchPlaceholder='Search currency'
            placeholder="Select target currency"
            labelField={'label'}
            valueField={'value'}
            placeholderStyle={{ color: '#9ca3af' }}
            style={styles.inputText}
            selectedTextStyle={{ color: 'white' }}
            itemTextStyle={{ color: 'white' }}
            containerStyle={{ backgroundColor: '#374151' }}
          />
        </View>
        <View style={styles.inputfield}>
          <Text style={styles.inputLabel}>Amount in Source Currency</Text>
          <TextInput
            keyboardType='numeric'
            onChangeText={(text) => setAmountInSourceCurrency(Number(text))}
            style={styles.inputText}
            placeholder='Amount in source currency'
            placeholderTextColor={'#9ca3af'}
          />
        </View>
        <View>
          <Button mode='contained' style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Get the target currency</Text>
          </Button>
        </View>
        {!loading && (
          <View>
            <Text style={styles.resultText}>
              {amountInSourceCurrency} {sourceCurrency} = <Text style={{ color: 'red', fontSize: 25, fontWeight: '800' }}> {amountInTargetCurrency} </Text> {targetCurrency}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#121212',
  },

  heading: {
    textAlign: 'center',
    marginTop: '8%',
    fontSize: 30,
    fontWeight: '700',
    color: '#22c55e',
  },

  inputSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '10%',
  },

  inputfield: {
    marginBottom: '5%',
    width: '90%',
  },

  inputLabel: {
    color: 'white',
    fontWeight: 'medium',
    marginBottom: '2%',
    fontSize: 16,
  },

  inputText: {
    width: 'auto',
    borderColor: '#4b5563',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#374151',
    color: 'white',
    fontSize: 18,
    padding: 10,
  },

  button: {
    marginTop: '3%',
    backgroundColor: '#22c55e',
    borderRadius: 10,
    paddingHorizontal: '4%',
    paddingVertical: '2%',
  },

  buttonText: {
    fontSize: 18,
    fontWeight: '500',
  },

  resultText: {
    color: 'white',
    fontSize: 18,
    marginTop: '10%',
  },
});
