Add-Type -AssemblyName System.Drawing
$file = "c:\Users\Hp\Desktop\e commerce\PLAY_STORE_SUBMISSION_KIT\Feature_Graphic.png"
$img = [System.Drawing.Image]::FromFile($file)
$newImg = New-Object System.Drawing.Bitmap(1024, 500)
$g = [System.Drawing.Graphics]::FromImage($newImg)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

# Draw the image cropped to the center 1024x500
$g.DrawImage($img, 0, -262, 1024, 1024)

$newImg.Save("c:\Users\Hp\Desktop\e commerce\PLAY_STORE_SUBMISSION_KIT\Feature_Graphic_Fixed.png", [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$newImg.Dispose()
$img.Dispose()

# Replace the original
Move-Item -Path "c:\Users\Hp\Desktop\e commerce\PLAY_STORE_SUBMISSION_KIT\Feature_Graphic_Fixed.png" -Destination $file -Force
