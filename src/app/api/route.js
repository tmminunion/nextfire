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

// Fungsi untuk menambahkan CORS headers
function handleCors(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*"); // Atur origin sesuai kebutuhan
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Tangani preflight request OPTIONS
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }
}

export async function POST(req) {
  // Tambahkan CORS ke dalam response
  handleCors(req, {
    setHeader: (header, value) => (req.headers[header] = value),
  });

  // Lanjutkan ke logika jika bukan preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  const { token, topic } = await req.json(); // Ambil token dan topik dari body request

  if (!token || !topic) {
    return new Response(
      JSON.stringify({ message: "Token dan topik harus disediakan" }),
      { status: 400 }
    );
  }

  try {
    // Subscribe perangkat ke topik
    const response = await admin.messaging().subscribeToTopic([token], topic);
    return new Response(
      JSON.stringify({ message: "Berhasil subscribe ke topik", response }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Gagal subscribe ke topik:", error);
    return new Response(
      JSON.stringify({
        message: "Gagal subscribe ke topik",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
