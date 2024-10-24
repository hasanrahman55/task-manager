// app/auth/login.js
import { useState } from 'react';
import { View, TextInput, Button, Text, SafeAreaView } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView>
            <View>
                <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
                <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
                <Button title="Login" onPress={handleLogin} />
                <Text onPress={() => router.push('/auth/signup')}>Don't have an account? Sign Up</Text>
            </View>
        </SafeAreaView>

    );
};

export default Login;
