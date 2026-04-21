Add-Type -AssemblyName System.Drawing
$source = "c:\Users\Hp\Desktop\e commerce\client\public\logo.png"
$target = "c:\Users\Hp\Desktop\e commerce\PLAY_STORE_SUBMISSION_KIT\App_Icon_512.png"
$img = [System.Drawing.Image]::FromFile($source)
$newImg = New-Object System.Drawing.Bitmap(512, 512)
$g = [System.Drawing.Graphics]::FromImage($newImg)
$g.Clear([System.Drawing.Color]::White)
$g.DrawImage($img, 0, 0, 512, 512)
$newImg.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$newImg.Dispose()
$img.Dispose()
