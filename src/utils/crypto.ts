import crypto from "crypto";

const algorithm = "aes-256-cbc";
// Using a hex-encoded key (should be set as environment variable in production)
const secretKey =
  process.env.ENCRYPTION_SECRET ||
  "secretkey12345678901234567890secretkey12345678901234567890123456";

export const encrypt = (text: string): string => {
  // Generate a random IV for each encryption (more secure)
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(secretKey, "hex");

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return IV and encrypted data as a combined string
  return `${iv.toString("hex")}:${encrypted}`;
};

export const decrypt = (encryptedText: string): string => {
  const [ivHex, encrypted] = encryptedText.split(":");
  if (!ivHex || !encrypted) {
    throw new Error("Invalid encrypted text format");
  }

  const iv = Buffer.from(ivHex, "hex");
  const key = Buffer.from(secretKey, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
