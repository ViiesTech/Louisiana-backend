import otpGenerator from "otp-generator";

export const createOtp = (): string => {
  return otpGenerator.generate(4, {
    digits: true,
    lowerCaseAlphabets: false,
    specialChars: false,
    upperCaseAlphabets: false
  });
};