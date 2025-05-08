import {styles} from "../../helpers/headerBar/HeaderBarStyles";
import {View, Text} from "react-native";

export default function HeaderBar() {
    return (
        <View style={styles.headerBar}>
            <Text style={styles.titleText}>BoycottPro</Text>
        </View>
    );
}
