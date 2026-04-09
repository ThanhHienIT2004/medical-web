## Mongo seed data (mongoimport)

Các file trong thư mục này là **Mongo Extended JSON** (có `{"$oid": "..."}`) và được format dạng **JSON Array** để import bằng `--jsonArray`.

### Import nhanh (PowerShell)

> Thay `<DB_NAME>` theo database của bạn.  
> Nếu bạn dùng connection string, thay `<MONGO_URI>` tương ứng.

```powershell
$uri = "mongodb://localhost:27017/medical_db?replicaSet=rs0"
$db  = "medical_db"

mongoimport --uri $uri --db $db --collection User              --jsonArray --file .\users.json
mongoimport --uri $uri --db $db --collection Patient           --jsonArray --file .\patients.json
mongoimport --uri $uri --db $db --collection Doctors           --jsonArray --file .\doctors.json
mongoimport --uri $uri --db $db --collection Medication        --jsonArray --file .\medications.json
mongoimport --uri $uri --db $db --collection Regimen           --jsonArray --file .\regimens.json
mongoimport --uri $uri --db $db --collection TreatmentPlan     --jsonArray --file .\treatment-plans.json
mongoimport --uri $uri --db $db --collection DoctorSchedule    --jsonArray --file .\doctor-schedules.json
mongoimport --uri $uri --db $db --collection AppointmentSlot   --jsonArray --file .\appointment-slots.json
mongoimport --uri $uri --db $db --collection Appointment       --jsonArray --file .\appointments.json
mongoimport --uri $uri --db $db --collection ExaminationReport --jsonArray --file .\examination-reports.json
mongoimport --uri $uri --db $db --collection Reminder          --jsonArray --file .\reminders.json
mongoimport --uri $uri --db $db --collection BlogPost          --jsonArray --file .\blog-posts.json
mongoimport --uri $uri --db $db --collection Document          --jsonArray --file .\documents.json
mongoimport --uri $uri --db $db --collection DashboardReport   --jsonArray --file .\dashboard-reports.json
```

### Ghi chú quan hệ

- `User._id` (ObjectId) được map vào field `id` trong Prisma. Trong Mongo thực tế là `_id`.
- `Patient._id` chính là `patient_id` (cùng ObjectId với `User._id`).
- `Doctors._id` chính là `id` (cùng ObjectId với `User._id`).

