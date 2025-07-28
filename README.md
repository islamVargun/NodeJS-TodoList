Gelişmiş Full-Stack To-Do Uygulaması
Bu proje, modern web teknolojileri kullanılarak geliştirilmiş, kullanıcı dostu ve zengin özelliklere sahip bir To-Do (Yapılacaklar Listesi) uygulamasıdır. Kullanıcıların görevlerini verimli bir şekilde yönetmelerini sağlamak amacıyla tasarlanmıştır.

✨ Öne Çıkan Özellikler
Kullanıcı Kimlik Doğrulama: JWT (JSON Web Token) tabanlı güvenli kayıt (register) ve giriş (login) sistemi.

Görev Yönetimi (CRUD): Görev ekleme, okuma, güncelleme ve arşivleme işlemleri.

Sürükle ve Bırak: Görevleri hem genel listede hem de haftalık planlayıcıda sürükleyip bırakarak kolayca yeniden sıralama.

Haftalık Planlayıcı: Görevleri 7 günlük bir takvim panosunda görüntüleme ve yönetme.

Görev Detay Paneli: Her göreve tıklandığında açılan, görev adı ve açıklaması gibi detayların düzenlenebildiği yan panel.

Dinamik Arayüz: Framer Motion ile akıcı animasyonlar ve geçişler.

Duyarlı Tasarım: Mobil, tablet ve masaüstü cihazlarla tam uyumlu arayüz.

Açık & Koyu Tema: Kullanıcının tercihine göre değişen tema desteği.

Anlık Bildirimler: Başarılı veya hatalı işlemlerde kullanıcıyı bilgilendiren toast bildirimleri.

Ana Panel (Açık Tema)

Haftalık Planlayıcı (Koyu Tema)

🛠️ Kullanılan Teknolojiler
Bu proje, monorepo yapısında olup frontend ve backend olarak iki ana bölümden oluşmaktadır.

Frontend
Framework: Next.js

Kütüphane: React

Stil: Tailwind CSS

UI Bileşenleri: shadcn/ui

Animasyon: Framer Motion

Sürükle & Bırak: @dnd-kit

Tarih Yönetimi: date-fns

State Yönetimi: React Context API

Backend
Runtime: Node.js

Framework: Express.js

Veritabanı: MongoDB

ODM: Mongoose

Kimlik Doğrulama: JSON Web Token (JWT)

Şifreleme: bcrypt.js

Veri Doğrulama: express-validator

🚀 Kurulum ve Çalıştırma
Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

Gereksinimler
Node.js (v18 veya üstü)

MongoDB (Yerel veya Atlas gibi bir bulut servisi)

1. Projeyi Klonlama
git clone [https://github.com/kullanici-adiniz/proje-adiniz.git](https://github.com/kullanici-adiniz/proje-adiniz.git)
cd proje-adiniz

2. Backend Kurulumu
# Backend klasörüne gidin
cd backend

# Gerekli paketleri yükleyin
npm install

# .env dosyasını oluşturun
touch .env

Oluşturduğunuz .env dosyasının içine aşağıdaki değişkenleri kendi bilgilerinize göre doldurun:

# MongoDB bağlantı adresiniz
MONGO_URI=mongodb+srv://kullanici:sifre@cluster.mongodb.net/veritabani_adi

# JWT için gizli bir anahtar (rastgele bir dize olabilir)
JWT_SECRET=cokgizlibiranahtar

# Sunucunun çalışacağı port (isteğe bağlı)
PORT=3000

Backend sunucusunu başlatın:

npm start

3. Frontend Kurulumu
Yeni bir terminal açın ve projenin ana dizinindeyken:

# Frontend klasörüne gidin
cd frontend

# Gerekli paketleri yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

Artık tarayıcınızda http://localhost:3001 (veya Next.js'in başlattığı port) adresine giderek uygulamayı görüntüleyebilirsiniz.

📝 API Endpointleri
Metot

Rota

Açıklama

Erişim

POST

/api/auth/register

Yeni kullanıcı kaydı yapar.

Herkese Açık

POST

/api/auth/login

Kullanıcı girişi yapar ve token döndürür.

Herkese Açık

GET

/api/auth/user

Giriş yapmış kullanıcının bilgilerini getirir.

Özel

GET

/api/todos

Tüm görevleri listeler.

Özel

POST

/api/todos

Yeni bir görev ekler.

Özel

PATCH

`/api/todos





