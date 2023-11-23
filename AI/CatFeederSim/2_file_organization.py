import pandas as pd
import shutil
import os
import re

file_path = "./img/predict/labels/image0.txt"
img_file_path = "./img/predict/crops/cat/image"

# Read the text file into a DataFrame
df = pd.read_csv(file_path, sep=' ', header=None, names=['class', 'x1', 'y1', 'x2', 'y2', 'id'])  # Adjust column names accordingly

source_directory = "./img/predict/crops/cat/"
for filename in os.listdir(source_directory):
    # Get the breed from the filename using regular expression
    match = re.match("id_" + r'[0-9]+', filename)
    
    if match:
        shutil.rmtree(os.path.join(source_directory, match.string))

# Create folders for each 'id'
for i in range(1, int(df['id'].max()) + 1):
    os.makedirs(f"./img/predict/crops/cat/id_{i}", exist_ok=True)

# Rename the first image file if it exists
if os.path.exists(f"{img_file_path}0.jpg"):
    os.rename(f"{img_file_path}0.jpg", f"{img_file_path}01.jpg")

# Remove rows with NaN 'id' and corresponding image files
for index, row in df.iterrows():
    df.loc[index, 'file_number'] = index + 1
    if pd.isna(row['id']):
        file_number = index + 1
        print(f"Dropping index: {index}, shape[0] now: {df.shape[0]}")
        
        os.remove(f"{img_file_path}0{file_number}.jpg")
        print(f"Removed: {img_file_path}0{file_number}.jpg")

        df.drop(index, inplace=True)

# Move image files to corresponding 'id' folders
for index, row in df.iterrows():
    file_number = index + 1
    source_path = f"{img_file_path}0{file_number}.jpg"
    destination_path = f"img/predict/crops/cat/id_{int(row['id'])}"

    shutil.move(source_path, destination_path, copy_function=shutil.copytree)

#convert to an int
df = df.astype({'id': int, 'file_number': int})

# Create a dictionary of DataFrames
dfs = {f"df_{i}": df.loc[df['id'] == i].copy() for i in range(1, int(df['id'].max()) + 1)}

# Print the created DataFrames
for name, df_part in dfs.items():
    print(f"{name}:\n{df_part}\n")
    df_part.to_csv("./img/predict/labels/" + name + ".csv", sep=' ', header=True, index=False)

# Save the modified DataFrame to the file
df.to_csv(file_path, sep=' ', header=True, index=False)

### TODO!
# DONE 1. include file seperation to id_n in the loop.
# DONE 2. create [df_1, df_2, .. df_n] = df.copy to make dataframe for each cats. 
# DONE 3. color analyzation. maybe make an array to an img and get the average or just get the middle point of the img and save it to corresponding df_n. Final color of each id will be majority rules.
# DONE 4. apply those to cat_breed classification
# DONE 5. add color and breed features to corresponding dataframe
# 6. train test val split each cats.
# 7. train each id with custom model.

### Algorithm for Individual cat classification
# compare features of train and test(real-time data and user image)
# blabalbalbalba
