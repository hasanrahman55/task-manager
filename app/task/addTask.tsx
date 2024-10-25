import { View, Text, SafeAreaView, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from "expo-router";

export default function addTask() {
    const [title, setTitle] = useState('')
    const [detail, setDetail] = useState('')

    const router =useRouter();

    const handleAddTask=async ()=>{

        try {
            const user = auth.currentUser;
            if(!user) return;

            const task ={
                title: title,
                detail: detail,
                userId: user.uid,
            }

            await addDoc(collection(db,'task'),task)
            router.replace('/task/taskList')
            
        } catch (error) {
            console.error('Error adding task: ', error);
        }

    }
    return (
        <SafeAreaView>
            <View>
                <Text>addTask</Text>
                <TextInput placeholder='title' value={title} onChangeText={setTitle} autoCapitalize='none'/>
                <TextInput placeholder='details' value={detail} onChangeText={setDetail} autoCapitalize='none'/>
                <Button title='Add Task' onPress={ handleAddTask} />
            </View>
        </SafeAreaView>

    )
}