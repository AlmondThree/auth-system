const crypto = require("crypto");
const { getValueDotENV } = require("../general/getEnvironmentVariable");

const algorithm = "aes-256-cbc";
const secretKey = getValueDotENV("ENCRYPTION_KEY");

const key = crypto
  .createHash("sha512")
  .update(secretKey)
  .digest("hex")
  .substring(0, 32)

const decrypt = (encryptedText) => {
  const inputIV = encryptedText.slice(0, 32);
  const encrypted = encryptedText.slice(32);
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key),
    Buffer.from(inputIV, "hex"),
  );

  let decrypted = decipher.update(encrypted, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

module.exports = { decrypt };