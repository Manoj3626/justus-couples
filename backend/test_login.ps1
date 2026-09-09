$body = @{email='alex_test@justus.app'} | ConvertTo-Json
try {
    $res = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/dev-login' -Method POST -ContentType 'application/json' -Body $body
    Write-Output "SUCCESS: Token received"
    Write-Output "User: $($res.user.firstName) - $($res.user.email)"
} catch {
    Write-Output "FAILED: $_"
}
