import { View, Text, SafeAreaView, Button, FlatList, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from "expo-router";
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { Task } from "../../type";
import { signOut } from 'firebase/auth';

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const router = useRouter();

    const fetchTasks = async () => {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(collection(db, 'task'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const tasksData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        })) as Task[];
        setTasks(tasksData);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace('/auth/login'); // Redirect to login page after logout
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleDelete = async (taskId: string) => {
        try {
            await deleteDoc(doc(db, 'task', taskId));
            fetchTasks(); // Refresh the task list after deletion
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const confirmDelete = (taskId: string) => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                { text: "OK", onPress: () => handleDelete(taskId) }
            ]
        );
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button title='Add Task' onPress={() => router.push('/task/addTask')} color="#4CAF50" />
                <Button title='Logout' onPress={handleLogout} color="#F44336" />
            </View>
            <Text style={styles.title}>Task List</Text>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.taskItem}>
                        <Text style={styles.taskTitle}>{item.title}</Text>
                        <Text style={styles.taskDetail}>{item.detail}</Text>
                        <Text style={styles.taskStatus}>{item.status}</Text>
                        <View style={styles.buttonContainer}>
                            <Button title='Edit' onPress={() => router.push(`/task/addTask?id=${item.id}`)} color="#2196F3" />

                            <Button title='Delete' onPress={() => confirmDelete(item.id)} color="#F44336" />
                        </View>
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 80, // Adjust padding as necessary
    },
    taskItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2, // For Android
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    taskDetail: {
        fontSize: 14,
        color: '#555',
    },
    taskStatus: {
        fontSize: 12,
        color: '#888',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
});
