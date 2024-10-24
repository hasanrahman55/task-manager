import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { auth } from "../firebaseConfig";

export default function RootLayout() {
  const router = useRouter()
  useEffect(() => {
  const unsubscribe =  auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/auth/login')
      }
    })
    return unsubscribe;

  }, [])


  return <Slot/>
}
