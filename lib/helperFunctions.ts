import { NextResponse } from "next/server";

// function to format response
export function response(
  success: boolean,
  status: number,
  message: string,
  data?: any
) {
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    { status }
  );
}

// utils/getErrorMessage.ts
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Internal server error";
}

// function for genrating otp
export async function generateOtp() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // Set expiry for 10 minutes

  return { otp, expiry };
}
