import crypto from "crypto";

const algorithm = "aes-256-cbc";
const secretKey = process.env.ENCRYPTION_SECRET || ""; // 32-byte secret key

export const encrypt = (text: string) => {
  // const iv = crypto.randomBytes(16); // 16-byte initialization vector
  const iv = Buffer.alloc(16, 0);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`; // Store IV and encrypted data together
};

export const decrypt = (encryptedText: string) => {
  const [ivHex, encrypted] = encryptedText.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
