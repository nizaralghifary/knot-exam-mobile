import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { apiUrl } from "@/lib/api";

export default function SignUp() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function requestJson(path: string, body: Record<string, unknown>) {
    const response = await fetch(apiUrl(path), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || data.error || "Request failed");
    }

    return data;
  }

  async function handleSignUp() {
    setErrorMessage("");

    if (!agree) {
      setErrorMessage("Please accept the terms before continuing.");
      return;
    }

    setLoading(true);

    try {
      await requestJson("/auth/signup", { username, email, password });
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong while creating your account.");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="flex-1 justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <Card className="w-full rounded-3xl border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create your account</CardDescription>
          </CardHeader>

          <CardContent className="gap-3">
            <Input
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              autoCapitalize="none"
              editable={!loading}
              className="rounded-2xl"
            />

            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              className="rounded-2xl"
            />

            <View className="relative overflow-hidden rounded-2xl border border-input">
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={!showPassword}
                editable={!loading}
                className="border-0 rounded-none pr-12"
              />
              <Pressable
                onPress={() => setShowPassword((current) => !current)}
                disabled={loading}
                className="absolute right-0 top-0 h-full items-center justify-center px-3"
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-muted-foreground" />
                ) : (
                  <Eye size={18} className="text-muted-foreground" />
                )}
              </Pressable>
            </View>

            <View className="flex-row items-center gap-3 mt-1">
              <Checkbox
                checked={agree}
                onCheckedChange={(value) => setAgree(!!value)}
              />
              <Label className="flex-1 text-muted-foreground font-normal leading-relaxed">
                I agree to the{" "}
                <Text
                  className="text-foreground underline"
                  onPress={() => router.push("https://knot.nizar.my.id/terms")}
                >
                  Terms of Service
                </Text>
                {" "}and{" "}
                <Text
                  className="text-foreground underline"
                  onPress={() => router.push("https://knot.nizar.my.id/privacy")}
                >
                  Privacy Policy
                </Text>
              </Label>
            </View>

            {errorMessage ? (
              <Text className="text-sm text-destructive">{errorMessage}</Text>
            ) : null}

            <Button
              onPress={handleSignUp}
              disabled={loading || !agree}
              className="mt-2 h-12 rounded-2xl"
            >
              <Text className="text-primary-foreground font-medium">
                {loading ? "Creating account..." : "Register"}
              </Text>
            </Button>

            <View className="flex-row justify-center gap-1 mt-1">
              <Text className="text-sm text-muted-foreground">Already have an account?</Text>
              <Pressable onPress={() => router.push("/")} disabled={loading}>
                <Text className="text-sm text-foreground underline">Sign In</Text>
              </Pressable>
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}