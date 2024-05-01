import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';

export const convertTime=(mongodbDate)=>{
    const jsDate = new Date(mongodbDate);
    const timeDifference = moment(jsDate).fromNow();
    return timeDifference
}

export const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    
  });


  
  if (!result.cancelled) {
    // console.log(result.assets[0])
    return result.assets[0].uri
    
  }
   return "no image"
  
};