# MASTER PROMPT — RESTOKO

## 1. IDENTITAS PRODUK

Buat aplikasi SaaS bernama **Restoko**.

Restoko adalah **Restaurant Management System berbasis SaaS / Restaurant Operating System** yang membantu restoran mengelola pelanggan, QR ordering, service point, order, kitchen, kasir, pembayaran, pemanggilan waiter, inventory, customer, employee, laporan, dan pengaturan restoran dalam satu sistem.

Restoko harus dibangun sebagai **multi-tenant SaaS dari awal**, bukan aplikasi single-restaurant yang nantinya diubah menjadi SaaS.

Target pengguna:

- Restoran
- Cafe
- Kedai
- Fast food
- Food court
- Rumah makan
- Restaurant multi-outlet
- Bisnis F&B lain yang menggunakan sistem pemesanan berbasis lokasi

Fokus pengembangan pertama adalah **MOBILE-FIRST**.

Desktop/web dashboard dapat dikembangkan kemudian, tetapi seluruh arsitektur backend, database, API, authentication, dan component system harus dibuat agar siap digunakan oleh mobile dan desktop.

---

# 2. PRINSIP UTAMA PRODUK

Restoko bukan sekadar aplikasi POS.

Konsep utama:

> **Satu order, satu alur data.**

Alur utama:

**QR Service Point → Customer Menu → Group Session → Order → Kitchen → Payment → Calling → Service → Inventory → Reporting**

Semua proses harus saling terhubung.

Contoh:

Customer scan QR di Meja 12.

Sistem mengetahui:

- Tenant
- Outlet
- Service Point
- Session

Customer memilih makanan.

Order masuk ke sistem.

Order otomatis masuk ke Kitchen Display.

Setelah makanan selesai, kitchen menekan READY.

Customer sebelumnya melakukan pembayaran melalui kasir.

Setelah order siap, sistem dapat memanggil:

> “Pesanan nomor 1024, lokasi Meja 12, silakan mengambil pesanan.”

Setelah diambil:

> PICKED UP

Semua data masuk ke laporan restoran.

---

# 3. MULTI-TENANCY

Restoko harus menggunakan arsitektur multi-tenant.

Setiap restoran adalah satu tenant.

Contoh:

Tenant A:
Bismillah Resto

Tenant B:
Kopi Senja

Tenant C:
Ayam Bakar Nusantara

Data setiap tenant harus terisolasi.

Tenant A tidak boleh melihat:

- menu Tenant B
- order Tenant B
- customer Tenant B
- employee Tenant B
- inventory Tenant B
- laporan Tenant B

Gunakan tenantId pada seluruh domain data yang relevan.

Buat tenant context yang konsisten di authentication, API, database query, storage, dan authorization.

Jangan mengandalkan frontend untuk membatasi akses tenant.

Validasi tenant harus dilakukan di server/backend.

---

# 4. ROLE

Minimal role:

## SaaS Super Admin

Mengelola platform Restoko:

- tenant
- subscription
- plan
- system configuration
- usage
- platform analytics
- support
- audit

## Restaurant Owner

Akses penuh terhadap restoran miliknya.

## Manager

Mengelola operasional restoran sesuai permission.

## Cashier

Mengelola:

- order
- payment
- receipt
- shift

## Waiter

Mengelola:

- service request
- customer assistance
- table/service point
- ready order

## Kitchen

Mengelola:

- kitchen order
- cooking
- ready status

## Inventory Staff

Mengelola:

- stock
- purchase
- supplier
- stock opname
- waste

Role harus menggunakan permission system.

Permission minimal:

- view
- create
- edit
- delete
- approve
- void
- refund
- discount
- manage

---

# 5. SERVICE POINT

Jangan mengunci sistem dengan konsep “Meja”.

Gunakan konsep generik:

> **Service Point**

Service Point adalah lokasi tempat customer melakukan ordering melalui QR.

