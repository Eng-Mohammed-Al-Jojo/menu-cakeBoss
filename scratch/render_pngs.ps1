Add-Type -AssemblyName System.Drawing

# 1. Render public/logo.png (512x512)
$bmpLogo = New-Object System.Drawing.Bitmap(512, 512, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gLogo = [System.Drawing.Graphics]::FromImage($bmpLogo)
$gLogo.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gLogo.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$gLogo.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Background dark olive circle (Pantone P 164-11 C deep olive variant)
$brushBg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.PointF(100, 50)),
    (New-Object System.Drawing.PointF(400, 450)),
    [System.Drawing.ColorTranslator]::FromHtml("#4E5B3D"),
    [System.Drawing.ColorTranslator]::FromHtml("#36402A")
)
$gLogo.FillEllipse($brushBg, 12, 12, 488, 488)

# Gold/Caramel outer thin rings (Pantone P 29-9 C)
$penGold1 = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#C7A57E"), 2.2)
$gLogo.DrawEllipse($penGold1, 26, 26, 460, 460)

$penGold2 = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#A5835C"), 1.2)
$penGold2.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
$gLogo.DrawEllipse($penGold2, 38, 38, 436, 436)

# Swirl flourish above CAKE (Cream color)
$penSwirl = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#FAF6EE"), 3.2)
$penSwirl.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$penSwirl.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

# Elegant swirl path matching Page 2
$ptsSwirl1 = [System.Drawing.PointF[]]@(
    (New-Object System.Drawing.PointF(245, 142)),
    (New-Object System.Drawing.PointF(230, 115)),
    (New-Object System.Drawing.PointF(240, 85)),
    (New-Object System.Drawing.PointF(270, 80)),
    (New-Object System.Drawing.PointF(285, 105)),
    (New-Object System.Drawing.PointF(265, 125)),
    (New-Object System.Drawing.PointF(250, 115)),
    (New-Object System.Drawing.PointF(255, 102)),
    (New-Object System.Drawing.PointF(268, 106))
)
$gLogo.DrawCurve($penSwirl, $ptsSwirl1, 0.55)

$ptsSwirl2 = [System.Drawing.PointF[]]@(
    (New-Object System.Drawing.PointF(245, 142)),
    (New-Object System.Drawing.PointF(265, 155)),
    (New-Object System.Drawing.PointF(295, 145)),
    (New-Object System.Drawing.PointF(310, 165)),
    (New-Object System.Drawing.PointF(285, 185)),
    (New-Object System.Drawing.PointF(260, 178))
)
$penSwirl2 = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#FAF6EE"), 2.2)
$gLogo.DrawCurve($penSwirl2, $ptsSwirl2, 0.5)

# Fonts
$fontNames = @("Playfair Display", "Georgia", "Times New Roman")
$titleFont = $null
foreach ($fn in $fontNames) {
    try {
        $testFont = New-Object System.Drawing.Font($fn, 70, [System.Drawing.FontStyle]::Bold)
        if ($testFont.Name -eq $fn -or $fn -eq "Georgia") {
            $titleFont = $testFont
            break
        }
    } catch {}
}
if ($null -eq $titleFont) {
    $titleFont = New-Object System.Drawing.Font("Georgia", 70, [System.Drawing.FontStyle]::Bold)
}

$subFont = New-Object System.Drawing.Font("Georgia", 16, [System.Drawing.FontStyle]::Bold)
$regFont = New-Object System.Drawing.Font("Georgia", 12, [System.Drawing.FontStyle]::Regular)

$brushWhite = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#FAF6EE"))
$brushGold = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#D8B385"))

# StringFormat centered
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

# Draw registered mark using unicode
$regChar = [char]0x00AE
$gLogo.DrawString($regChar.ToString(), $regFont, $brushWhite, (New-Object System.Drawing.PointF(145, 185)))

# Draw CAKE
$gLogo.DrawString("CAKE", $titleFont, $brushWhite, (New-Object System.Drawing.RectangleF(0, 195, 512, 80)), $sf)

# Draw BOSS
$gLogo.DrawString("BOSS", $titleFont, $brushWhite, (New-Object System.Drawing.RectangleF(0, 272, 512, 80)), $sf)

# Draw CAKE & MORE
$sfSub = New-Object System.Drawing.StringFormat
$sfSub.Alignment = [System.Drawing.StringAlignment]::Center
$gLogo.DrawString("C A K E   &   M O R E", $subFont, $brushGold, (New-Object System.Drawing.RectangleF(0, 360, 512, 35)), $sfSub)

