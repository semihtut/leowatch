# Threat Brief - Work Guidelines

Bu dosya, Threat Brief uygulaması için çalışma prensiplerini içerir.
**Her çalışma seansının başında bu dosyayı oku.**

---

## 1. Temel Kurallar

### Zaman Odağı
- **Bulunduğumuz tarihten 3 hafta geriye** bak
- Örnek: Bugün 24 Ocak 2026 ise → 3 Ocak 2026'dan itibaren ara
- Örnek: Bugün 15 Şubat 2026 ise → 25 Ocak 2026'dan itibaren ara
- "Ocak 2026" veya "January 2026" gibi sabit ay kullanma!
- Araştırma sorgusu: "cloud vulnerability critical [current month] 2026"
- Önemli olan **OLAYIN TARİHİ**, CVE numarası değil!
- CVE-2025-XXXXX olabilir, ama olay son 3 haftada gerçekleşmişse OK ✓

### Dil
- Tüm briefing içerikleri **İNGİLİZCE** olmalı
- Türkçe içerik YASAK

### Kaynak Atıfı
- Briefing içinde "According to Wiz", "According to Microsoft" gibi ifadeler KULLANMA
- Kaynaklar zaten `sources` bölümünde listeleniyor

### CVE Zorunluluğu
- CVE **zorunlu değil**
- Threat actor kampanyaları, misconfiguration'lar CVE olmadan da eklenebilir
- `"cves": []` kabul edilebilir

---

## 2. Briefing Sıralaması

**Olay tarihine göre sırala (en yeni en üstte)**

Sıralama kriteri:
1. Public disclosure tarihi
2. CISA deadline tarihi
3. En son önemli olay tarihi

**EKLENMİŞ TARİH DEĞİL, OLAYIN GERÇEKLEŞTİĞİ TARİH!**

---

## 3. Kaynak Gereksinimleri

- Minimum **10 kaynak** her briefing için
- Kaynak türleri dengeli olmalı:
  - Government (CISA, NVD)
  - Vendor Advisory
  - Research (Wiz, Mandiant, Unit42, etc.)
  - News (The Hacker News, BleepingComputer, etc.)

---

## 4. Briefing Yapısı

Her briefing şunları içermeli:
- `briefing_id`: TB-YYYY-MM-DD-NNN formatında
- `title`: Açıklayıcı, etkileyici başlık
- `severity`: Critical, High, Medium, Low
- `cves`: CVE listesi (boş olabilir)
- `tags`: İlgili etiketler
- `sources`: Minimum 10 kaynak
- `timeline`: Olayların kronolojik sırası
- `simple_summary`:
  - what_happened
  - who_is_affected
  - what_attackers_do (adım adım)
  - what_you_should_do (aksiyon listesi)
  - why_this_is_serious
- `mitre_attack`: İlgili MITRE ATT&CK teknikleri
- `detection_guidance`: Log kaynakları ve göstergeler
- `immediate_actions`: Öncelikli aksiyonlar

---

## 5. Günlük İş Akışı

1. Bu dosyayı oku
2. Mevcut briefing'leri kontrol et
3. 2026 yılındaki yeni cloud/security haberlerini araştır
4. Uygun bir vulnerability/threat bul
5. Briefing oluştur
6. Index dosyalarını güncelle (olay tarihine göre sırala)
7. Commit ve push yap

---

## 6. Odak Alanları

Öncelikli konular:
- Cloud security (AWS, Azure, GCP)
- Kubernetes vulnerabilities
- Container security
- AI/LLM framework security
- Supply chain attacks
- Zero-day exploits
- State-sponsored attacks (APT)
- Ransomware campaigns

---

## 7. Index Güncelleme

Her yeni briefing eklendiğinde:

### `/public/data/briefings/index.json`
- Yeni ID'yi **olay tarihine göre doğru sıraya** ekle

### `/public/data/index.json`
- `lastUpdated` güncelle
- `stats` güncelle (total, critical, high, cisaKev, totalSources)
- `featuredBriefing` en yeni olay olmalı
- `briefings` array'ine yeni briefing'i **olay tarihine göre** ekle

---

## 8. Commit Mesajı Formatı

```
Add [Vulnerability Name] briefing (TB-YYYY-MM-DD-NNN)

- CVE-XXXX-XXXXX (CVSS X.X)
- Key impact/detail
- X verified sources
- Updates stats: X briefings, X sources

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

---

**Son Güncelleme:** 2026-01-24
