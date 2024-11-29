import { useEffect, useState, useContext } from "react";
import { View, Text, Alert, SafeAreaView } from "react-native";
import db from "@/database/db";
import { averagesSetter } from "@/assets/contexts";
import useSession from "@/utils/useSession";
export default function Statistics() {
  const session = useSession();
  const [tableData, setTableData] = useState(null); // for this screen
  const setAverages = useContext(averagesSetter); // for the main screen
  const [bests, setBests] = useState({ time: null, ao5: null, ao12: null });
  const fetchData = async () => {
    try {
      if (session) {
        // list of jsons, each with fields {id, created_at, user_id, cube_type, scramble, time, ao5, ao12}
        const { data, error } = await db
          .from("solve_times")
          .select()
          .eq("user_id", session.user.id)
          .order("id", { ascending: false });
        if (error) {
          throw error;
        }
        setTableData(data);
        setAverages({ ao5: data[0].ao5, ao12: data[0].ao12 });
      }
    } catch (error) {
      console.log(error);
      //setTimeout(() => fetchData(), 500);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);
  return (
    <View>
      {/* TODO: At the top: show best time, ao5, ao12. button to insert new time
      format data into table 3 columns = time, ao5, ao12 Flatlist and stack navigator similar to a4 you can click on a time to open up a screen.  
      New screen shows same data but now also scramble. Also, has a button to delete this time. be creative on the ui, it's up to you but we are graded on it*/}
      <Text>There is nothing here, please make this UI</Text>
    </View>
  );
}
