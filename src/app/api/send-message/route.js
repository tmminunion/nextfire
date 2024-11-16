import admin from "firebase-admin";

// Inisialisasi Firebase Admin SDK
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("FIREBASE_PRIVATE_KEY tidak ditemukan");
  }

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey.replace(/\\n/g, "\n"), // Mengganti \n dengan baris baru
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function verifyIdToken(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch {
    throw new Error("Token tidak valid atau telah kadaluarsa.");
  }
}

// Fungsi untuk menambahkan CORS headers
function handleCors(res) {
  //  res.setHeader("Access-Control-Allow-Credentials", true);
  //   res.setHeader("Access-Control-Allow-Origin", "*"); // Atur origin sesuai kebutuhan
  //   res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  //   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Tangani preflight request OPTIONS
  if (res.method === "OPTIONS") {
    return res.status(204).end();
  }
}

export async function POST(req) {
  // Tangani CORS
  handleCors(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  // Ambil data dari body request
  const { topic, title, body, idToken } = await req.json();

  if (!topic || !title || !body || !idToken) {
    return new Response(
      JSON.stringify({ message: "Semua parameter harus disediakan" }),
      { status: 400 }
    );
  }

  try {
    // Membuat pesan untuk dikirimkan ke topik
    await verifyIdToken(idToken);
    const message = {
      notification: {
        title: title,
        body: body,
      },
      topic: topic, // Mengirim pesan ke topik
    };

    // Kirim pesan ke perangkat yang terdaftar di topik
    const response = await admin.messaging().send(message);

    return new Response(
      JSON.stringify({ message: "Pesan berhasil dikirim ke topik", response }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Gagal mengirim pesan ke topik:", error);
    return new Response(
      JSON.stringify({
        message: "Gagal mengirim pesan ke topik",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
