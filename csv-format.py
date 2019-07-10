#!/usr/bin/python3


lines = []

replacements = {
    '.': ' ',
    '/': ' '
}

with open("./parkinson.csv", "r") as f:
    lines = f.readlines()

head = lines[0]

newlines = []
for i in range( 1, len(lines) ):
    currentline = lines[i].strip()
    for key in replacements.keys():
        currentline = currentline.replace(key, replacements[key])
    currentline = currentline.lower().split(',')
    #lines[i] = currentline
    newlines.append(currentline)

first_column = list(map(lambda line: line[0], newlines))
# debugHelp = list(first_column)
newhead = 'formatted_name,'+head

with open("formatted-parkinson.csv", "w") as f:
    f.write(newhead)

    for line in range(len(first_column)):
        f.write(f'{first_column[line]},{lines[line+1]}')

