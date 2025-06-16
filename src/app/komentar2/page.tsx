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
import { MessageCircleIcon, CornerDownRightIcon } from "lucide-react";

type Komentar = {
  id: number;
  text: string;
  balasan: Komentar[];
};

export default function Komentar1() {
  const [komentar, setKomentar] = useState("");
  const [daftarKomentar, setDaftarKomentar] = useState<Komentar[]>([]);
  const [balasanInput, setBalasanInput] = useState<{ [key: number]: string }>(
    {}
  );
  const [balasanAktif, setBalasanAktif] = useState<number | null>(null);

  const handleKomentarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (komentar.trim() !== "") {
      setDaftarKomentar((prev) => [
        ...prev,
        { id: Date.now(), text: komentar, balasan: [] },
      ]);
      setKomentar("");
    }
  };

  const tambahBalasan = (
    list: Komentar[],
    id: number,
    balasText: string
  ): Komentar[] => {
    return list.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          balasan: [
            ...item.balasan,
            { id: Date.now(), text: balasText, balasan: [] },
          ],
        };
      } else if (item.balasan.length > 0) {
        return {
          ...item,
          balasan: tambahBalasan(item.balasan, id, balasText),
        };
      } else {
        return item;
      }
    });
  };

  const handleBalasSubmit = (id: number) => {
    const balasText = balasanInput[id];
    if (balasText?.trim()) {
      setDaftarKomentar((prev) => tambahBalasan(prev, id, balasText));
      setBalasanInput((prev) => ({ ...prev, [id]: "" }));
      setBalasanAktif(null); // tutup input setelah balas
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Tunjangan Kinerja Dosen
      </h1>

      <form
        onSubmit={handleKomentarSubmit}
        className="w-full max-w-xl flex gap-2 mb-10"
      >
        <Input
          type="text"
          placeholder="Tulis komentar kamu..."
          className="flex-1"
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
        />
        <Button type="submit">Deteksi</Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full max-w-6xl px-4 items-start">
        {daftarKomentar.map((komentar) => (
          <KomentarCard
            key={komentar.id}
            komentar={komentar}
            balasanInput={balasanInput}
            setBalasanInput={setBalasanInput}
            onBalas={handleBalasSubmit}
            balasanAktif={balasanAktif}
            setBalasanAktif={setBalasanAktif}
          />
        ))}
      </div>
    </div>
  );
}

function KomentarCard({
  komentar,
  balasanInput,
  setBalasanInput,
  onBalas,
  balasanAktif,
  setBalasanAktif,
}: {
  komentar: Komentar;
  balasanInput: { [key: number]: string };
  setBalasanInput: React.Dispatch<
    React.SetStateAction<{ [key: number]: string }>
  >;
  onBalas: (id: number) => void;
  balasanAktif: number | null;
  setBalasanAktif: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>Komentar</CardDescription>
        <CardTitle className="text-lg">{komentar.text}</CardTitle>
        <div className="absolute right-4 top-4 text-muted-foreground">
          <MessageCircleIcon className="size-4" />
        </div>
      </CardHeader>

      <CardFooter className="flex flex-col mt-[-10px] items-start  w-full text-sm">
        <Button
          variant="link"
          className="p-0 text-blue-600 dark:text-blue-400"
          onClick={() => setBalasanAktif(komentar.id)}
        >
          Balas
        </Button>

        {balasanAktif === komentar.id && (
          <div className="flex w-full gap-2">
            <Input
              placeholder="Tulis balasan..."
              className="flex-1"
              value={balasanInput[komentar.id] || ""}
              onChange={(e) =>
                setBalasanInput((prev) => ({
                  ...prev,
                  [komentar.id]: e.target.value,
                }))
              }
            />
            <Button onClick={() => onBalas(komentar.id)}>Kirim</Button>
          </div>
        )}

        {komentar.balasan.length > 0 && (
          <div className="space-y-3 w-full mt-3 border-l border-muted-foreground/20 pl-4">
            {komentar.balasan.map((balas) => (
              <BalasanItem
                key={balas.id}
                komentar={balas}
                balasanInput={balasanInput}
                setBalasanInput={setBalasanInput}
                onBalas={onBalas}
                balasanAktif={balasanAktif}
                setBalasanAktif={setBalasanAktif}
              />
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

function BalasanItem({
  komentar,
  balasanInput,
  setBalasanInput,
  onBalas,
  balasanAktif,
  setBalasanAktif,
}: {
  komentar: Komentar;
  balasanInput: { [key: number]: string };
  setBalasanInput: React.Dispatch<
    React.SetStateAction<{ [key: number]: string }>
  >;
  onBalas: (id: number) => void;
  balasanAktif: number | null;
  setBalasanAktif: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  return (
    <div className="text-sm flex flex-col gap-1">
      <div className="flex items-start gap-2 text-muted-foreground">
        <CornerDownRightIcon className="size-4 mt-1" />
        <span>{komentar.text}</span>
      </div>

      <Button
        variant="link"
        size="sm"
        className="text-blue-600 dark:text-blue-400 ml-2"
        onClick={() => setBalasanAktif(komentar.id)}
      >
        Balas
      </Button>
      {balasanAktif === komentar.id && (
        <div className="flex w-full gap-2 ml-6">
          <Input
            placeholder="Tulis balasan..."
            className="flex-1"
            value={balasanInput[komentar.id] || ""}
            onChange={(e) =>
              setBalasanInput((prev) => ({
                ...prev,
                [komentar.id]: e.target.value,
              }))
            }
          />
          <Button onClick={() => onBalas(komentar.id)}>Kirim</Button>
        </div>
      )}
      {komentar.balasan.length > 0 && (
        <div className="pl-6 border-l border-muted-foreground/20 mt-2 space-y-3">
          {komentar.balasan.map((balas) => (
            <BalasanItem
              key={balas.id}
              komentar={balas}
              balasanInput={balasanInput}
              setBalasanInput={setBalasanInput}
              onBalas={onBalas}
              balasanAktif={balasanAktif}
              setBalasanAktif={setBalasanAktif}
            />
          ))}
        </div>
      )}
    </div>
  );
}
