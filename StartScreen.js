import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { theme } from "./colors";
import {LinearGradient} from 'expo-linear-gradient';
import { getDatabase, ref, child, get } from "firebase/database";
import * as SecureStore from 'expo-secure-store';

function StartScreen({ navigation }) {
  const previousScreen = null
  const nextScreen = 'GoogleLoginScreen'

  const initUserData = async () => {
    // const id = "haegu1"; // 후에 로그인 된 아이디로 대체해야함
    const id = await SecureStore.getItemAsync("id");
    const privateKey = await SecureStore.getItemAsync("privateKey");
    console.log(id, privateKey);
    if (id && privateKey) {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${id}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            if (snapshot.val().userPrivateKey === privateKey) {
              // 테스트를 위해 Main이나 Certification으로 가고 싶지 않은 경우 이 부분을 false로 만드시면 됩니다
              alert("🔐 로그인 성공 !!🔐");
              snapshot.val().userCertification
                ? navigation.navigate("MainScreen") // 인증된 회원이라면
                : navigation.navigate("CertificationScreen"); // 인증되지 않은 회원이라면
            } else {
              console.log("자동 로그인 실패");
            }
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    else {
      console.log("디버깅 용:")
      console.log("id :",id);
      console.log("privateKey :",privateKey);
    }
  };
    useEffect(() => initUserData(), []); // 초기 실행
  return (
    <ImageBackground
      source={require("./image/bg.jpg")}
      resizeMode="cover"
      style={styles.image}
    >
      <View style={styles.main}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            navigation.navigate(nextScreen);
          }}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            colors={["#ee9ca7", "#ffdde1"]}
            style={styles.gradient}
          >
            <Text style={styles.startButtonText}>가입하기</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    borderRadius: 30,
  },
  startButton: {
    marginBottom: 50,
  },
  startButtonText: {
    textAlign: "center",
    paddingVertical: 15,
    paddingHorizontal: 50,
    fontSize: 20,
    color: "white",
    fontWeight: 'bold',
  },
});

export default StartScreen;
