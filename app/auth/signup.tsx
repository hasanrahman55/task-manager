import { View, Text, TextInput, Button, SafeAreaView, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from "expo-router";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { setDoc, doc } from 'firebase/firestore';

export default function signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user;

            const userDetails = {
                email: user.email,
                createdAt: new Date(),
            }

            await setDoc(doc(db, "users", user.uid), userDetails)
            router.push('/task/taskList');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <SafeAreaView>
            <View>
                <TextInput
                    placeholder='email'
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize='none'
                />

                <TextInput
                    placeholder='password'
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize='none'
                />

                <Button title='sign up' onPress={handleSignUp} />
                <Text>Already have an account? <Button title='Button' onPress={() => router.push('/auth/login')} /> </Text>

            </View>
        </SafeAreaView>

    )
}