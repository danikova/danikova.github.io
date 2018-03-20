
from PIL import Image
import json


picW = 160
picH = 284

def calculateHGap(width, px):
    picsW = []
    actPic = 0

    hgap = []
    actGap = 1
    for i in range(width):
        if px[i, 4] == (255, 255, 255):
            actGap += 1
            if actPic != 0:
                picsW.append(actPic)
            actPic = 0
        elif actGap != 0:
            hgap.append(actGap)
            actGap = 0
        else:
            actPic += 1

    hgap.append(actGap)
    return hgap, len(picsW)


def calculateVGap(height, px):
    picsW = []
    actPic = 0

    hgap = []
    actGap = 1
    for i in range(height):
        if px[3, i] == (255, 255, 255):
            actGap += 1
            if actPic != 0:
                picsW.append(actPic)
            actPic = 0
        elif actGap != 0:
            hgap.append(actGap)
            actGap = 0
        else:
            actPic += 1
    hgap.append(actGap)
    return hgap, len(picsW)


def main():
    im = Image.open('E:\Dokumentumok\danikovaGithubWebpage\TRX-workout\js\exercises\TRX_WO.png')
    width, height = im.size
    print(width, height)

    px = im.load()
    hgapArr, colCount = calculateHGap(width, px)
    vgapArr, rowCount = calculateVGap(height, px)

    emptyPics = 0
    exercises = [[None for i in range(colCount)] for i in range(rowCount)]

    sumHGap = 0
    for i, hgap in enumerate(hgapArr[:-1]):
        sumHGap += hgap
        sumVGap = 0
        for j, vgap in enumerate(vgapArr[:-1]):
            sumVGap += vgap
            croppedImg = im.crop((
                sumHGap+i*picW,
                sumVGap+j*picH,
                sumHGap+(i+1)*picW-1,
                sumVGap+(j+1)*picH-1
            ))
            pixelGrid = croppedImg.load()

            if pixelGrid[int(picW/3),int(picH/3)] == (255,255,255) and pixelGrid[int(picW/3*2),int(picH/3*2)] == (255,255,255):
                emptyPics += 1
                exercises[j][i] = None
            else:
                exercises[j][i] = '{0}_{1}.jpg'.format(i,j)

            croppedImg.save('./pics/{0}_{1}.jpg'.format(i,j))

    with open('E:\Dokumentumok\danikovaGithubWebpage\TRX-workout\js\exercises\exercises.json', 'w') as f:
        f.write(
            json.dumps({
                'colCount': colCount,
                'rowCount': rowCount,
                'exercisesArr': exercises
            }, indent='  ')
        )


if __name__ == '__main__':
    main()