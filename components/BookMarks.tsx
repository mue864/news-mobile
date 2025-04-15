import { useEffect } from "react";
import { Text, View } from "react-native";

interface BookmarksProps {
    title: string
}

const Bookmarks: React.FC<BookmarksProps> = ({title}) => {
    useEffect(() => {
        console.log(title)
    }, [title])
    return ( 
        <View>
            
        </View>
     );
}
 
export default Bookmarks;