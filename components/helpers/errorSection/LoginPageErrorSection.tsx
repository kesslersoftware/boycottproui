import {Text, TouchableOpacity, View} from "react-native";
import {styles} from "../../helpers/errorSection/ErrorSectionStyles";

type ErrorConfig = {
    text: string
    isLink?: boolean
    linkTarget?: string
}

type Props = {
    errorIndexes: number[]
    onLinkPress?: (linkTarget: string) => void
}

const allErrors: ErrorConfig[] = [
    { text: 'Please enter your email and password.' },
    { text: 'Incorrect username or password.' },
    { text: 'Please verify your email before logging in.'},
    { text: 'Didn’t get it?'},
    { text: 'Resend.', isLink: true, linkTarget: 'resendEmail' },
    { text: 'Incorrect email or password. Please try again.' },
    { text: 'This field cannot be empty.' },
    { text: 'Whoops! That doesn’t look like a valid email address.'},
    { text: 'Password must be at least 8 characters long.'},
    { text: 'Passwords don\'t match. Let\'s try again.'},
    { text: 'Please enter a valid email address.'},
    { text: 'Your new passwords don\'t match. Let\'s try that again.'},

    // Add more global errors here as needed
]

export default function ErrorSectionLarge({ errorIndexes, onLinkPress }: Props) {
    return (
        <View style={styles.errorContainerLarge}>
            {errorIndexes.map((i) => {
                const error = allErrors[i]
                if (!error) return null

                if (error.isLink && error.linkTarget) {
                    return (
                        <TouchableOpacity key={i} onPress={() => onLinkPress?.(error.linkTarget)}>
                            <Text style={styles.errorLink}>{error.text}</Text>
                        </TouchableOpacity>
                    )
                }
                return (
                    <Text key={i} style={styles.errorText}>
                        {error.text}
                    </Text>
                )
            })}
        </View>
    );
}
