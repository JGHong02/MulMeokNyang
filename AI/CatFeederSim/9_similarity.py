import os
import numpy as np 
import pandas as pd 
from PIL import Image
from tensorflow import keras
from keras.preprocessing import image

from keras.applications.vgg16 import VGG16
from sklearn.metrics.pairwise import cosine_similarity

vgg16 = VGG16(weights='imagenet', include_top=False, 
              pooling='max', input_shape=(224, 224, 3))

# print the summary of the model's architecture.
# vgg16.summary()

for model_layer in vgg16.layers:
    model_layer.trainable = False

def load_image(image_path):
    input_image = Image.open(image_path)
    resized_image = input_image.resize((224, 224))

    return resized_image

def get_image_embeddings(object_image : image):

    image_array = np.expand_dims(image.img_to_array(object_image), axis = 0)
    image_embedding = vgg16.predict(image_array)

    return image_embedding

def get_similarity_score(first_image : str, second_image : str):
    first_image = load_image(first_image)
    second_image = load_image(second_image)

    first_image_vector = get_image_embeddings(first_image)
    second_image_vector = get_image_embeddings(second_image)
    
    similarity_score = cosine_similarity(first_image_vector, second_image_vector).reshape(1,)

    return similarity_score

if __name__ == '__main__':
    dir_path = './img/predict/crops/cat/'
    num_of_cats = len(next(os.walk(dir_path))[1])
    image_extensions = ['.jpg', '.jpeg', '.png', '.bmp']

    AI_dir_path = './photosForAI/Cat/spaceId_123194564/'
    AI_num_of_cats = len(next(os.walk(AI_dir_path))[1])    

    for i in range(num_of_cats):
        path = dir_path + f'id_{i+1}'
        df_path = f'./img/predict/labels/df_{i+1}_new.csv'
        df = pd.read_csv(df_path, header=0, sep=' ')
        imgs_list = [filename for filename in os.listdir(path) if os.path.splitext(filename)[-1] in image_extensions]
        
        for j in range(AI_num_of_cats):
            path_ = AI_dir_path + f'catId_{j + 1}/photosForAI'
            AI_img = [filename for filename in os.listdir(path_) if os.path.splitext(filename)[-1] in image_extensions][0]

            print(f"local id_{i+1}, cloud id_{j+1}")
            score_list = []
            
            for k in imgs_list:
                local = path + '/' + k
                cloud = path_ + '/' + AI_img

                similarity_score = get_similarity_score(local, cloud)
                print(similarity_score)
                score_list.append(similarity_score[0])
            
            df[f"catId_{j + 1}"] = score_list
        
        df.to_csv(df_path, header=True, sep=' ', index=False)   