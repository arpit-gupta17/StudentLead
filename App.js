import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddLeadScreen from './screens/AddLeadScreen';
import LeadListScreen from './screens/LeadListScreen';
import LeadDetailScreen from './screens/LeadDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Leads"
        screenOptions={{
          headerStyle: { backgroundColor: '#6366f1' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Leads" 
          component={LeadListScreen}
          options={{ title: 'Student Leads' }}
        />
        <Stack.Screen 
          name="AddLead" 
          component={AddLeadScreen}
          options={{ title: 'Add New Lead' }}
        />
        <Stack.Screen 
          name="LeadDetail" 
          component={LeadDetailScreen}
          options={{ title: 'Lead Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



/*import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AddLeadScreen from './screens/AddLeadScreen';
import LeadListScreen from './screens/LeadListScreen';
import LeadDetailScreen from './screens/LeadDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Add Lead">
        <Stack.Screen name="Add Lead" component={AddLeadScreen} />
        <Stack.Screen name="Leads List" component={LeadListScreen} />
        <Stack.Screen name="Lead Details" component={LeadDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
*/