Jenis Service Point dapat dikustomisasi oleh setiap restoran.

Contoh:

- Meja
- Pintu
- Booth
- Gazebo
- Counter
- VIP
- Lantai
- Area
- Kamar
- Custom

Restaurant dapat membuat jenis sendiri.

Contoh:

Type:
Pintu

Service Points:

- Pintu 1
- Pintu 2
- Pintu 3

Contoh lain:

Type:
Meja

Service Points:

- Meja 1
- Meja 2
- Meja 3

Nama display dapat dikustomisasi.

Contoh:

> VIP Keluarga

atau:

> Smoking Area 01

Service Point minimal memiliki:

- id
- tenantId
- outletId
- typeId
- internalCode
- displayName
- capacity
- area
- status
- qrCode
- activeSession

Status:

- AVAILABLE
- OCCUPIED
- BILLING
- DISABLED

---

# 6. QR CODE

Setiap Service Point memiliki QR Code unik.

QR Code bukan QRIS pembayaran.

QR Code digunakan untuk:

- membuka menu
- mengidentifikasi tenant
- mengidentifikasi outlet
- mengidentifikasi service point
- membuat/join session
- melakukan order
- memanggil waiter
- meminta bill
- melihat status order

Contoh:

QR → Restoko → Tenant → Outlet → Service Point → Session

QR tidak boleh hanya berupa URL umum.

Setiap QR harus terikat ke service point tertentu.

Fitur:

- preview QR
- download QR
- print QR
- regenerate QR
- deactivate QR
- QR status

---

# 7. CUSTOMER FLOW

Customer tidak wajib login.

Pengalaman harus:

**SCAN → MENU**

Tidak boleh memaksa customer:

- download aplikasi
- membuat akun
- login
- verifikasi email

Setelah scan:

Tampilkan:

Logo restoran

Nama restoran

Service Point

Contoh:

> Bismillah Resto  
> Meja 12

Kemudian:

> Selamat datang.

Menu:

- makanan
- minuman
- dessert
- kategori custom

---

# 8. MENU

Restaurant dapat mengelola menu.

Product memiliki:

- name
- description
- price
- image
- category
- SKU/code
- availability
- active status
- outlet availability

Menu harus mendukung foto makanan.

Customer melihat:

Foto makanan

Nama makanan

Deskripsi

Harga

Tombol tambah.

Foto harus dioptimalkan untuk mobile.

Gunakan image compression / optimized format jika memungkinkan.

---

# 9. PRODUCT MODIFIER

Produk dapat memiliki modifier.

Contoh:

Mie Goreng

Level pedas:

- tidak pedas
- sedang
- pedas
- extra pedas

Topping:

- telur +Rp5.000
- ayam +Rp8.000
- sosis +Rp7.000

Modifier harus mendukung:

- required / optional
- single choice / multiple choice
- price adjustment
- min selection
- max selection

---

# 10. BRANDING

Setiap tenant dapat mengustomisasi:

- nama restoran
- logo
- favicon
- warna utama
- warna sekunder
- cover image
- customer menu appearance

Customer interface harus mengikuti branding tenant.

Contoh:

Restoran A:

> Bismillah Resto

Restoran B:

> Kopi Senja

Masing-masing memiliki logo, warna, dan identitas sendiri.

Restoko adalah platform di belakang sistem, tetapi customer-facing interface dapat menggunakan branding restoran.

---

# 11. GROUP ORDER / SHARED SESSION

Satu QR harus bisa digunakan oleh banyak orang sekaligus.

Contoh:

Meja 2 ditempati 5 orang.

Kelima orang dapat scan QR yang sama.

Sistem membuat:

> Table/Service Point Session

Bukan membuat lima meja.

Session:

> SESSION #S1024  
> Service Point: Meja 2

Peserta:

- Guest 1
- Guest 2
- Guest 3
- Guest 4
- Guest 5

Setiap perangkat dapat bergabung ke session aktif.

