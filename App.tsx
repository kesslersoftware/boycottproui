import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from "./components/screens/loginScreen/LoginScreen";
import RegistrationScreen from "./components/screens/registrationScreen/RegistrationScreen";
import RegistrationEmailSentScreen from "./components/screens/registrationEmailSentScreen/RegistrationEmailSentScreen";
import ForgotPasswordScreen from "./components/screens/forgotPasswordScreen/forgotPasswordScreen";
import ResetEmailSentScreen from "./components/screens/resetEmailSentScreen/ResetEmailSentScreen";
import ResetLinkExpiredScreen from "./components/screens/resetLinkExpiredScreen/ResetLinkExpiredScreen";
import PasswordResetScreen from "./components/screens/passwordResetScreen/PasswordResetScreen";
import PasswordResetSuccessScreen from "./components/screens/passwordResetSuccessScreen/PasswordResetSuccessScreen";
import HomeScreen from "./components/screens/homeScreen/HomeScreen";
import MyTrendsScreen from "./components/screens/myTrendsScreen/MyTrendsScreen";
import TopTrendsScreen from "./components/screens/topTrendsScreen/TopTrendsScreen";
import ProfileSettingsScreen from "./components/screens/profileSettingsScreen/ProfileSettingsScreen";
import CompanyDetailsScreen from "./components/screens/companyDetailsScreen/CompanyDetailsScreen";
import CauseDetailsScreen from "./components/screens/causeDetailsScreen/CauseDetailsScreen";
import SearchScreen from "./components/screens/searchScreen/SearchScreen";
import type {User} from "./types/DataModels";

import {RootStackParamList} from "./types/types";
import React, {useState} from "react";
const Stack = createNativeStackNavigator<RootStackParamList>()
const newUser:User = {
    user_id: "1",
    email_addr: "dylan@dylan.com",
    username: "schnarbies",
    passwordHash: "wabba"
};


export default function App() {
  const [user,setUser] = useState<User>(newUser);
  return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} initialParams={{ user }}/>
              <Stack.Screen name="Registration" component={RegistrationScreen} initialParams={{ user }}/>
              <Stack.Screen name="RegistrationEmail" component={RegistrationEmailSentScreen} initialParams={{ user }}/>
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} initialParams={{ user }}/>
              <Stack.Screen name="ResetEmailSent" component={ResetEmailSentScreen} initialParams={{ user }}/>
              <Stack.Screen name="ResetLinkExpired" component={ResetLinkExpiredScreen} initialParams={{ user }}/>
              <Stack.Screen name="PasswordReset" component={PasswordResetScreen} initialParams={{ user }}/>
              <Stack.Screen name="PasswordResetSuccess" component={PasswordResetSuccessScreen} initialParams={{ user }}/>
              <Stack.Screen name="Home" component={HomeScreen} initialParams={{ user }} />
              <Stack.Screen name="MyTrends" component={MyTrendsScreen} initialParams={{ user }} />
              <Stack.Screen name="TopTrends" component={TopTrendsScreen} initialParams={{ user }} />
              <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} initialParams={{ user }}/>
              <Stack.Screen name="CompanyDetails" component={CompanyDetailsScreen} initialParams={{ user }}/>
              <Stack.Screen name="CauseDetails" component={CauseDetailsScreen} initialParams={{ user }}/>
              <Stack.Screen name="Search" component={SearchScreen} initialParams={{ user }}/>
          </Stack.Navigator>
      </NavigationContainer>
  );
}
