Add-Type -AssemblyName System.Drawing

function Resize-Image {
    param (
        [string]$Path,
        [string]$Destination,
        [int]$Width,
        [int]$Height
    )
    $img = [System.Drawing.Image]::FromFile($Path)
    $thumbnail = new-object System.Drawing.Bitmap($Width, $Height)
    $graphic = [System.Drawing.Graphics]::FromImage($thumbnail)
    
    $graphic.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphic.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphic.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphic.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    // Clear with white background for the icon
    $graphic.Clear([System.Drawing.Color]::White)
    $graphic.DrawImage($img, 0, 0, $Width, $Height)
    
    $thumbnail.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphic.Dispose()
    $thumbnail.Dispose()
    $img.Dispose()
}

$source = "c:\Users\Hp\Desktop\e commerce\client\public\logo.png"
$targetIcon = "c:\Users\Hp\Desktop\e commerce\PLAY_STORE_SUBMISSION_KIT\App_Icon_1024.png"

write-host "Resizing original logo to 1024x1024 for Play Store..."
Resize-Image -Path $source -Destination $targetIcon -Width 1024 -Height 1024
write-host "Success!"
