import axios from "axios";

export async function POST(request) {
  try {
    // Ambil body dari request
    const requestBody = await request.json();
    const { id, bus, additionalData } = requestBody; // Pastikan struktur data yang diterima sesuai

    // Panggil API eksternal menggunakan POST
    const response = await axios.post(
      `https://api.bungtemin.net/FamgetAbsensi/adminGetabsen/${id}/${bus}`,
      {
        // Data tambahan yang ingin dikirim
        additionalData,
      },
      {
        headers: {
          "Content-Type": "application/json", // Sesuaikan jika header API membutuhkan format lain
        },
      }
    );

    // Ambil data dari response
    const data = response.data;

    // Kirimkan data sebagai response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Tangani error jika terjadi
    return new Response(
      JSON.stringify({
        message: "Terjadi kesalahan saat mengirim data",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