Customer tidak wajib login.

Gunakan anonymous participant/session identity.

---

# 12. PERSONAL + SHARED ORDER

Sistem mendukung dua perspektif:

## Personal

Customer dapat melihat pesanannya sendiri.

## Shared

Customer dapat melihat total pesanan session.

Contoh:

Guest 1:

> Nasi Goreng — Rp25.000

Guest 2:

> Ayam Bakar — Rp30.000

Guest 3:

> Es Teh — Rp10.000

Total Session:

> Rp65.000

Setiap item order dapat memiliki participantId.

---

# 13. ORDER

Order memiliki:

- orderNumber
- tenantId
- outletId
- servicePointId
- sessionId
- customer/participant
- items
- subtotal
- discount
- tax
- service charge
- total
- status
- timestamps

Order status:

NEW

→ CONFIRMED

→ COOKING

→ READY

→ CALLED

→ PICKED_UP

→ COMPLETED

Payment status dipisahkan:

UNPAID

→ PAID

Jangan mencampur order status dengan payment status.

Contoh:

> Order: COOKING  
> Payment: PAID

---

# 14. CART

Customer dapat:

- add item
- remove item
- change quantity
- add modifier
- add notes
- view subtotal
- view total

Cart dapat digunakan sebagai shared cart atau personal cart sesuai konfigurasi.

---

# 15. SUBMIT ORDER

Jangan mengirim order ke kitchen ketika customer hanya menambahkan item ke cart.

Flow:

Cart

→ Review

→ Submit Order

→ Create Order

→ Kitchen

Setelah order dikirim, order baru masuk ke kitchen.

Customer tetap dapat melakukan:

> Tambah Pesanan

setelah order pertama dikirim.

Contoh:

ORDER #1024

kemudian:

ORDER #1025

Keduanya tetap berada dalam Session yang sama.

---

# 16. KITCHEN DISPLAY SYSTEM

Kitchen mendapatkan order secara realtime.

Tampilan:

NEW

COOKING

READY

Contoh:

> ORDER #1024  
> MEJA 12

- Nasi Goreng ×2
- Ayam Bakar ×1
- Es Teh ×2

Tombol:

START

READY

Kitchen dapat memiliki station:

- Grill
- Fry
- Beverage
- Dessert

Item dapat diarahkan ke station berdasarkan kategori/product configuration.

---

# 17. PAYMENT / CASHIER

Customer melakukan order.

Order masuk ke kasir.

Kasir melihat:

> Order #1024  
> Meja 12  
> Total Rp75.000  
> UNPAID

Payment method:

- Cash
- QRIS
- Debit
- Credit
- E-wallet
- Transfer

Untuk MVP, pembayaran dapat diproses secara manual oleh kasir.

Arsitektur harus disiapkan agar payment gateway dapat ditambahkan kemudian.

---

# 18. RECEIPT / STRUK

Buat fitur:

> Receipt Management

Restaurant dapat mengatur:

Header:

- logo
- restaurant name
- address
- phone

Transaction:

- transaction number
- order number
- date
- cashier
- service point
- customer

Footer:

- thank you message
- social media
- custom text
- QR

Pengaturan:

- show logo
- show cashier
- show service point
- show customer
- auto print

Format:

- 58mm
- 80mm
- A4

Receipt template harus configurable.

---

# 19. CALLING SYSTEM

Buat sistem panggilan terintegrasi.

Ketika kitchen selesai:

READY

Kemudian:

CALL

Customer-facing/public display dapat menampilkan:

> PESANAN SIAP

> #1024

> MEJA 12

Jika diperlukan gunakan voice announcement:

> “Pesanan nomor 1024, Meja 12, silakan mengambil pesanan.”

Dukung:

- call
- recall
- queue
- display
- voice
- configurable delay
- maximum repeat

---

# 20. WAITER SERVICE REQUEST

Customer dapat menggunakan QR yang sama untuk:

> Panggil Pelayan

