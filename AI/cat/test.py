#%%
import pandas as pd
#%%
file_path = "./img/predict/labels/df_1_new.csv"
df1 = pd.read_csv(file_path, sep=' ', header=0, names=['class', 'id', 'file_number', 'color1', 'color2', 'color3', 'color4', 'color5', 'breed'])  # Adjust column names accordingly

df1
# %%
file_path = "./img/predict/labels/df_2_new.csv"
df2 = pd.read_csv(file_path, sep=' ', header=0, names=['class', 'id', 'file_number', 'color1', 'color2', 'color3', 'color4', 'color5', 'breed'])  # Adjust column names accordingly

df2
# %%
df1['breed'].value_counts()
# %%
df1['color5'].value_counts()
# %%
df2['breed'].value_counts()
# %%
df2['color5'].value_counts()