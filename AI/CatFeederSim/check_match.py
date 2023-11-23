import pandas as pd
import os

image_extensions = ['.jpg', '.jpeg', '.png', '.bmp']

dir_path = './img/predict/crops/cat/'
num_of_cats = len(next(os.walk(dir_path))[1])

AI_dir_path = './photosForAI/Cat/spaceId_123194564/'
AI_num_of_cats = len(next(os.walk(AI_dir_path))[1])

for i in range(num_of_cats):
    # print(f'df_{i + 1}_new.csv')
    df_path = f'./img/predict/labels/df_{i + 1}_new.csv'
    df = pd.read_csv(df_path, header=0, sep=' ')
    breed = df.iloc[:, 8].value_counts().index[0]
    list1 = list(set(df.iloc[:, 3:8].value_counts().index[0]))
    sim = df.iloc[:, 9:11].mean()

    for j in range(AI_num_of_cats):
        # print(f'Id_{j + 1}.csv')
        df_path_ = f'./photosForAI/Cat/spaceId_123194564/catId_{j + 1}/predict/labels/Id_{j + 1}.csv'
        df_ = pd.read_csv(df_path_, header=0, sep=' ')
        breed_ = df_.iloc[:, 7].value_counts().index[0]
        list2 = list(set(df_.iloc[:, 2:7].value_counts().index[0]))
        matching_count = sum(value in list2 for value in list1)
        print(f"Number of matching color between df_{i + 1}, catId_{j + 1}: {matching_count}")
        print(f"Is breed matching?: {breed == breed_} \n")

    print(f"df_{i + 1} seems to be {sim.idxmax()} with a score of: {round(sim.max(), 2)} \n")
    print("--------------------------------------------------------------")