> Minta Bill

> Tambah Pesanan

> Minta Bantuan

Service request harus memiliki:

- id
- tenant
- outlet
- servicePoint
- session
- participant
- type
- priority
- status
- assignedUser
- timestamps

Status:

PENDING

→ CLAIMED

→ IN_PROGRESS

→ COMPLETED

atau:

CANCELLED

---

# 21. ANTI-BENTROK WAITER

Jangan menggunakan notifikasi biasa tanpa queue.

Gunakan:

> Service Request Queue

Contoh:

Meja 12 → Panggil Pelayan

Meja 8 → Minta Bill

Meja 15 → Panggil Pelayan

Request masuk queue.

Waiter menekan:

> CLAIM

Request otomatis menjadi:

> ASSIGNED TO BUDI

Waiter lain tidak dapat mengambil request yang sama.

Gunakan locking/transaction-safe operation untuk mencegah race condition.

---

# 22. WAITER AREA

Restaurant dapat membuat area:

Area A
Area B
Area C

Waiter dapat ditugaskan ke area.

Contoh:

Area A → Budi

Area B → Ahmad

Area C → Rudi

Service request pertama kali diarahkan kepada waiter/area yang relevan.

Jika tidak ditangani dalam timeout tertentu:

> escalate

ke waiter lain atau supervisor.

---

# 23. ANTI-SPAM REQUEST

Jika customer menekan:

> Panggil Pelayan

berulang kali, jangan membuat banyak request.

Jika request masih aktif:

Tampilkan:

> Pelayan sedang menuju meja Anda.

Button menjadi disabled sementara.

Setelah request selesai, button aktif kembali.

---

# 24. REQUEST PRIORITY

Support:

URGENT

HIGH

NORMAL

LOW

Contoh:

Minta Bill → HIGH

Panggil Pelayan → NORMAL

Request tambahan → NORMAL

Urgent → URGENT

Queue harus dapat diurutkan berdasarkan:

1. priority
2. createdAt

---

# 25. CUSTOMER PAGE

Customer mobile interface minimal:

Header:

- logo
- restaurant name
- service point

Navigation:

- Menu
- Cart
- Orders
- Service

Menu:

- category
- product cards
- product images
- product details
- modifier

Service:

- Panggil Pelayan
- Minta Bill

Orders:

- active order
- status
- order history

Session:

- personal orders
- shared total

---

# 26. INVENTORY

Inventory harus terhubung dengan product/recipe.

Stock item:

- name
- SKU
- unit
- current stock
- minimum stock
- cost
- supplier

Stock movement:

- stock in
- stock out
- adjustment
- waste
- stock opname

---

# 27. RECIPE / BOM

Product dapat memiliki recipe.

Contoh:

Nasi Goreng:

- beras 200g
- telur 1
- minyak 20ml
- ayam 50g
- bumbu 15g

Ketika product terjual, inventory dapat dikurangi sesuai recipe.

Recipe harus dapat dikonfigurasi.

---

# 28. WASTE

Restaurant dapat mencatat:

- food waste
- damaged stock
- expired
- spilled
- production error

Data:

- item
- quantity
- reason
- cost
- user
- timestamp

Dashboard menampilkan total waste.

---

# 29. PURCHASING

Supplier:

- name
- contact
- address
- notes

Purchase Order:

- supplier
- items
- quantity
- cost
- status

Receiving:

Purchase Order

→ Received

→ Stock In

---

# 30. CUSTOMER MANAGEMENT

Customer dapat disimpan jika restoran memilih untuk mengidentifikasi customer.

Data:

- name
- phone
- email
- visit count
- total spending
- last visit
- loyalty

Jangan mewajibkan customer membuat akun untuk melakukan order.

---

# 31. LOYALTY

Siapkan fitur:

- points
- membership tier
- voucher
- reward
- transaction milestone

Contoh:

10 transaksi

→ voucher Rp25.000

---

