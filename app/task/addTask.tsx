import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useRouter, useLocalSearchParams } from "expo-router";
import { Status } from "../../type";

const AddTask = () => {
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const { id } = useLocalSearchParams(); 

    useEffect(() => {
        if (id) {
            setIsEditing(true);
            fetchTask(id);
        }
    }, [id]);

    const fetchTask = async (taskId) => {
        const taskDoc = await getDoc(doc(db, 'task', taskId));
        if (taskDoc.exists()) {
            const taskData = taskDoc.data();
            setTitle(taskData.title);
            setDetail(taskData.detail);
        }
    };

    const handleSubmit = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            if (isEditing) {
                await updateDoc(doc(db, 'task', id), { title, detail , updatedAt: new Date()});
            } else {
                const task = {
                    title,
                    detail,
                    userId: user.uid,
                    status:Status.Pending,
                    createdAt: new Date(),
                };
                await addDoc(collection(db, 'task'), task);
            }

            router.replace('/task/taskList');
        } catch (error) {
            console.error('Error saving task: ', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>{isEditing ? 'Edit Task' : 'Add New Task'}</Text>

                <TextInput
                    placeholder='Task Title'
                    value={title}
                    onChangeText={setTitle}
                    autoCapitalize='none'
                    style={styles.input}
                    placeholderTextColor="#888"
                />

                <TextInput
                    placeholder='Task Details'
                    value={detail}
                    onChangeText={setDetail}
                    autoCapitalize='none'
                    style={[styles.input, styles.detailInput]} // Additional styling for detail input
                    multiline
                    numberOfLines={4}
                    placeholderTextColor="#888"
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>{isEditing ? 'Update Task' : 'Add Task'}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => router.replace('/task/taskList')}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default AddTask;

//... [styles remain the same]


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#f5f5f5',
    },
    detailInput: {
        height: 100, // Height for the details input
    },
    button: {
        backgroundColor: '#007AFF',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
