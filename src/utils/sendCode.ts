// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function sendVerificationCode(phone: string): Promise<string> {
    return new Promise((resolve) => {
      const newCode = Math.floor(1000 + Math.random() * 9000).toString();
      console.log("Симулированный код:", newCode);
      setTimeout(() => resolve(newCode), 1000);
    });
  }
  