# 32. EMPLOYEE

Data employee:

- name
- phone
- role
- outlet
- area
- status

Dukung:

- shift
- attendance
- service performance
- permission

---

# 33. TAX & SERVICE CHARGE

Restaurant dapat mengatur:

Tax

Service Charge

Discount

Rounding

Contoh:

Subtotal:
Rp100.000

Service charge 5%:
Rp5.000

Tax 10%:
Rp10.500

Total:
Rp115.500

Perhitungan harus konsisten dan server-side.

---

# 34. DASHBOARD OWNER

Dashboard mobile owner:

Today:

Revenue

Orders

Average Order Value

Food Cost

Waste

Outstanding Payment

Top Menu

Peak Hour

Contoh:

Revenue:
Rp12.850.000

Orders:
247

Average Order:
Rp52.024

Food Cost:
31.2%

Waste:
Rp350.000

---

# 35. MULTI-OUTLET

Satu tenant dapat memiliki banyak outlet.

Contoh:

Bismillah Resto:

Outlet Sumenep

Outlet Pamekasan

Outlet Bangkalan

Owner dapat melihat:

Total Revenue

Revenue per outlet

Orders per outlet

Food Cost per outlet

Waste per outlet

Top products

Performance

---

# 36. SETTINGS

Pengaturan harus menjadi pusat konfigurasi restoran.

Menu:

## Profil Restoran

- name
- logo
- address
- phone
- email
- operating hours
- timezone
- currency

## Branding

- logo
- colors
- favicon
- cover
- customer interface

## Outlet & Service Points

- outlet
- service point types
- service points
- QR

## Menu & Order

- order behavior
- modifier
- availability
- order rules

## Payment

- payment methods
- QRIS
- cash
- e-wallet
- gateway configuration

## Receipt

- receipt layout
- printer
- logo
- footer
- automatic print

## Confirmation & Notification

- notification
- WhatsApp
- order confirmation
- payment confirmation
- ready notification

## Calling

- voice
- display
- recall
- timeout
- repeat
- queue
- priority

## Kitchen

- kitchen stations
- KDS
- sound
- ticket
- timer

## Waiter

- waiter areas
- assignment
- fallback
- service request

## Customer

- customer identification
- loyalty
- feedback

## Employee & Permission

- roles
- permission
- access

## Inventory

- units
- minimum stock
- recipe
- waste
- stock opname

## Tax & Charges

- tax
- service
- rounding
- discount

## Printer & Device

- receipt printer
- kitchen printer
- kitchen display
- customer display

## Integrations

- Google Apps Script
- Google Drive
- WhatsApp provider
- payment gateway

## Subscription

- plan
- billing
- usage
- invoice

## Security

- session
- password
- authentication
- audit log

---

# 37. AUTOMATION CENTER

Buat konsep automation:

> WHEN → THEN → AND

Contoh:

WHEN order becomes READY

THEN:

- add to calling queue
- display order
- optionally voice announcement
- optionally send notification

Contoh:

WHEN payment becomes PAID

THEN:

- mark payment
- print receipt
- send confirmation
- update order/session

Contoh:

WHEN inventory < minimum

THEN:

- create low-stock alert
- notify inventory staff

Automation harus dirancang extensible.

---

# 38. NOTIFICATION & CONFIRMATION

Gunakan event-driven concept.

Events:

- ORDER_CREATED
- ORDER_CONFIRMED
- ORDER_COOKING
- ORDER_READY
- PAYMENT_SUCCESS
- PAYMENT_FAILED
- ORDER_COMPLETED
- SERVICE_REQUEST_CREATED
- STOCK_LOW

Actions:

- in-app notification
- WhatsApp
- display
- sound
- print

---

# 39. WHATSAPP TEMPLATE

Support template variable.

Contoh:

Halo {{customer_name}},

Pesanan {{order_number}} untuk {{service_point_name}} telah diterima.

Total: {{total}}

