import { View, Text, Button, SafeAreaView } from 'react-native'
import { useRouter } from "expo-router";
import React from 'react'

export default function index() {
    const route = useRouter()
    return (

        <SafeAreaView>
            <View>
                <Text>index</Text>
                <Button title='go to sign up' onPress={() => route.push('/auth/signup')} />
            </View>
        </SafeAreaView>

    )
}