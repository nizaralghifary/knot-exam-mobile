import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
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

  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

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

      await requestJson("/auth/request", { email });

      setOtpModal(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong while creating your account.");
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    if (otp.length !== 6) return;

    setErrorMessage("");

    setOtpLoading(true);

    try {
      await requestJson("/auth/verify", { email, otp });

      setOtpModal(false);
      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid OTP");
      console.error(err.message);
    } finally {
      setOtpLoading(false);
    }
  }

  async function handleResendOTP() {
    setErrorMessage("");

    setResendLoading(true);

    try {
      await requestJson("/auth/request", { email });

      setOtp("");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend OTP");
      console.error(err.message);
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="flex-1 justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <Card className="w-full rounded-3xl border-border bg-card shadow-sm shadow-black/5">
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

            <View className="flex-row items-center border border-input rounded-2xl overflow-hidden">
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={!showPassword}
                editable={!loading}
                className="flex-1 border-0 rounded-none"
              />
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                disabled={loading}
                className="px-3"
              >
                {showPassword
                  ? <EyeOff size={18} className="text-muted-foreground" />
                  : <Eye size={18} className="text-muted-foreground" />
                }
              </Pressable>
            </View>

            <View className="flex-row items-center gap-3 mt-1">
              <Checkbox
                checked={agree}
                onCheckedChange={(v) => setAgree(!!v)}
              />
              <Label className="flex-1 text-muted-foreground font-normal leading-relaxed">
                I agree to the{" "}
                <Text
                  className="text-foreground underline"
                  onPress={() => router.push("/")}
                >
                  Terms of Service
                </Text>
                {" "}and{" "}
                <Text
                  className="text-foreground underline"
                  onPress={() => router.push("/")}
                >
                  Privacy Policy
                </Text>
              </Label>
            </View>

            {errorMessage ? (
              <Text className="text-sm text-destructive">
                {errorMessage}
              </Text>
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

      <Dialog open={otpModal} onOpenChange={setOtpModal}>
        <DialogContent className="gap-5">
          <DialogHeader>
            <DialogTitle>Verify your email</DialogTitle>
            <DialogDescription>
              Enter the 6-digit code sent to {email}
            </DialogDescription>
          </DialogHeader>

          <Input
            value={otp}
            onChangeText={(v) => {
              setOtp(v);
              if (v.length === 6) handleVerifyOTP();
            }}
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            className="rounded-2xl text-center text-xl tracking-widest font-mono"
            editable={!otpLoading}
          />

          <Button
            onPress={handleVerifyOTP}
            disabled={otpLoading || otp.length !== 6}
            className="h-12 rounded-2xl"
          >
            <Text className="text-primary-foreground font-medium">
              {otpLoading ? "Verifying..." : "Verify OTP"}
            </Text>
          </Button>

          <View className="items-center gap-2">
            <Text className="text-sm text-muted-foreground">
              Didn't receive the code?
            </Text>
            <Button
              variant="outline"
              size="sm"
              onPress={handleResendOTP}
              disabled={resendLoading || otpLoading}
              className="rounded-2xl"
            >
              <Text className="text-sm">
                {resendLoading ? "Sending..." : "Resend OTP"}
              </Text>
            </Button>
          </View>

          <Text className="text-xs text-muted-foreground text-center">
            Check your spam folder if you don't see the email
          </Text>
        </DialogContent>
      </Dialog>
    </SafeAreaView>
  );
}