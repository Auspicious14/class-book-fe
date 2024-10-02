import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import WelcomeScreen from "./welcome";
import OnboardHighlightScreen from "./highlight";
import OnboardBookScreen from "./book";
import OnboardManageScreen from "./manage";
import OnboardFinalScreen from "./final";
import { useNavigation } from "@react-navigation/native";
import { completeOnboarding } from "../../helper";

const OnboardScreen = () => {
  const [show, setShow] = useState<{
    show: boolean;
    type?: "welcome" | "highlight" | "book" | "manage" | "final";
  }>({ show: false, type: "welcome" });

  const router: any = useNavigation();
  return (
    <SafeAreaView>
      {show.type === "welcome" && (
        <WelcomeScreen
          next={() => setShow({ show: true, type: "highlight" })}
          color={show.type == "welcome"}
        />
      )}
      {show.show && show.type === "highlight" && (
        <OnboardHighlightScreen
          next={() => setShow({ show: true, type: "book" })}
          color={show.type == "highlight"}
        />
      )}
      {show.show && show.type === "book" && (
        <OnboardBookScreen
          next={() => setShow({ show: true, type: "manage" })}
          color={show.type == "book"}
        />
      )}
      {show.show && show.type === "manage" && (
        <OnboardManageScreen
          next={() => setShow({ show: true, type: "final" })}
          color={show.type == "manage"}
        />
      )}
      {show.show && show.type === "final" && (
        <OnboardFinalScreen
          next={() => {
            completeOnboarding(), router.navigate("Signup");
          }}
          color={show.type == "final"}
        />
      )}
    </SafeAreaView>
  );
};

export default OnboardScreen;