Terima kasih telah berkunjung ke {{restaurant_name}}.

Variable harus berasal dari server.

---

# 40. MEDIA STORAGE

Database:

**Neon PostgreSQL**

ORM:

**Prisma**

File storage:

**Google Drive**

Google Drive diakses melalui:

**Google Apps Script**

Arsitektur:

Application

→ API

→ Media Service

→ Google Apps Script

→ Google Drive

Database menyimpan metadata file, bukan file binary.

Media metadata minimal:

- id
- tenantId
- fileId
- fileName
- mimeType
- size
- URL/reference
- folder
- createdAt

---

# 41. GOOGLE DRIVE STRUCTURE

Gunakan struktur:

Restaurant SaaS

→ Tenant

→ Branding

→ Products

→ Receipts

→ Other Media

Contoh:

Tenant_001

Branding

Products

Receipts

Tenant_002

Branding

Products

Receipts

Setiap tenant harus mempunyai folder terpisah.

Media Service harus menjadi abstraction layer.

Jangan membuat seluruh aplikasi bergantung langsung pada Google Drive API.

---

# 42. DATABASE

Gunakan:

**PostgreSQL melalui Neon**

ORM:

**Prisma**

Database harus normalized dan modular.

Core entities minimal:

- Tenant
- TenantSettings
- Subscription
- Plan
- User
- Role
- Permission
- Outlet
- ServicePointType
- ServicePoint
- QRCode
- Session
- Participant
- Category
- Product
- ProductImage
- ModifierGroup
- Modifier
- Cart
- Order
- OrderItem
- Payment
- Receipt
- KitchenOrder
- KitchenStation
- ServiceRequest
- Employee
- Customer
- InventoryItem
- StockMovement
- Recipe
- RecipeItem
- Supplier
- PurchaseOrder
- PurchaseOrderItem
- Waste
- Tax
- Discount
- Notification
- NotificationTemplate
- Automation
- Media
- AuditLog

Relasi harus dirancang sebelum implementasi UI kompleks.

---

# 43. REALTIME

Fitur yang membutuhkan realtime:

- new order
- kitchen status
- ready order
- calling queue
- waiter request
- payment status
- shared session/cart
- service point status

Jangan melakukan polling agresif jika dapat menggunakan realtime/event mechanism yang lebih baik.

Shared session harus mampu melakukan synchronization antar perangkat.

---

# 44. MOBILE-FIRST UI

Prioritas:

1. Customer mobile
2. Staff mobile
3. Owner mobile
4. Desktop/web dashboard kemudian

Design principles:

- clean
- modern
- fast
- minimal
- touch-friendly
- responsive
- readable
- large buttons
- clear status
- minimal typing
- fast navigation

Customer harus dapat memesan dengan satu tangan menggunakan smartphone.

---

# 45. CUSTOMER MENU UX

Prioritaskan:

- foto makanan besar
- nama jelas
- harga jelas
- tombol tambah
- kategori mudah di-scroll
- sticky cart
- fast checkout

Jangan membuat halaman terlalu ramai.

---

# 46. ORDER STATUS UX

Customer harus dapat mengetahui:

Pesanan diterima

→ sedang dibuat

→ siap

→ selesai

Gunakan status visual yang mudah dipahami.

Contoh:

🟡 Diproses

🔥 Sedang dibuat

🟢 Siap

✅ Selesai

---

# 47. SERVICE POINT SESSION LOGIC

Ketika QR di-scan:

IF service point tidak memiliki active session:

CREATE SESSION

ELSE:

JOIN ACTIVE SESSION

Customer dapat memilih:

> Gabung pesanan

atau sistem otomatis bergabung berdasarkan konfigurasi tenant.

Session harus memiliki lifecycle:

OPEN

→ ACTIVE

→ BILLING

→ CLOSED

Session baru tidak boleh dibuat jika service point masih memiliki session aktif, kecuali manager melakukan override.

---

