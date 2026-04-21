param (
    [string]$sourceFile = "c:\Users\Hp\Desktop\e commerce\client\public\logo.png",
    [string]$destinationDir = "c:\Users\Hp\Desktop\e commerce\client\public\"
)

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
    
    $graphic.DrawImage($img, 0, 0, $Width, $Height)
    
    $thumbnail.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphic.Dispose()
    $thumbnail.Dispose()
    $img.Dispose()
}

write-host "Resizing to 192x192..."
Resize-Image -Path $sourceFile -Destination "$($destinationDir)logo-192.png" -Width 192 -Height 192

write-host "Resizing to 512x512..."
Resize-Image -Path $sourceFile -Destination "$($destinationDir)logo-512.png" -Width 512 -Height 512

write-host "Done."
