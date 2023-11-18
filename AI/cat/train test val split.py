import pandas as pd
import os
import random
import shutil

data_path = "./img/data/"
file_path = "./img/predict/labels/image0.txt"
img_file_path = "./img/predict/crops/cat/"

train_folder = os.path.join(data_path, 'train')
val_folder = os.path.join(data_path, 'eval')
test_folder = os.path.join(data_path, 'test')

# Create destination folders if they don't exist
for folder_path in [train_folder, val_folder, test_folder]:
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

image_extensions = ['.jpg', '.jpeg', '.png', '.bmp']
imgs_list = [filename for filename in os.listdir(img_file_path) if os.path.splitext(filename)[-1] in image_extensions]

# Read the text file into a DataFrame
df = pd.read_csv(file_path, sep=' ', header=None, names=['class', 'x1', 'y1', 'x2', 'y2', 'id'], dtype={'id': int})  # Adjust column names accordingly
id_max = df['id'].max()

for i in range(id_max):
    for index, row in df.iterrows():
        if id['id'] == i:
            # make folder
            if not os.path.exists(img_file_path + "id_" + str(i)):
                os.makedirs(img_file_path + "id_" + str(i))
            
            continue