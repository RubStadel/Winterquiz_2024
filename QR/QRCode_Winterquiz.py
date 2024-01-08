# QR Codes with segno

# Source of artistic segno:
# https://segno.readthedocs.io/en/latest/artistic-qrcodes.html
# Source of the Snowflake
# http://www.publicdomainfiles.com/show_file.php?id=13529242816467

import segno

# Create open url
# qrOpenURL = segno.make_qr("http://141.64.203.44:3000/")
qrOpenURL = segno.make_qr("http://141.64.205.170:3000/")

# Save in an "artistic" way
qrOpenURL.to_artistic(background="QR/Snowflake_Square.png", 
                   target="QR/SnowflakeQR.png", scale=40, border = 0)

# =============================================================================
# Save in a normal way
qrOpenURL.save("QR/Winterquiz.png", border = 0, 
                scale = 40)
# =============================================================================

qrOpenHRZ = segno.make_qr("https://doku.bht-berlin.de/zugang/wlan")
qrOpenHRZ.save("QR/HRZ.png", border = 0, 
                scale = 25)