Add-Type -AssemblyName System.Drawing

$bmpPat = New-Object System.Drawing.Bitmap(160, 160, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gPat = [System.Drawing.Graphics]::FromImage($bmpPat)
$gPat.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Colors matching new brand palette: soft cream/gold lines on transparent
$penThick = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(210, 250, 246, 238), 2.0)
$penThin = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(140, 250, 246, 238), 1.0)
$penCaramel = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 216, 179, 133), 1.2)
$brushCaramel = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(210, 216, 179, 133))
$brushCream = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(220, 250, 246, 238))

function DrawLattice($ox, $oy) {
    # Diamond outer lines
    $gPat.DrawLine($penThick, [float]($ox + 40), [float]($oy + 0), [float]($ox + 80), [float]($oy + 40))
    $gPat.DrawLine($penThick, [float]($ox + 80), [float]($oy + 40), [float]($ox + 40), [float]($oy + 80))
    $gPat.DrawLine($penThick, [float]($ox + 40), [float]($oy + 80), [float]($ox + 0), [float]($oy + 40))
    $gPat.DrawLine($penThick, [float]($ox + 0), [float]($oy + 40), [float]($ox + 40), [float]($oy + 0))

    # Diamond inner lines
    $gPat.DrawLine($penThin, [float]($ox + 40), [float]($oy + 10), [float]($ox + 70), [float]($oy + 40))
    $gPat.DrawLine($penThin, [float]($ox + 70), [float]($oy + 40), [float]($ox + 40), [float]($oy + 70))
    $gPat.DrawLine($penThin, [float]($ox + 40), [float]($oy + 70), [float]($ox + 10), [float]($oy + 40))
    $gPat.DrawLine($penThin, [float]($ox + 10), [float]($oy + 40), [float]($ox + 40), [float]($oy + 10))

    # Caramel accent diamond
    $gPat.DrawLine($penCaramel, [float]($ox + 40), [float]($oy + 20), [float]($ox + 60), [float]($oy + 40))
    $gPat.DrawLine($penCaramel, [float]($ox + 60), [float]($oy + 40), [float]($ox + 40), [float]($oy + 60))
    $gPat.DrawLine($penCaramel, [float]($ox + 40), [float]($oy + 60), [float]($ox + 20), [float]($oy + 40))
    $gPat.DrawLine($penCaramel, [float]($ox + 20), [float]($oy + 40), [float]($ox + 40), [float]($oy + 20))

    # Center Rosette
    $gPat.FillEllipse($brushCaramel, [float]($ox + 37), [float]($oy + 37), 6.0, 6.0)
    
    # 4 Cross Petals
    $gPat.FillEllipse($brushCream, [float]($ox + 38.5), [float]($oy + 28), 3.0, 7.0)
    $gPat.FillEllipse($brushCream, [float]($ox + 38.5), [float]($oy + 45), 3.0, 7.0)
    $gPat.FillEllipse($brushCream, [float]($ox + 28), [float]($oy + 38.5), 7.0, 3.0)
    $gPat.FillEllipse($brushCream, [float]($ox + 45), [float]($oy + 38.5), 7.0, 3.0)

    # 4 Corner florets connecting at intersections
    $gPat.FillEllipse($brushCaramel, [float]($ox - 3), [float]($oy - 3), 6.0, 6.0)
    $gPat.FillEllipse($brushCaramel, [float]($ox + 77), [float]($oy - 3), 6.0, 6.0)
    $gPat.FillEllipse($brushCaramel, [float]($ox - 3), [float]($oy + 77), 6.0, 6.0)
    $gPat.FillEllipse($brushCaramel, [float]($ox + 77), [float]($oy + 77), 6.0, 6.0)
}

# 2x2 grid to tile across 160x160
DrawLattice 0 0
DrawLattice 80 0
DrawLattice 0 80
DrawLattice 80 80

$bmpPat.Save("c:\Users\Eng-Mohammed\Desktop\Production\Menu_CakeBoss\public\footerbg.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpPat.Dispose()
$gPat.Dispose()
Write-Host "footerbg.png generated cleanly."