# 48. SESSION CLOSE

Session ditutup ketika:

- semua order selesai
- semua payment selesai
- tidak ada active service request
- customer/session selesai

Setelah CLOSE:

QR yang sama dapat membuat session baru.

---

# 49. CONCURRENCY

Sistem harus aman ketika banyak customer menggunakan QR yang sama.

Contoh:

5 HP scan secara bersamaan.

Jangan membuat 5 session.

Gunakan transaction/unique constraints/locking yang sesuai.

Harus ada satu active session untuk satu service point.

---

# 50. SECURITY

Wajib:

- authentication untuk staff
- authorization server-side
- tenant isolation
- input validation
- rate limiting
- audit log
- secure session
- secure API
- no sensitive secrets in client
- environment variables
- secure webhook validation
- server-side price validation

Customer anonymous session harus memiliki identifier yang aman dan tidak mudah ditebak.

---

# 51. PRICE SECURITY

Jangan menerima harga dari client sebagai sumber kebenaran.

Client hanya mengirim:

productId

quantity

modifierId

notes

Server mengambil harga dari database.

Server menghitung:

subtotal

discount

tax

service charge

total

---

# 52. AUDIT LOG

Catat aktivitas penting:

- login
- logout
- create order
- void
- refund
- discount
- payment
- price change
- product change
- stock adjustment
- user permission change
- settings change

Audit log harus menyimpan:

- actor
- action
- entity
- entityId
- timestamp
- metadata

---

# 53. SAAS SUBSCRIPTION

Restoko harus memiliki:

Plan

Subscription

Billing

Usage

Invoice

Minimal plan:

Starter

Professional

Business

Batasan plan dapat berupa:

- outlet
- user
- service point
- menu
- storage
- order volume
- feature availability

Subscription architecture harus extensible.

---

# 54. WHITE LABEL

Restoran dapat menggunakan branding sendiri.

Customer interface harus dapat tampil sebagai brand restoran.

Custom domain dapat menjadi fitur premium.

Contoh:

restoko.app/bismillah-resto

atau:

order.bismillahresto.com

---

# 55. SAAS ADMIN

Super Admin memiliki dashboard:

Total Tenants

Active Tenants

Trial

Expired

MRR

Orders Today

Active Outlets

Storage Usage

System Health

Super Admin dapat:

- melihat tenant
- suspend tenant
- activate tenant
- melihat subscription
- melihat usage
- melihat system logs

Jangan memberikan Super Admin akses operasional tenant tanpa permission/audit yang sesuai.

---

# 56. RESTAURANT ONBOARDING

Buat setup wizard.

Step 1:

Restaurant Name

Step 2:

Logo

Step 3:

Restaurant Type

Step 4:

Outlet

Step 5:

Service Point Type

Step 6:

Number of Service Points

Step 7:

Menu

Step 8:

QR generation

Step 9:

Finish

Contoh:

Restaurant:

Bismillah Resto

Outlet:

Sumenep

Service Point Type:

Meja

Quantity:

20

Sistem otomatis membuat:

Meja 01–20

dan QR masing-masing.

---

# 57. MVP

Jangan langsung membuat seluruh fitur.

MVP harus fokus pada core flow:

### Foundation

- authentication
- tenant
- user
- role
- outlet
- service point
- QR

### Customer

- QR landing
- menu
- product image
- product detail
- modifier
- cart
- group session
- order

### Restaurant

- cashier
- kitchen
- payment
- receipt
- calling
- waiter request

### Settings

- restaurant profile
- branding
- service point
- menu
- receipt
- notification
- calling

Setelah core flow stabil, baru:

Inventory

Recipe

Supplier

Employee

Customer

Loyalty

Advanced reports

Multi-outlet analytics

Subscription

Custom domain

---

# 58. DEVELOPMENT ORDER

Bangun dalam urutan:

PHASE 1

Database architecture

Prisma schema

Authentication

Tenant

RBAC

