import { Share, View, Text } from "react-native";

interface ShareLinkProps {
    title: string,
    url: string
}

const ShareLink: React.FC<ShareLinkProps>= ({title, url}) => {


    return ( 
        <View>
            <Text>Share Link</Text>
        </View>
     );
}
 
export default ShareLink;