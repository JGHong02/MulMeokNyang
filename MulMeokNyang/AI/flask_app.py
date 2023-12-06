import os
import shutil
import pandas as pd
from flask import Flask, request, jsonify
from model import predict_resnet, get_color
from PIL import Image
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/catClassification', methods=['POST'])
def upload_files():
    
    folder_path = "./uploads"
    # Check if the folder exists
    if os.path.exists(folder_path):
      # Iterate over the files in the folder
      for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        
        # Check if it's a file or a subfolder
        if os.path.isfile(file_path):
          os.unlink(file_path)
        elif os.path.isdir(file_path):
          shutil.rmtree(file_path)

    uploaded_files = request.files.getlist('file')

    if 'file' not in request.files or len(uploaded_files) == 0:
        return jsonify({'error': 'No file part'})

    for file in uploaded_files:
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file'})

        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    
    image_extensions = ['.jpg', '.jpeg', '.png']
    try:
        imgs_list = [filename for filename in os.listdir("uploads") if os.path.splitext(filename)[-1] in image_extensions ]

        print(imgs_list)
        # Process each image path as needed
        combined_results_list = []
        for image_path in imgs_list:
            # absolute_path = os.path.abspath(image_path)
            # print('Absolute path:', absolute_path)

            print("./uploads/" + image_path)
            print(os.path.exists("./uploads/" + image_path))
            image = Image.open("./uploads/" + image_path)

            # Model predictions
            yolov8_results = get_color("./uploads/" + image_path)
            resnet_results = predict_resnet(image)

            combined_results = {**resnet_results, **yolov8_results}
            combined_results_list.append(combined_results)
        
        df = pd.DataFrame(combined_results_list)

        breed = {'breed': df['breed'].value_counts().idxmax()}
        color = df.iloc[:, 1:6].to_dict(orient='records')[0]
        combined_results = {**breed, **color}
        print(combined_results)

        return jsonify(combined_results)
    except Exception as e:
        return {'error': str(e)}

if __name__ == '__main__':
    # Run the Flask app on localhost, port 5000
    app.run(host='0.0.0.0', port=5000)