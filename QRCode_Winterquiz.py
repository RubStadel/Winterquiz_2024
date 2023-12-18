# QR Codes with segno
import segno

# Create open url
qrOpenURL = segno.make_qr("http://192.168.1.123/")
# Save the QR Code as pdf, png...
# dark means the color of the black squares,
# light means the color of the white squares
qrOpenURL.save("Winterquiz.pdf", border = 0, 
               dark = "black", light = "white")




