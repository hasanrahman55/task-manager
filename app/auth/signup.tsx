import { View, Text, TextInput, Button, SafeAreaView } from 'react-native'
import React, { useState } from 'react'

export default function signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <SafeAreaView>
            <View>
                <TextInput
                    placeholder='email'
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    placeholder='password'
                    value={password}
                    onChangeText={setPassword}
                />

                <Button title='sign up' />
                <Text>Already have an account? Login</Text>

            </View>
        </SafeAreaView>

    )
}