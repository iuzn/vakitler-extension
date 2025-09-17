# Vakitler Extension

![Vakitler Extension Logo](public/banner.png)

Namaz vakitlerini gösteren pratik ve modern tarayıcı uzantısı. Güncel namaz vakitlerini, kalan süreyi ve şehir seçimi özelliklerini içerir.

## 🚀 Özellikler

- 🕌 **Namaz Vakitleri** - Güncel 5 vakit namaz saatleri
- ⏰ **Kalan Süre Göstergesi** - Sonraki vakte kalan zaman
- 📍 **Şehir Seçimi** - Ülke, şehir ve ilçe bazlı konum seçimi
- 🌓 **Karanlık Mod** - Sistem temasına göre otomatik tema desteği
- ⚡ **Hızlı Erişim** - Tarayıcı araç çubuğundan anında erişim
- 🔄 **Otomatik Güncelleme** - Vakit verilerinin otomatik yenilenmesi
- 📱 **Responsive Tasarım** - Tüm ekran boyutlarında mükemmel görünüm
- 🌙 **Hicri Tarih** - İsteğe bağlı hicri tarih gösterimi
- ⚙️ **Vakit Ayarları** - Kişisel vakit ayarları (+/- dakika)
- ✨ **İftar Vakitleri** - Sahur ve iftar vakitleri gösterimi
- 🌍 **Çok Dilli Destek** - Türkçe ve İngilizce dil desteği
- 🎨 **Modern UI** - Smooth animasyonlar ve motion efektleri

## 📦 Kurulum

1. Repository'yi klonlayın

2. Bağımlılıkları yükleyin

```bash
# Bun kullanarak (önerilen)
bun i

# Veya npm kullanarak
npm install
```

3. Geliştirme sunucusunu başlatın

```bash
bun dev
```

## 🛠️ Geliştirme

### Kullanılabilir Komutlar

- `bun dev` - HMR ile geliştirme sunucusunu başlat
- `bun build` - Üretim için derle
- `bun build:watch` - Değişiklikleri izleyerek derle
- `bun build:firefox` - Firefox için derle
- `bun dev:firefox` - Firefox geliştirme sunucusunu başlat
- `bun lint` - ESLint çalıştır
- `bun lint:fix` - ESLint sorunlarını düzelt
- `bun prettier` - Kodu formatla

## 🏗️ Üretim için Derleme

1. Uzantıyı derleyin:

```bash
bun build
```

2. Uzantıyı yükleyin:
   - Chrome/Firefox'u açın
   - Uzantılar sayfasına gidin (`chrome://extensions` veya `about:debugging`)
   - "Developer mode"u etkinleştirin
   - "Load unpacked" butonuna tıklayın ve `build` klasörünü seçin

## 📱 Kullanım

1. **İlk Kurulum**: Uzantıyı yükledikten sonra ikonuna tıklayın
2. **Şehir Seçimi**: Ülke, şehir ve ilçe seçin
3. **Vakit Takibi**: Otomatik olarak güncel vakitler gösterilir
4. **Kalan Süre**: Sonraki vakte kalan zaman badge'de görünür
5. **İftar/Sahur**: Ramadan ayında özel iftar ve sahur vakitleri gösterilir

## 🔧 Yapılandırma

### Manifest Yapılandırması

`manifest.js` dosyasını düzenleyerek uzantı ayarlarını özelleştirin:

- İzinler (permissions)
- İkonlar (icons)
- İçerik scriptleri (content scripts)
- Arka plan scriptleri (background scripts)

## 📂 Proje Yapısı

```
├── src/
│   ├── components/        # Yeniden kullanılabilir React bileşenleri
│   │   ├── vakitler/      # Vakitler uygulaması bileşenleri
│   │   └── ui/            # UI bileşenleri
│   ├── context/           # React context'ler
│   ├── hooks/             # Özel React hook'ları
│   ├── lib/               # Temel kütüphaneler ve yardımcılar
│   ├── models/            # Veri modelleri (Time, Times)
│   ├── pages/             # Uzantı giriş noktaları
│   │   ├── background/    # Arka plan scripti
│   │   └── popup/         # Popup sayfası
│   ├── shared/            # Paylaşılan bileşenler ve yardımcılar
│   │   └── storages/      # Depolama katmanı
│   ├── styles/            # Global stiller ve SCSS
│   └── types/             # TypeScript tip tanımları
├── public/                # Statik varlıklar ve ikonlar
├── utils/                 # Derleme araçları ve yardımcılar
└── build/                 # Derleme çıktı klasörü
```

## 🌟 Temel Bileşenler

### VakitlerStoreContext

Uygulamanın ana state yönetimini sağlar:

- Vakit verilerinin yönetimi
- Şehir seçimi ve ayarlar
- API entegrasyonu

### Time & Times Modelleri

Namaz vakitlerinin hesaplanması ve yönetimi:

- Güncel vakit hesaplama
- Kalan süre hesaplaması
- Vakit ayarları (+/- dakika)

### UI Bileşenleri

- **Layout**: Ana sayfa düzeni ve tema yönetimi
- **Location**: Şehir seçimi popover'ı
- **Summary**: Güncel vakit ve kalan süre gösterimi
- **TimeList**: Tüm vakitlerin listesi
- **CitySelection**: Ülke/şehir/ilçe seçimi



## 📝 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

### Ana Teknolojiler

- [Vite](https://vitejs.dev/) - Yeni nesil frontend araçları
- [React](https://reactjs.org/) - Kullanıcı arayüzleri için JavaScript kütüphanesi
- [TypeScript](https://www.typescriptlang.org/) - Tip güvenliği sağlayan JavaScript
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)

### İlham Kaynakları

- Vakitler web uygulaması - Orijinal namaz vakitleri uygulaması
- Modern tarayıcı uzantısı geliştirme pratikleri

---

**Not**: Bu uzantı, vakitler.app web uygulamasının bir tarayıcı uzantısı versiyonudur. Web uygulamasındaki tüm özellikler ve API entegrasyonları korunmuştur.
