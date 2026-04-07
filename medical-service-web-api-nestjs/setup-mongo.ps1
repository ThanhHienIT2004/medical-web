$cfg = "E:\IT\App\bin\mongod.cfg"
$content = Get-Content $cfg -Raw
if ($content -notmatch 'replSetName') {
    Add-Content -Path $cfg -Value "`nreplication:`n  replSetName: `"rs0`""
}
Restart-Service -Name MongoDB
Start-Sleep -Seconds 3
mongosh --eval "rs.status().ok || rs.initiate({_id: 'rs0', members: [{_id: 0, host: '127.0.0.1:27017'}]})"
