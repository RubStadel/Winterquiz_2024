# QR Codes with segno

# Source of artistic segno:
# https://segno.readthedocs.io/en/latest/artistic-qrcodes.html
# Source of the Snowflake
# http://www.publicdomainfiles.com/show_file.php?id=13529242816467

import segno

# Create open url
qrOpenURL = segno.make_qr("http://141.64.203.44:3000/")

# Save in an "artistic" way
qrOpenURL.to_artistic(background="Snowflake.png", 
                   target="SnowflakeQR.png", scale=20, border = 0)

# =============================================================================
# # Save in a normal way
# qrOpenURL.save("Winterquiz.pdf", border = 0, 
#                 dark = "black", light = "white")
# =============================================================================

