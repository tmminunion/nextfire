import admin from "firebase-admin";

// Inisialisasi Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Mengganti \n dengan baris baru
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function POST(req) {
  const { token, topic } = await req.json(); // Ambil token dan topik dari body request

  if (!token || !topic) {
    return new Response(
      JSON.stringify({ message: "Token dan topic harus disediakan" }),
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
