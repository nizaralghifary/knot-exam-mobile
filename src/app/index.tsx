import { useRouter } from "expo-router";
import { ArrowRight, BookOpen, GraduationCap } from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

export default function HomeScreen() {
  const router = useRouter();
  const badgeProgress = useSharedValue(0);
  const titleProgress = useSharedValue(0);
  const bodyProgress = useSharedValue(0);
  const cardProgress = useSharedValue(0);
  const floatProgress = useSharedValue(0);

  const roles = [
    {
      key: "student",
      title: "Student",
      description: "Take exams assigned to you",
      Icon: GraduationCap,
    },
    {
      key: "teacher",
      title: "Teacher",
      description: "Create and manage exams",
      Icon: BookOpen,
    },
  ] as const;

  useEffect(() => {
    badgeProgress.value = withDelay(60, withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) }));
    titleProgress.value = withDelay(180, withTiming(1, { duration: 620, easing: Easing.out(Easing.cubic) }));
    bodyProgress.value = withDelay(320, withTiming(1, { duration: 620, easing: Easing.out(Easing.cubic) }));
    cardProgress.value = withDelay(460, withTiming(1, { duration: 720, easing: Easing.out(Easing.cubic) }));
    floatProgress.value = withRepeat(
      withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [badgeProgress, bodyProgress, cardProgress, floatProgress, titleProgress]);

  function handleRole() {
    router.push("/signup");
  }

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeProgress.value,
    transform: [
      {
        translateY: interpolate(badgeProgress.value, [0, 1], [18, 0], Extrapolation.CLAMP),
      },
      {
        scale: interpolate(badgeProgress.value, [0, 1], [0.96, 1], Extrapolation.CLAMP),
      },
    ],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleProgress.value,
    transform: [
      {
        translateY: interpolate(titleProgress.value, [0, 1], [22, 0], Extrapolation.CLAMP),
      },
    ],
  }));

  const bodyStyle = useAnimatedStyle(() => ({
    opacity: bodyProgress.value,
    transform: [
      {
        translateY: interpolate(bodyProgress.value, [0, 1], [18, 0], Extrapolation.CLAMP),
      },
    ],
  }));

  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardProgress.value,
    transform: [
      {
        translateY: interpolate(cardProgress.value, [0, 1], [26, 0], Extrapolation.CLAMP),
      },
    ],
  }));

  const floatStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(floatProgress.value, [0, 1], [0, -12], Extrapolation.CLAMP),
      },
      {
        translateX: interpolate(floatProgress.value, [0, 1], [0, 8], Extrapolation.CLAMP),
      },
    ],
  }));

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="absolute left-[-48px] top-[-48px] h-40 w-40 rounded-full bg-primary/10" />
      <Animated.View
        style={floatStyle}
        className="absolute right-[-40px] top-24 h-28 w-28 rounded-full bg-accent/40"
      />
      <View className="absolute bottom-[-90px] left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-muted/50" />

      <View className="flex-1 px-6 pb-6 pt-8">
        <View className="flex-1 items-center justify-center">
          <Animated.View style={titleStyle} className="items-center">
            <Text className="text-center text-4xl font-semibold tracking-tight text-foreground leading-tight">
              KnotExam
            </Text>
          </Animated.View>

          <Animated.View style={bodyStyle} className="mt-4 max-w-sm items-center">
            <Text className="text-center text-base leading-7 text-muted-foreground">
              An Open Source Exam Platform
            </Text>
          </Animated.View>
        </View>

        <Animated.View style={cardStyle} className="gap-3 pb-2">
          {roles.map(({ key, title, description, Icon }) => (
            <Pressable key={key} onPress={handleRole}>
              <Card className="rounded-3xl border-border bg-card shadow-sm">
                <CardHeader className="flex-row items-center gap-4 pb-0">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                    <Icon size={22} className="text-foreground" />
                  </View>
                  <View className="flex-1">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </View>
                  <ArrowRight size={16} className="text-muted-foreground" />
                </CardHeader>
                <CardContent />
              </Card>
            </Pressable>
          ))}

          <Button onPress={handleRole} className="mt-2 h-12 rounded-2xl">
            <Text className="font-medium text-primary-foreground">Get started</Text>
            <ArrowRight size={16} className="text-primary-foreground" />
          </Button>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}