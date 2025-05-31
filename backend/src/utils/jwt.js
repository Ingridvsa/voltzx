import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export function gerarToken(payload) {
  return jwt.sign(payload, secret, { expiresIn: "30d" });
}

export function verificarToken(token) {
  return jwt.verify(token, secret);
}
