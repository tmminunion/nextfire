import axios from "axios";

export async function GET() {
  try {
    // Panggil API eksternal
    const response = await axios.get(
      "https://api.bungtemin.net/FamgetAbsensi/absensiline/0"
    );

    // Ambil data dari response
    const data = response.data;

    // Kirimkan data sebagai response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ message: "Token dan topik harus disediakan" }),
      { status: 400 }
    );
  }
}