PHASE 2

Outlet

Service Point

QR

Customer Session

PHASE 3

Menu

Product

Image

Modifier

Cart

Group Order

PHASE 4

Order

Cashier

Payment

Receipt

PHASE 5

Kitchen

KDS

Calling

Waiter Service Queue

PHASE 6

Settings

Branding

Notification

Receipt

Calling

PHASE 7

Inventory

Recipe

Purchasing

Waste

PHASE 8

Customer

Employee

Reports

PHASE 9

SaaS

Subscription

Billing

Usage

Super Admin

---

# 59. IMPORTANT DEVELOPMENT RULES

Jangan:

- hard-code tenant
- hard-code restaurant name
- hard-code service point type
- hard-code table
- hard-code menu
- hard-code pricing
- hard-code role
- hard-code notification template
- hard-code receipt layout

Semua harus configurable.

Jangan membuat database single-tenant.

Jangan membuat QR global.

Jangan menyimpan file binary di PostgreSQL.

Jangan mempercayai harga dari client.

Jangan membuat customer wajib login.

Jangan membuat satu QR hanya dapat digunakan satu perangkat.

Jangan membuat service request tanpa queue/assignment.

Jangan mencampur payment status dan order status.

---

# 60. OUTPUT YANG DIHARAPKAN DARI AI CODING AGENT

Sebelum coding:

1. Analisis requirement.
2. Buat arsitektur sistem.
3. Buat ERD.
4. Buat Prisma schema.
5. Tentukan folder structure.
6. Tentukan API structure.
7. Tentukan authentication flow.
8. Tentukan tenant isolation strategy.
9. Tentukan session/order lifecycle.
10. Tentukan realtime architecture.

Setelah itu baru mulai implementasi secara bertahap.

Jangan membuat semua halaman sekaligus.

Setiap phase harus dapat dijalankan dan diuji sebelum lanjut.

---

# 61. QUALITY STANDARD

Kode harus:

- modular
- typed
- maintainable
- scalable
- secure
- testable
- reusable

Gunakan reusable components.

Pisahkan:

- UI
- business logic
- database
- API
- integrations
- services

Google Apps Script harus diperlakukan sebagai external integration service.

Prisma digunakan sebagai database ORM.

Neon digunakan sebagai PostgreSQL database.

---

# 62. TUJUAN AKHIR

Restoko harus memungkinkan restoran melakukan seluruh flow berikut:

Customer datang.

Customer melihat QR di Service Point.

Customer scan QR.

Restoko mengetahui:

Restaurant

Outlet

Service Point

Session

Customer memilih menu dengan foto.

Customer memilih modifier.

Beberapa orang dapat menggunakan QR yang sama.

Semua order terkumpul dalam satu session.

Customer mengirim order.

Kitchen menerima order.

Kitchen memasak.

Customer membayar di kasir.

Kasir menandai payment sebagai PAID.

Kitchen menandai order READY.

Calling System memanggil nomor order/service point.

Customer mengambil makanan.

Order menjadi PICKED UP.

Session dapat ditutup.

Inventory berkurang sesuai recipe.

Revenue masuk laporan.

Owner melihat hasil transaksi di dashboard.

Seluruh proses tersebut terjadi dalam satu sistem.

---

# 63. PRODUCT VISION

Restoko harus diposisikan sebagai:

> **Operating System untuk restoran.**

Bukan hanya:

> POS.

Bukan hanya:

> QR Menu.

Bukan hanya:

> Kitchen Display.

Bukan hanya:

> Aplikasi kasir.

Tetapi satu platform yang menghubungkan:

**Customer → QR → Order → Kitchen → Cashier → Payment → Calling → Waiter → Inventory → Business Intelligence**

dengan arsitektur:

**Multi-Tenant SaaS + Mobile First + Configurable + Extensible.**

Mulai pembangunan dari **database dan core architecture**, kemudian implementasikan MVP berdasarkan development order di atas.