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

// Mapping label bahasa Inggris -> Indonesia
const emotionTranslations: Record<string, string> = {
  joy: "Senang",
  trust: "Percaya",
  surprise: "Terkejut",
  neutral: "Netral",
  fear: "Takut",
  sadness: "Sedih",
  anger: "Marah",
  happy: "Senang",
  love: "Cinta",
  unknown: "Tidak diketahui",
};

type Komentar = {
  id: number;
  text: string;
  emotion?: string;
};

export default function Home() {
  const [komentar, setKomentar] = useState("");
  const [daftarKomentar, setDaftarKomentar] = useState<Komentar[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleKomentarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const wordCount = komentar.trim().split(/\s+/).length;

    if (komentar.trim() === "") {
      setError("Komentar tidak boleh kosong.");
      return;
    }

    if (wordCount > 12) {
      setError("Komentar tidak boleh lebih dari 12 kata.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://127.0.0.1:5001/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: komentar }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Terjadi kesalahan saat prediksi");
        return;
      }

      const originalEmotion = data.emotion || "unknown";
      const translatedEmotion =
        emotionTranslations[originalEmotion.toLowerCase()] || originalEmotion;

      setDaftarKomentar((prev) => [
        { id: Date.now(), text: komentar, emotion: translatedEmotion },
        ...prev,
      ]);

      setKomentar("");
    } catch (err: any) {
      setError("Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  const handleHapusKomentar = (id: number) => {
    setDaftarKomentar((prev) => prev.filter((komentar) => komentar.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center my-[10%] bg-white dark:bg-black">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Selamat Datang!</h1>
        <p className="text-xl font-medium">
          Silahkan Masukkan Komentar Anda Terkait Tunjangan Kinerja Dosen ASN!
        </p>
      </div>

      <form
        onSubmit={handleKomentarSubmit}
        className="w-full max-w-xl flex gap-2 mb-10"
      >
        <div className="w-full">
          <Input
            type="text"
            placeholder="Tulis komentar (maks. 12 kata)"
            className={`flex-1 ${wordCount > 12 ? "border-red-500" : ""}`}
            value={komentar}
            onChange={(e) => {
              const text = e.target.value;
              setKomentar(text);
              setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
            }}
            maxLength={250}
          />
          <p
            className={`text-sm mt-1 text-right ${
              wordCount > 12 ? "text-red-500 font-semibold" : "text-gray-500"
            }`}
          >
            {wordCount} / 12 kata
          </p>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Mendeteksi..." : "Deteksi"}
        </Button>
      </form>

      {error && (
        <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full max-w-6xl px-4 items-start">
        {daftarKomentar.map((komentar) => (
          <motion.div
            key={komentar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="@container/card">
              <CardHeader className="relative">
                <CardDescription>Komentar</CardDescription>
                <CardTitle className="text-lg">{komentar.text}</CardTitle>
                {komentar.emotion && (
                  <p className="text-sm mt-1 text-muted-foreground">
                    Emosi terdeteksi:{" "}
                    <strong className="capitalize">{komentar.emotion}</strong>
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
