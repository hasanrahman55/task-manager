import { View, Text, SafeAreaView, Button, FlatList, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from "expo-router";
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
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
            router.replace('/auth/login'); 
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    useEffect(() => {
        
        if(!auth.currentUser){
            router.replace('/auth/login')
        }
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
        marginHorizontal:20,
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
});
