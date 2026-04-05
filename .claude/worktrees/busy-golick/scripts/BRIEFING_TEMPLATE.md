# Intelleo Briefing JSON Template

Claude Pro'ya bu prompt'u ver:

---

**PROMPT:**

Guncel (2026 yilinda gerceklesen) cloud security haberlerini arastir ve asagidaki JSON formatinda bir threat briefing olustur. Gercek kaynaklari kullan ve URL'leri dogru ver.

```json
{
  "briefing_id": "TB-2026-01-23-001",
  "title": "Vulnerability veya Threat Basligi",
  "generated_date": "2026-01-23",
  "status": "ACTIVE",
  "severity": {
    "level": "Critical|High|Medium|Low",
    "cvss": 9.8,
    "cisa_kev": false,
    "cisa_deadline": null
  },
  "cves": ["CVE-2026-XXXXX"],
  "tags": ["cloud", "aws", "azure", "gcp", "kubernetes", "container"],
  "affected_products": ["Product 1", "Product 2"],
  "sources_analyzed": 10,
  "sources": [
    {
      "name": "Kaynak Adi",
      "url": "https://gercek-url.com/makale",
      "date": "2026-01-20",
      "type": "Research|Vendor Advisory|Government|News"
    }
  ],
  "timeline": [
    {
      "date": "2026-01-15",
      "event": "Zafiyet kesefedildi"
    },
    {
      "date": "2026-01-18",
      "event": "Vendor patch yayinladi"
    }
  ],
  "simple_summary": {
    "what_happened": "Teknik olmayan bir dilde ne oldugunu acikla. Herkesin anlayacagi sekilde yaz.",
    "who_is_affected": "Hangi organizasyonlar, urunler veya sistemler etkileniyor?",
    "what_attackers_do": "Step 1: Saldirganlar ilk adimi atiyor. Step 2: Ikinci adim. Step 3: Ucuncu adim. Step 4: Dorduncu adim. Step 5: Son adim - tam kontrol.",
    "what_you_should_do": [
      "Ilk yapilmasi gereken",
      "Ikinci yapilmasi gereken",
      "Ucuncu yapilmasi gereken"
    ],
    "why_this_is_serious": "Bu neden ciddi bir tehdit? Is etkisi ne?"
  },
  "mitre_attack": {
    "tactics": [
      {
        "tactic": "Initial Access|Execution|Persistence|Privilege Escalation|Defense Evasion|Credential Access|Discovery|Lateral Movement|Collection|Exfiltration|Impact",
        "technique_id": "T1190",
        "technique_name": "Exploit Public-Facing Application",
        "description": "Bu teknik nasil kullaniliyor"
      }
    ]
  },
  "detection_guidance": {
    "summary": "Bu tehdidi tespit etmek icin genel yaklasim",
    "log_sources": [
      {
        "source": "Log Kaynagi Adi",
        "description": "Bu kaynak ne ise yarar",
        "priority": "Critical|High|Medium"
      }
    ],
    "what_to_look_for": [
      {
        "indicator": "Aranacak indikator",
        "description": "Bu indikator ne anlama geliyor",
        "log_field": "field='value'",
        "severity": "Critical|High|Medium"
      }
    ],
    "known_malicious_ips": []
  },
  "immediate_actions": [
    {
      "priority": 1,
      "action": "En acil eylem",
      "description": "Detayli aciklama",
      "command": "varsa CLI komutu veya null"
    },
    {
      "priority": 2,
      "action": "Ikinci eylem",
      "description": "Detayli aciklama",
      "command": null
    }
  ]
}
```

**ONEMLI KURALLAR:**
1. `what_attackers_do` alaninda "Step 1:", "Step 2:" formatini kullan
2. `briefing_id` formati: TB-YYYY-MM-DD-XXX (ornegin TB-2026-01-23-001)
3. Gercek URL'ler kullan - uydurma yapma
4. CVSS skoru 0-10 arasinda olmali
5. Tarihler YYYY-MM-DD formatinda olmali
6. `severity.level`: Critical, High, Medium, Low'dan biri
7. `sources.type`: Research, Vendor Advisory, Government, News'dan biri

---

## Scripti Kullanma

Claude Pro'dan JSON'u aldiktan sonra:

### Yontem 1: Dosyadan
```bash
# JSON'u bir dosyaya kaydet (ornegin: briefing.json)
npm run add-briefing ~/Downloads/briefing.json
# veya
node scripts/add-briefing.cjs ~/Downloads/briefing.json
```

### Yontem 2: Yapistirarak
```bash
npm run add-briefing:paste
# veya
node scripts/add-briefing.cjs --paste
# JSON'u yapistir
# Ctrl+D (Mac/Linux) veya Ctrl+Z (Windows) bas
```

Script otomatik olarak:
1. JSON'u validate eder
2. `public/data/briefings/` klasorune kaydeder
3. `index.json`'u gunceller
4. Git commit ve push yapmak isteyip istemedigini sorar