# Accent line under subtitle
$penSubLine = New-Object System.Drawing.Pen([System.Drawing.ColorTranslator]::FromHtml("#D8B385"), 1.5)
$gLogo.DrawLine($penSubLine, 195, 392, 317, 392)

$bmpLogo.Save("c:\Users\Eng-Mohammed\Desktop\Production\Menu_CakeBoss\public\logo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpLogo.Dispose()
$gLogo.Dispose()

Write-Host "logo.png generated."

# 2. Render public/footerbg.png (200x200 seamless tile)
$bmpPat = New-Object System.Drawing.Bitmap(200, 200, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gPat = [System.Drawing.Graphics]::FromImage($bmpPat)
$gPat.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

# Transparent background with geometric lattice (cream/olive tone)
$penLatticeThick = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 250, 246, 238), 2.0)
$penLatticeThin = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, 250, 246, 238), 1.2)
$penCaramel = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(160, 216, 179, 133), 1.2)
$brushCaramel = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 216, 179, 133))
$brushWhiteSmall = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 250, 246, 238))

function DrawLatticeTile([float]$ox, [float]$oy) {
    $ptsOuter = [System.Drawing.PointF[]]@(
        (New-Object System.Drawing.PointF($ox + 50, $oy + 0)),
        (New-Object System.Drawing.PointF($ox + 100, $oy + 50)),
        (New-Object System.Drawing.PointF($ox + 50, $oy + 100)),
        (New-Object System.Drawing.PointF($ox + 0, $oy + 50))
    )
    $gPat.DrawPolygon($penLatticeThick, $ptsOuter)

    $ptsInner = [System.Drawing.PointF[]]@(
        (New-Object System.Drawing.PointF($ox + 50, $oy + 12)),
        (New-Object System.Drawing.PointF($ox + 88, $oy + 50)),
        (New-Object System.Drawing.PointF($ox + 50, $oy + 88)),
        (New-Object System.Drawing.PointF($ox + 12, $oy + 50))
    )
    $gPat.DrawPolygon($penLatticeThin, $ptsInner)

    $ptsAccent = [System.Drawing.PointF[]]@(
        (New-Object System.Drawing.PointF($ox + 50, $oy + 24)),
        (New-Object System.Drawing.PointF($ox + 76, $oy + 50)),
        (New-Object System.Drawing.PointF($ox + 50, $oy + 76)),
        (New-Object System.Drawing.PointF($ox + 24, $oy + 50))
    )
    $gPat.DrawPolygon($penCaramel, $ptsAccent)

    # Center Rosette
    $gPat.FillEllipse($brushCaramel, [float]($ox + 46), [float]($oy + 46), [float]8, [float]8)
    
    # 4 Rosette cross petals
    $gPat.FillEllipse($brushWhiteSmall, [float]($ox + 48), [float]($oy + 36), [float]4, [float]8)
    $gPat.FillEllipse($brushWhiteSmall, [float]($ox + 48), [float]($oy + 56), [float]4, [float]8)
    $gPat.FillEllipse($brushWhiteSmall, [float]($ox + 36), [float]($oy + 48), [float]8, [float]4)
    $gPat.FillEllipse($brushWhiteSmall, [float]($ox + 56), [float]($oy + 48), [float]8, [float]4)

    # Diagonal dots
    $gPat.FillEllipse($brushCaramel, [float]($ox + 41), [float]($oy + 41), [float]4, [float]4)
    $gPat.FillEllipse($brushCaramel, [float]($ox + 55), [float]($oy + 41), [float]4, [float]4)
    $gPat.FillEllipse($brushCaramel, [float]($ox + 41), [float]($oy + 55), [float]4, [float]4)
    $gPat.FillEllipse($brushCaramel, [float]($ox + 55), [float]($oy + 55), [float]4, [float]4)

    # Corner rosette dots
    $gPat.FillEllipse($brushCaramel, [float]($ox - 3), [float]($oy - 3), [float]6, [float]6)
}

DrawLatticeTile 0 0
DrawLatticeTile 100 0
DrawLatticeTile 0 100
DrawLatticeTile 100 100

$bmpPat.Save("c:\Users\Eng-Mohammed\Desktop\Production\Menu_CakeBoss\public\footerbg.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpPat.Dispose()
$gPat.Dispose()

Write-Host "footerbg.png generated."
