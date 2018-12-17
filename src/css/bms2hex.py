import copy


# Return True if it is LongNote
def isLN(LNflag):
    return LNflag == "2"


# Convert decimal to 2byte hex data
def dec2hex_2byte(decimal_position):
    dec2hex_position = hex(decimal_position)[2:].upper()
    if dec2hex_position.startswith("X"):
        print(decimal_position)
    if decimal_position > 255:
        if len(dec2hex_position) == 3:
            hex_string_position = dec2hex_position[1:] + " 0" + dec2hex_position[0]
        elif len(dec2hex_position) > 3:
            hex_string_position = dec2hex_position[2:] + " " + dec2hex_position[0:2]
    else:
        if len(dec2hex_position[0:2]) < 2:
            hex_string_position = "0" + dec2hex_position[0:2] + " 00"
        else:
            hex_string_position = dec2hex_position[0:2] + " 00"

    return hex_string_position


# Convert decimal to 36 base number
def convert(n, base=36):
    T = "0123456789ABCDEFGHIJKLMNOPQRSTUWXYZ"
    q, r = divmod(n, base)
    if q == 0:
        return T[r]
    else:
        return convert(q, base) + T[r]


f = open("input.txt", "r") # Set your own bms data file
note_data = f.read()
note_line = note_data.split('\n')
sorted_note_line = copy.deepcopy(note_line[1:-1])
sorted_note_line = sorted(sorted_note_line, key=lambda x: int(x[4:11]))

track_dict = dict()
LNlist = []
output = open("output.txt", "w") # Set result file

for idx, i in enumerate(sorted_note_line[0:len(sorted_note_line)]):
    if i.startswith("BMSE"): continue
    if i in LNlist: continue
    result = ""
    track = i[0:3]
    if track == "008": continue
    if track not in track_dict:
        track_dict[track] = ""
    LNflag = i[3]
    decimal_position = int(i[4:11])
    keysound = convert(int(i[11:]))
    if len(keysound) < 2:
        keysound = "0" + keysound
    
    hex_string_position = dec2hex_2byte(decimal_position)

    if isLN(LNflag):
        # print(sorted_note_line[idx])
        ln_start_line = idx + 1
        while i[11:] != sorted_note_line[ln_start_line][11:] or i[0:3] != sorted_note_line[ln_start_line][0:3] or sorted_note_line[ln_start_line][3] != "2":
            # print("diff")
            ln_start_line += 1
        # print(sorted_note_line[ln_start_line])
        length = dec2hex_2byte(int(sorted_note_line[ln_start_line][4:11]) - decimal_position)
        LNlist.append(sorted_note_line[ln_start_line])
    else:
        length = dec2hex_2byte(6)

    print("Track :", track)
    print("Is LN? :", isLN(LNflag))
    print("Note Position :", decimal_position)
    print("Note Position in Hex:", hex_string_position)
    print("Key Sound :", keysound)
    print("Length in Hex:", length)
    result += hex_string_position + " 00 00 01 " + keysound + " 7F 40 00 " + length
    print(result)
    print()

    track_dict[track] += result + " "

# print(track_dict)
for k in track_dict.keys():
    output.write("Track #" + k + " length: " + hex(len(track_dict[k].replace(" ", "")) // 2) + "\n" + track_dict[k] + "\n")

# C0 00 00 00 01 08 7F 40 00 06 00

