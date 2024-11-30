import React, { useEffect, useRef, useState } from "react";

interface OtpInputProps {
  length?: number;
  onOtpSubmit?: (otp: string) => void;
  inputClassName?: string;
  containerClassName?: string;
}

/**
 * OtpInput component for rendering a customizable OTP (One-Time Password) input field.
 * @param props - The properties passed to the component.
 * @param props.length - The number of OTP digits. Defaults to 4.
 * @param props.onOtpSubmit - Callback function called when all OTP digits are filled. Receives the complete OTP as a string.
 * @param props.inputClassName - CSS class name for individual input fields. Defaults to "otpInput".
 * @param props.containerClassName - CSS class name for the container div. Defaults to "otpContainer".
 * @returns A React component that renders an OTP input field.
 */
const OtpInput: React.FC<OtpInputProps> = ({
  length = 4,
  onOtpSubmit = () => {},
  inputClassName = "otpInput",
  containerClassName = "otpContainer",
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) {
      onOtpSubmit(combinedOtp);
    }

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleClick = (index: number) => {
    inputRefs.current[index]?.setSelectionRange(1, 1);
    if (index > 0 && !otp[index - 1]) {
      const firstEmptyIndex = otp.findIndex((val) => !val);
      if (firstEmptyIndex !== -1) {
        inputRefs.current[firstEmptyIndex]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className={containerClassName}>
      {otp.map((value, index) => (
        <input
          key={index}
          type="text"
          ref={(input) => (inputRefs.current[index] = input)}
          value={value}
          onChange={(e) => handleChange(index, e)}
          onClick={() => handleClick(index)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className={inputClassName}
        />
      ))}
    </div>
  );
};

export default OtpInput;
