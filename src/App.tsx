import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import logo from "./assets/logo.png";
import "./App.css";

export default function App() {
  const [kayitlar, setKayitlar] = useState<any[]>(() => {
    const kayitliVeri = localStorage.getItem("binaTuruKayitlari");
    return kayitliVeri ? JSON.parse(kayitliVeri) : [];
  });

  const [form, setForm] = useState({
    bina: "",
    kat: "",
    bolum: "",
    kategori: "Yangın Güvenliği",
    not: "",
    fotograf: null as string | null,
  });

  useEffect(() => {
    localStorage.setItem("binaTuruKayitlari", JSON.stringify(kayitlar));
  }, [kayitlar]);

  function alanDegistir(e: any) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function fotografSec(e: any) {
    const dosya = e.target.files[0];
    if (!dosya) return;

    const okuyucu = new FileReader();
    okuyucu.onloadend = () => {
      setForm({ ...form, fotograf: okuyucu.result as string });
    };
    okuyucu.readAsDataURL(dosya);
  }

  function kayitEkle() {
    if (!form.bina || !form.kat || !form.bolum || !form.not) {
      alert("Bina, kat, bölüm ve not alanları zorunludur!");
      return;
    }

    const yeniKayit = {
      id: Date.now(),
      bina: form.bina,
      kat: form.kat,
      bolum: form.bolum,
      kategori: form.kategori,
      not: form.not,
      fotograf: form.fotograf,
      durum: "acik",
      tarih: new Date().toLocaleString("tr-TR"),
    };

    setKayitlar((oncekiKayitlar) => [yeniKayit, ...oncekiKayitlar]);

    setForm({
      bina: "",
      kat: "",
      bolum: "",
      kategori: "Yangın Güvenliği",
      not: "",
      fotograf: null,
    });
  }

  function kayitSil(id: number) {
    setKayitlar((oncekiKayitlar) =>
      oncekiKayitlar.filter((kayit) => kayit.id !== id)
    );
  }

  function kayitKapat(id: number) {
    setKayitlar((oncekiKayitlar) =>
      oncekiKayitlar.map((kayit) =>
        kayit.id === id ? { ...kayit, durum: "kapali" } : kayit
      )
    );
  }

  function excelIndir() {
    const veri = kayitlar.map((kayit) => ({
      Bina: kayit.bina,
      Kat: kayit.kat,
      Bölüm: kayit.bolum,
      Kategori: kayit.kategori,
      Durum: kayit.durum === "kapali" ? "Kapatıldı" : "Açık",
      Tespit: kayit.not,
      Tarih: kayit.tarih,
    }));

    const worksheet = XLSX.utils.json_to_sheet(veri);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Bina Turu");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "bina_turu_rapor.xlsx");
  }

  const acikSayisi = kayitlar.filter((kayit) => kayit.durum === "acik").length;
  const kapaliSayisi = kayitlar.filter((kayit) => kayit.durum === "kapali").length;

  return (
    <div className="container">
      <div className="baslik">
        <div className="baslikUst">
          <img src={logo} alt="Hastane logosu" className="logo" />
          <h1>Hastane Bina Turu</h1>
        </div>
        <h2>ESKİŞEHİR YUNUS EMRE DEVLET HASTANESİ</h2>
      </div>

      <button
  type="button"
  className="excelButonu"
  onClick={excelIndir}
>
  EXCEL RAPORU INDIR
</button>

      <div className="ozet">
        <div className="binaOzet">
          <p>
            <strong>ANA BİNA:</strong>{" "}
            {kayitlar.filter((k) => k.bina === "ANA BİNA").length}
          </p>
          <p>
            <strong>2 EYLÜL EK HİZMET BİNASI:</strong>{" "}
            {kayitlar.filter((k) => k.bina === "2 EYLÜL EK HİZMET BİNASI").length}
          </p>
          <p>
            <strong>ERİŞKİN ARINDIRMA MERKEZİ:</strong>{" "}
            {kayitlar.filter((k) => k.bina === "ERİŞKİN ARINDIRMA MERKEZİ").length}
          </p>
        </div>

        <div className="kutu">
          <p>📊</p>
          <p>Toplam</p>
          <h3>{kayitlar.length}</h3>
        </div>

        <div className="kutu kirmizi">
          <p>🔴</p>
          <p>Açık</p>
          <h3>{acikSayisi}</h3>
        </div>

        <div className="kutu yesil">
          <p>🟢</p>
          <p>Kapatılan</p>
          <h3>{kapaliSayisi}</h3>
        </div>
      </div>

      <div className="form">
        <select name="bina" value={form.bina} onChange={alanDegistir}>
          <option value="">Bina Seçiniz</option>
          <option>ANA BİNA</option>
          <option>2 EYLÜL EK HİZMET BİNASI</option>
          <option>ERİŞKİN ARINDIRMA MERKEZİ</option>
        </select>

        <select name="kat" value={form.kat} onChange={alanDegistir}>
          <option value="">Kat Seçiniz</option>
          <option>BODRUM KAT</option>
          <option>ALT ZEMİN KAT</option>
          <option>ZEMİN KAT</option>
          <option>1. KAT</option>
          <option>2. KAT</option>
          <option>3. KAT</option>
          <option>4. KAT</option>
          <option>5. KAT</option>
        </select>

        <input
          name="bolum"
          placeholder="Bölüm / Alan"
          value={form.bolum}
          onChange={alanDegistir}
        />

        <select name="kategori" value={form.kategori} onChange={alanDegistir}>
          <option>Yangın Güvenliği</option>
          <option>Elektrik</option>
          <option>Acil Çıkış</option>
          <option>Ergonomi</option>
          <option>Genel Düzen</option>
          <option>Diğer</option>
        </select>

        <textarea
          name="not"
          placeholder="Tespit..."
          value={form.not}
          onChange={alanDegistir}
        />

        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={fotografSec}
        />

        {form.fotograf && (
          <img src={form.fotograf} className="preview" alt="Ön izleme" />
        )}

<div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "15px" }}>
  <button onClick={kayitEkle}>
    Kaydı Ekle
  </button>

  <button
    type="button"
    onClick={excelIndir}
    style={{
      backgroundColor: "red",
      color: "white",
      padding: "12px 18px",
      fontWeight: "bold",
      border: "3px solid black"
    }}
  >
    EXCEL INDIR
  </button>
</div>
      </div>

      <div className="liste">
        {kayitlar.map((kayit) => (
          <div
            key={kayit.id}
            className={`kart ${kayit.durum === "kapali" ? "kapaliKart" : ""}`}
          >
            <b>
              {kayit.bina} - {kayit.kat} - {kayit.bolum}
            </b>

            <p>
              <strong>Durum:</strong>{" "}
              {kayit.durum === "kapali" ? "Kapatıldı" : "Açık"}
            </p>

            <p>
              <strong>Kategori:</strong> {kayit.kategori}
            </p>

            <p>
              <strong>Tespit:</strong> {kayit.not}
            </p>

            <small>{kayit.tarih}</small>

            {kayit.fotograf && (
              <img src={kayit.fotograf} alt="Tespit fotoğrafı" />
            )}

            {kayit.durum !== "kapali" && (
              <button onClick={() => kayitKapat(kayit.id)}>Kapat</button>
            )}

            <button onClick={() => kayitSil(kayit.id)}>Sil</button>
          </div>
        ))}
      </div>
    </div>
  );
}