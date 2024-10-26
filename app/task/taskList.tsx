import { View, Text, SafeAreaView, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from "expo-router";
import { db, auth } from '../../firebaseConfig';
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Task, Status } from "../../type";
import { signOut } from 'firebase/auth';
import { Dialog, Portal, Provider, Menu, IconButton } from 'react-native-paper';

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<Status | 'All'>('All'); 
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

    const handleDelete = async (taskId: string) => {
        try {
            await deleteDoc(doc(db, 'task', taskId));
            fetchTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const confirmDelete = (taskId: string) => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: () => handleDelete(taskId) }
            ]
        );
    };

    const updateStatus = async (newStatus: Status) => {
        if (selectedTaskId) {
            try {
                const taskRef = doc(db, 'task', selectedTaskId);
                await updateDoc(taskRef, { status: newStatus });
                fetchTasks();
                setDialogVisible(false);
            } catch (error) {
                console.error("Error updating status:", error);
            }
        }
    };

    const openStatusDialog = (taskId: string) => {
        setSelectedTaskId(taskId);
        setDialogVisible(true);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Filter tasks based on the selected status
    const filteredTasks = selectedStatus === 'All' ? tasks : tasks.filter(task => task.status === selectedStatus);

    return (
        <Provider>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Button title='Add Task' onPress={() => router.push('/task/addTask')} color="#4CAF50" />
                    <Button title='Logout' onPress={handleLogout} color="#F44336" />
                </View>

                {/* Status Filter Buttons */}
                <View style={styles.filterContainer}>
                    <Button title="All" onPress={() => setSelectedStatus('All')} color={selectedStatus === 'All' ? "#4CAF50" : "#888"} />
                    <Button title="Pending" onPress={() => setSelectedStatus(Status.Pending)} color={selectedStatus === Status.Pending ? "#FFA726" : "#888"} />
                    <Button title="In-Progress" onPress={() => setSelectedStatus(Status.InProgress)} color={selectedStatus === Status.InProgress ? "#29B6F6" : "#888"} />
                    <Button title="Completed" onPress={() => setSelectedStatus(Status.Completed)} color={selectedStatus === Status.Completed ? "#66BB6A" : "#888"} />
                </View>

                <Text style={styles.title}>Task List</Text>
                <FlatList
                    data={filteredTasks} // Render filtered tasks
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.taskItem}>
                            <Text style={styles.taskTitle}>{item.title}</Text>
                            <Text style={styles.taskDetail}>{item.detail}</Text>
                            <TouchableOpacity onPress={() => openStatusDialog(item.id)}>
                                <Text style={styles.taskStatus}>Status: {item.status}</Text>
                            </TouchableOpacity>
                            <View style={styles.menuContainer}>
                                <Menu
                                    visible={menuVisible}
                                    onDismiss={() => setMenuVisible(false)}
                                    anchor={
                                        <IconButton
                                            icon="dots-vertical"
                                            onPress={() => setMenuVisible(true)}
                                        />
                                    }
                                >
                                    <Menu.Item onPress={() => router.push(`/task/addTask?id=${item.id}`)} title="Edit" />
                                    <Menu.Item onPress={() => confirmDelete(item.id)} title="Delete" />
                                </Menu>
                            </View>
                        </View>
                    )}
                    contentContainerStyle={styles.listContainer}
                />

                {/* Dialog for changing status */}
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                        <Dialog.Title>Change Status</Dialog.Title>
                        <Dialog.Content>
                            <Button title="Pending" onPress={() => updateStatus(Status.Pending)} color="#FFA726" />
                            <Button title="In-Progress" onPress={() => updateStatus(Status.InProgress)} color="#29B6F6" />
                            <Button title="Completed" onPress={() => updateStatus(Status.Completed)} color="#66BB6A" />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button title="Cancel" onPress={() => setDialogVisible(false)} color="#F44336" />
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </SafeAreaView>
        </Provider>
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
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 80,
    },
    taskItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 2,
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
    menuContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
});
