import React, { useEffect, useState } from 'react';
import { View, Button, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';

const SalonPhoto = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access camera roll is required!');
            }
        })
    }, []);
  
    // Function to handle image selection
    const selectImage = () => {
      const options = {
        title: 'Select Salon Photo',
        mediaType: 'photo',
        quality: 0.5,
        maxWidth: 500,
        maxHeight: 500,
      };
  
      ImagePicker.showImagePicker(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          // Set the selected image URI
          setSelectedImage({ uri: response.uri });
        }
      });
    };
  
    return (
      <View>
        {/* Display the selected image */}
        {selectedImage && (
          <Image source={{ uri: selectedImage.uri }} style={{ width: 200, height: 200 }} />
        )}
  
        {/* Button to trigger image selection */}
        <Button title="Select Photo" onPress={selectImage} />
      </View>
    );
  };
  
  export default SalonPhoto;
  