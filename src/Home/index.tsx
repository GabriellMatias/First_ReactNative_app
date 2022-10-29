import { useState, useEffect, useRef } from "react";
import { Image, SafeAreaView, ScrollView, TextInput, View } from "react-native";

import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { PositionChoice } from "../components/PositionChoice";

import { styles } from "./styles";
import { POSITIONS, PositionProps } from "../utils/positions";

import { Camera, CameraType } from "expo-camera";
import { captureRef } from "react-native-view-shot";
import * as Sharing from 'expo-sharing'

export function Home() {

  const [photo, setPhotoURI] = useState<null|string>(null)
  const [hasCameraPermission, SethasCameraPermision] = useState(false);
  const [positionSelected, setPositionSelected] = useState<PositionProps>(
    POSITIONS[0]
  );

  const screenshotRef = useRef(null)
  const cameraRef = useRef<Camera>(null)

  async function handleTakePicture(){
    const photo = await cameraRef.current.takePictureAsync()
    setPhotoURI(photo.uri)
  }

  async function handleShareScreenshot(){
    const screenShot = await captureRef(screenshotRef)
    await Sharing.shareAsync("file://" + screenShot)
  }

  useEffect(() => {
    Camera.requestCameraPermissionsAsync().then((response) =>
      SethasCameraPermision(response.granted)
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View ref={screenshotRef}>
          <Header position={positionSelected} />

          <View style={styles.picture}>

            {hasCameraPermission && !photo ? 
            <Camera 
            ref={cameraRef}
            style={styles.camera}
            type={CameraType.front}
            /> : 
              <Image
                source={{
                  uri:photo? photo: "https://images.gutefrage.net/media/fragen/bilder/meine-kamera-auf-windows-10-funktioniert-nicht-was-tun/0_big.jpg?v=1584606917000",
                }}
                style={styles.camera}
                onLoad={handleShareScreenshot}
              />
            }

            <View style={styles.player}>
              <TextInput
                placeholder="Digite seu nome aqui"
                style={styles.name}
              />
            </View>
          </View>
        </View>

        <PositionChoice
          onChangePosition={setPositionSelected}
          positionSelected={positionSelected}
        />

        <Button title="Compartilhar" onPress={handleTakePicture} />
      </ScrollView>
    </SafeAreaView>
  );
}
