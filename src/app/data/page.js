// Menambahkan "use client" directive untuk menandakan ini adalah Client Component
"use client";

import { useEffect, useState } from "react";
import { database, ref, onValue } from "../../lib/firebase";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Mendefinisikan path data yang ingin didengarkan
    const dataRef = ref(database, "dataUP");

    // Menggunakan onValue untuk mendengarkan perubahan data secara real-time
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const newData = snapshot.val(); // Mendapatkan data terbaru
      if (newData) {
        setData(newData); // Menyimpan data di state
        console.log(newData);

        // Menampilkan alert ketika data berubah
        alert("Data telah berubah!");
      }
    });

    // Cleanup listener saat komponen di-unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Real-time Data from Firebase</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
