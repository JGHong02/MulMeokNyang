import shutil
import pandas as pd
from ultralytics import YOLO
import os

model = YOLO("yolo-Weights/yolov8x.pt")
model.to('cuda')
image_extensions = ['.jpg', '.jpeg', '.png', '.bmp']

# for now let's assume we only have one household
dir_path = './photosForAI/Cat/spaceId_123194564'
num_of_cats = len(next(os.walk(dir_path))[1])

for i in range(num_of_cats):
    path = dir_path + f'/catId_{i + 1}/photosForAI/'

    path_ = (dir_path + f'/catId_{i + 1}/predict')
    if os.path.exists(path_):
        shutil.rmtree(path_)
    
    imgs_list = [filename for filename in os.listdir(path) if os.path.splitext(filename)[-1] in image_extensions]
    
    for image in imgs_list:
        results = model.predict(path + image, show=False, save_txt=True, project=dir_path + f'/catId_{i + 1}', exist_ok=True, augment=True, classes=15)
        image_ = results[0].plot()
        print(results)
    
    #list all the files from the directory
    file_list = os.listdir(dir_path + f'/catId_{i + 1}/predict/labels/')

    df_concat = pd.concat([pd.read_csv(dir_path + f'/catId_{i + 1}/predict/labels/' + f, header=None, sep=' ', names=['class', 'x1', 'y1', 'x2', 'y2']) for f in file_list], ignore_index=True)
    df_concat['file_name'] = imgs_list

    df_concat.to_csv(dir_path + f'/catId_{i + 1}/predict/labels/Id_{i + 1}.csv', sep=' ', header=True, index=False)