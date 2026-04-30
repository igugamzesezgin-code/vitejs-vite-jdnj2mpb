import logo from "./assets/logo.png";
import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [kayitlar, setKayitlar] = useState<any[]>(() => {
    const kayitliVeri = localStorage.getItem("binaTuruKayitlari");
    return kayitliVeri ? JSON.parse(kayitliVeri) : [];
  });

  useEffect(() => {
    localStorage.setItem("binaTuruKayitlari", JSON.stringify(kayitlar));
  }, [kayitlar]);

  const [form, setForm] = useState({
    bina: "",
    kat: "",
    bolum: "",
    kategori: "Yangın Güvenliği",
    not: "",
    fotograf: null as string | null,
  });

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
    if (!form.bina || !form.bolum || !form.not) {
      alert("Bina, bölüm ve not zorunludur!");
      return;
    }

    const yeniKayit = {
      id: Date.now(),
      ...form,
      durum: "acik",
      tarih: new Date().toLocaleString("tr-TR"),
    };

    setKayitlar([yeniKayit, ...kayitlar]);

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
    setKayitlar(kayitlar.filter((k) => k.id !== id));
  }

  function kayitKapat(id: number) {
    setKayitlar(
      kayitlar.map((k) =>
        k.id === id ? { ...k, durum: "kapali" } : k
      )
    );
  }

  const acikSayisi = kayitlar.filter((k) => k.durum === "acik").length;
  const kapaliSayisi = kayitlar.filter((k) => k.durum === "kapali").length;

  return (
    <div className="container">
      <div className="baslik">
      <div className="baslikUst">
  <img src={logo} alt="logo" className="logo" />
  <h1>Hastane Bina Turu</h1>
</div>
        <h2>ESKİŞEHİR YUNUS EMRE DEVLET HASTANESİ</h2>
      </div>

      <div className="ozet">
      <div className="binaOzet">
  <p><strong>ANA BİNA:</strong> {kayitlar.filter(k => k.bina === "ANA BİNA").length}</p>
  <p><strong>2 EYLÜL EK HİZMET BİNASI:</strong> {kayitlar.filter(k => k.bina === "2 EYLÜL EK HİZMET BİNASI").length}</p>
  <p><strong>ERİŞKİN ARINDIRMA MERKEZİ:</strong> {kayitlar.filter(k => k.bina === "ERİŞKİN ARINDIRMA MERKEZİ").length}</p>
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
        <input name="bolum" placeholder="Bölüm" value={form.bolum} onChange={alanDegistir} />

        <select name="kategori" value={form.kategori} onChange={alanDegistir}>
          <option>Yangın Güvenliği</option>
          <option>Elektrik</option>
          <option>Acil Çıkış</option>
          <option>Ergonomi</option>
        </select>

        <textarea name="not" placeholder="Tespit..." value={form.not} onChange={alanDegistir} />

        <input
  type="file"
  accept="image/*"
  capture="environment"
  onChange={fotografSec}
/>

        {form.fotograf && (
          <img src={form.fotograf} className="preview" alt="Ön izleme" />
        )}

        <button onClick={kayitEkle}>Kaydı Ekle</button>
      </div>

      <div className="liste">
        {kayitlar.map((k) => (
          <div key={k.id} className={`kart ${k.durum === "kapali" ? "kapaliKart" : ""}`}>
            <b>{k.bina} - {k.bolum}</b>
            <p><strong>Durum:</strong> {k.durum === "kapali" ? "Kapatıldı" : "Açık"}</p>
            <p><strong>Kategori:</strong> {k.kategori}</p>
<p><strong>Tespit:</strong> {k.not}</p>
<small>{k.tarih}</small>

            {k.fotograf && (
              <img src={k.fotograf} alt="Tespit fotoğrafı" />
            )}

            {k.durum !== "kapali" && (
              <button onClick={() => kayitKapat(k.id)}>Kapat</button>
            )}

            <button onClick={() => kayitSil(k.id)}>Sil</button>
          </div>
        ))}
      </div>
    </div>
  );
}