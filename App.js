import {View} from 'react-native';
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

export default function App() {
  return (
      <View>
            <SearchScreen/>
      </View>
  );
}
