import axios from "axios";

export async function GET(request, { params }) {
  const id = (await params).acara;
  const bus = (await params).bus;
  try {
    // Ambil parameter slug dari URL

    console.log(id, bus);
    // Panggil API eksternal menggunakan slug
    const response = await axios.get(
      `https://api.bungtemin.net/FamgetAbsensi/adminGetabsen/${id}/${bus}`
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
        message: "Terjadi kesalahan saat mengambil data",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
