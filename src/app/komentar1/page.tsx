"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageCircleIcon } from "lucide-react";
import { motion } from "framer-motion";

type Komentar = {
  id: number;
  text: string;
  emotion?: string;
};

export default function Home() {
  const [komentar, setKomentar] = useState("");
  const [daftarKomentar, setDaftarKomentar] = useState<Komentar[]>([]);

  const deteksiEmosi = (teks: string): string => {
    const lower = teks.toLowerCase();
    if (lower.includes("marah") || lower.includes("kesal")) return "Anger";
    if (lower.includes("senang") || lower.includes("bagus")) return "Happy";
    if (lower.includes("sedih") || lower.includes("kecewa")) return "Sadness";
    if (lower.includes("sayang") || lower.includes("cinta")) return "Love";
    return "Neutral";
  };

  const handleKomentarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (komentar.trim() !== "") {
      const emotion = deteksiEmosi(komentar);
      setDaftarKomentar((prev) => [
        { id: Date.now(), text: komentar, emotion }, // 👈 Tambah ke atas
        ...prev,
      ]);
      setKomentar("");
    }
  };
  const handleHapusKomentar = (id: number) => {
    setDaftarKomentar((prev) => prev.filter((komentar) => komentar.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center my-[15%] bg-white dark:bg-black ">
      <div>
        <h1 className="text-3xl font-bold mb-8 text-center ">
          Selamat Datang!
        </h1>
        <p className="text-2xl font-bold mb-8 text-center">
          Silahkan Masukkan Komentar Anda Terkait Tunjangan Kinerja Dosen ASN!
        </p>
      </div>

      <form
        onSubmit={handleKomentarSubmit}
        className="w-full max-w-xl flex gap-2 mb-10"
      >
        <Input
          type="text"
          placeholder="Tulis komentar "
          className="flex-1"
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
        />
        <Button type="submit">Deteksi</Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full max-w-6xl px-4 items-start">
        {daftarKomentar.map((komentar) => (
          <motion.div
            key={komentar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Card className="@container/card">
              <CardHeader className="relative">
                <CardDescription>Komentar</CardDescription>
                <CardTitle className="text-lg">{komentar.text}</CardTitle>
                {komentar.emotion && (
                  <p className="text-sm mt-1 text-muted-foreground">
                    Emosi terdeteksi: <strong>{komentar.emotion}</strong>
                  </p>
                )}
                <div className="absolute right-4 top-4 text-muted-foreground">
                  <MessageCircleIcon className="size-4" />
                </div>
              </CardHeader>
              <CardFooter className="justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleHapusKomentar(komentar.id)}
                >
                  Hapus
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
