from bluetooth import BluetoothSocket, BluetoothError, L2CAP
import sys

ADDRESS = '2C:10:C1:4D:E6:C9'

# Buttons
TWO='\x00\x01'
ONE='\x00\x02'
B='\x00\x04'
A='\x00\x08'
MINUS='\x00\x10'
HOME='\x00\x80'
LEFT='\x01\x00'
RIGHT='\x02\x00'
DOWN='\x04\x00'
UP='\x08\x00'
PLUS='\x10\x00'

fdout = BluetoothSocket(L2CAP)
fdout.connect((ADDRESS, 0x11))

fdin = BluetoothSocket(L2CAP)
fdin.connect((ADDRESS, 0x13))

#set Led01
fdin.send(b"\xa2\x11\x10")

loop = 1
while loop == 1:
        try:
            msg = fdin.recv(23)
            #print(msg)
            msg_bit = int.from_bytes(msg,'big')
            sys.stdout.write(str(msg_bit)+"\n")
            sys.stdout.flush()

        except BluetoothError:
            print("err")
            continue

fdin.close()
fdout.close()