import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function LoadingOverlay() {
    return (
        <View style={styles.overlay}>
            <LottieView
                source={require('../../../assets/animation/loading.json')}
                autoPlay
                loop
                style={{ width: 500, height: 500 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject, // 🧠 fills entire screen
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        zIndex: 999, // ensures it appears on top
    },
});
