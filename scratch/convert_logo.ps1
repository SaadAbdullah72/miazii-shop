Add-Type -AssemblyName System.Drawing
$image = [System.Drawing.Image]::FromFile('c:\Users\Hp\Desktop\e commerce\client\public\logo.png')
$bitmap = New-Object System.Drawing.Bitmap($image.Width, $image.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.DrawImage($image, 0, 0, $image.Width, $image.Height)
$bitmap.Save('c:\Users\Hp\Desktop\e commerce\client\public\logo_converted.png', [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()
$image.Dispose()
Move-Item -Force 'c:\Users\Hp\Desktop\e commerce\client\public\logo_converted.png' 'c:\Users\Hp\Desktop\e commerce\client\public\logo.png'
