import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { apiUrl } from "@/lib/api";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string | string[] }>();

  const email = useMemo(() => {
    const value = params.email;
    return Array.isArray(value) ? value[0] : value ?? "";
  }, [params.email]);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
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

  async function handleVerify() {
    if (otp.length !== 6) return;

    setErrorMessage("");
    setLoading(true);

    try {
      await requestJson("/auth/verify", { email, otp });
      router.replace("/");
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setErrorMessage("");
    setResendLoading(true);

    try {
      await requestJson("/auth/request", { email });
      setOtp("");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="flex-1 items-center justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <Card className="w-full max-w-md rounded-3xl border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Verify your email</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to {email || "your email"}
            </CardDescription>
          </CardHeader>

          <CardContent className="gap-4">
            <Input
              value={otp}
              onChangeText={setOtp}
              placeholder=""
              keyboardType="number-pad"
              maxLength={6}
              className="rounded-2xl px-4 text-center text-xl tracking-[0.35em] font-mono"
              editable={!loading}
            />

            {errorMessage ? (
              <Text className="text-sm text-destructive">{errorMessage}</Text>
            ) : null}

            <Button
              onPress={handleVerify}
              disabled={loading || otp.length !== 6 || !email}
              className="h-12 rounded-2xl"
            >
              <Text className="text-primary-foreground font-medium">
                {loading ? "Verifying..." : "Verify OTP"}
              </Text>
            </Button>

            <View className="items-center gap-2">
              <Text className="text-sm text-muted-foreground">
                Didn't receive the code?
              </Text>
              <Button
                variant="outline"
                size="sm"
                onPress={handleResend}
                disabled={resendLoading || loading || !email}
                className="rounded-2xl"
              >
                <Text className="text-sm">
                  {resendLoading ? "Sending..." : "Resend OTP"}
                </Text>
              </Button>
            </View>

            <Pressable onPress={() => router.back()} className="items-center">
              <Text className="text-sm text-muted-foreground underline">
                Cancel
              </Text>
            </Pressable>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}