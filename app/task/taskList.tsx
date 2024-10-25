import { View, Text, SafeAreaView ,Button ,FlatList} from 'react-native'
import React, { useEffect ,useState} from 'react'
import {  useRouter} from "expo-router";
import { db, auth } from '../../firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { Task } from "../../type";
import { signOut } from 'firebase/auth';

export default function taskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const router =useRouter()

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

    useEffect(()=>{
        fetchTasks();
     
    },[])
    return (
        <SafeAreaView>
            <View>
                <Button title='Add Button' onPress={()=>router.push('/task/addTask')}/>
                <Button title='Logout' onPress={handleLogout} /> 
                <Text>taskList</Text>

                <FlatList 
                data={tasks}
                renderItem={({item})=>(
                    <View>
                    <Text>{item.title}</Text>
                    <Text>{item.description}</Text>
                    <Text>{item.status}</Text>
                  </View>
                )}
                />
            </View>
        </SafeAreaView>

    )
}