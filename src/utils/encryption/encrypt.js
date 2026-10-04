const crypto = require("crypto");
const {getValueDotENV} = require("../general/getEnvironmentVariable");

const algorithm = "aes-256-cbc";
const secretKey = getValueDotENV("ENCRYPTION_KEY")

const iv = crypto.randomBytes(16)

const key = crypto
  .createHash("sha512")
  .update(secretKey)
  .digest("hex")
  .substring(0, 32)

const encrypt = (text) => {
  
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
  let encrypted = cipher.update(text, "utf-8", "hex")
  encrypted += cipher.final("hex")

  return iv.toString("hex") + encrypted

}

module.exports = { encrypt }