# catFeeder

## Team members

- Hyo Joo Ahn | Dept. Information Systems at Hanyang University | email
- Chan Sol Choi | Dept. Information Systems at Hanyang University | email
- Jun Ggi Hong | Dept. Information Systems at Hanyang University | <sentorino@hanyang.ac.kr>
- Yun Seon Lee | Dept. Information Systems at Hanyang University | <justina7182@gmail.com>

## Research Proposal

Title: catFeeder

Proposal: Though there are many facial recognition models, it is hard to find facial recognition for specific animals such as cats. So, we are trying to make a model which recognizes individual cats with muzzle point image. There are requirements that need to be fulfilled. Firstly, the model should be able to extract the nasal part of the given cat image and register the cat to be able to recognize the cat afterwards. Secondly, the model should be able to recognize the cat while drinking their water in real-time using the preliminarily given data. We will be learning and refactoring YOLOv5(or 8), a computer vision model built by Ultralytics. We hope to make our own models in future.
The major contributions of the learning are as follows: (1) prepare muzzle point image dataset. (2) train the model using SVM (3) analyze results and see if it can analyze nasal parts using given dataset.
A step-by-step procedure on how to do learning: (assuming the model is perfect)

1. Yolo v5 to extract and crop nose images. (client)
2. Image Normalization, feature Extraction, feature vectorization, vector classification (server)
