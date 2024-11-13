// lib/cors.js
import Cors from "cors";

// Initialize the cors middleware
const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
  origin: "*", // Atur origin sesuai kebutuhan, bisa spesifik atau '*'
});

// Helper method to wait for middleware to execute before continuing
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default cors;
export { runMiddleware };
