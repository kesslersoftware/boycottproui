import {styles} from "../../helpers/statusBar/StatusBarStyles";
import {View, Text} from "react-native";

export default function StatusBar() {
    return (
        <View style={styles.statusBar}>
            <View style={styles.leftSide}>
                <View style={styles.timeImage} />
            </View>
            <View style={styles.rightSide}>
                <View style={styles.batteryImage} />
            </View>
        </View>
    );
}
