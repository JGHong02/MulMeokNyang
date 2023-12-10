# MulMeokNyang

## Demonstration Video
<a href="https://youtu.be/w5-AoBGKgJU?si=pbF0UQpNJNiQSJvY"> <img width="600" alt="스크린샷 2023-12-07 23 57 00" src="https://github.com/matchlessNostril/catFeeder/assets/77608505/01831997-75cf-4eee-b216-cefa4546c917"> </a>


https://youtu.be/w5-AoBGKgJU?si=pbF0UQpNJNiQSJvY



## Blog
Software Engineering blog:  
<https://www.notion.so/MulMeokNyang-e732d36f5a36491f830f0d46bba45064>  

AI blog:  
<https://medium.com/@junggihong/mulmeoknyangs-second-tech-blog-c281505c5212>  

## Team members

- Jukyung Ahn | Dept. Information Systems at Hanyang University | <hyoju8618@naver.com>
- Chan Sol Choi | Dept. Information Systems at Hanyang University | <hjk9216@hanyang.ac.kr>
- Jun Ggi Hong | Dept. Information Systems at Hanyang University | <sentorino@hanyang.ac.kr>
- Yun Sun Lee | Dept. Film and Theatre at Hanyang University | <justina7182@gmail.com>

## Proposal

The 'MulMeokNyang' service is designed to address the issue of cats' water intake, which is critical for preventing dehydration-related diseases. It utilizes AI models to recognize individual cats by their breed and distinctive colors. Users can register their cat's profile in the mobile app by uploading photos, and the AI extracts the breed and colors to store in the database. The water dispenser uses these data to identify individual cats through real-time video analysis. The service currently recognizes twelve cat breeds and relies on color differentiation for identification.

Limitations include the current breed recognition range and the lack of direct testing with water dispensers. The potential for development lies in enhancing AI accuracy and expanding the technology into other pet care areas. The market analysis indicates a growing demand for such services, promising profitability and market expansion opportunities.

## Functionality


### 1️⃣ Start

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/4e534fdc-3faa-4ba5-b64a-d3a9c1db6975" alt="Untitled (1)" width="200"/>

- Click the "Sign up" button to proceed with the registration via email.


### 2️⃣ SignUp

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/c94fb203-614e-4649-a1dd-d920c5a87bc0" alt="2_SignUp" width="600"/>

- Enter information in the email, password, and password confirmation fields.
- If the email and password are valid, proceed to the next screen.
- Verify your identity through message authentication.
- Enter the 6-digit authentication code and press the complete button to finish SignUp.


### 3️⃣ Login / Find Email / Find Password

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/d261efcb-30d1-4d5a-9707-36bde5cecaf6" alt="Untitled (2)" width="200"/>

- Log in with the email and password.
- The automatic login setting is only available for users who have completed user profile registration.
Users who have not yet registered their profile will receive an alert to set up automatic login after registration.


<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/14c69909-ad83-4332-9edd-e9bf33a96586" alt="5_FindPw" width="400"/>

- If you have forgotten your email, please click on the "Find Email" button.
By entering only your name and phone number, you can find your email.


<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/e83718c3-ba9f-467d-a4c0-326166c616cb" alt="6" width="200"/>

- If you have forgotten your password, click on the "Forgot Password" button to proceed with SMS verification. After that, your password will be sent to the corresponding email.


### 4️⃣ User Profile Registration

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/f464655b-01d3-4d7a-a383-e068c3d0a135" alt="789" width="600"/>

- Type a profile picture (optional), nickname, and self-introduction (optional).


### 5️⃣ Go To Management Space

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/662b287a-b31b-4df9-8366-c4c1f3b0bbe2" alt="9_WaitCoManager" width="200"/>

- If you want to create a space to manage your pet cats,
Press the 'Create your own management space' button,
Proceed with the water supply registration to work with the management space.

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/0c16c906-0e66-43b3-8991-4d2d47ea98d1" alt="10_CatProfile1" width="200"/>

- If you want to be a co-manager in an existing space, click 'Wait for co-manager registration'.
- Once additional co-manager registration is confirmed, go to the main screen immediately.


### 6️⃣ Cat Profile Registration

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/36395b31-788d-4eaf-9117-800dd50c0100" alt="11" width="400"/>

- Enter the profile picture of the cat, name, age, and weight.

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/ebf37b06-ee5b-4184-83f8-fcfc96c6044d" alt="12_CatFeed" width="200"/>

- In order for the water dispenser to recognize the cat and record the daily hydration, users should conduct an AI analysis with five photos to classify the breed and extract the characteristic colors.
- The characteristic color will appear slightly darker considering the shadow according to the position of the water dispenser camera.

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/6e604299-7f03-4f32-9e8c-bad496565597" alt="13_CatHydration" width="200"/>

- Enter the wet food consumption information.
- It will be used as a calculation for the amount of recommended hydration.

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/96165aee-ae9c-4f51-b4e1-dcde86b57183" alt="14_Main" width="400"/>

- Set the daily goal hydaration.
- If you want to register a new cat, click the additional registration button. Or If you want to go straight to the management space, click tge complete complete registration.


### 7️⃣ Main
<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/6decf4fd-1e79-49c2-9af5-cff86f6dc633" alt="15_StatisticsGraph" width="600"/>

- Select a cat profile at the top to see the main information.
- You can see the daily goal hydration guage, with an evaluation message corresponding to the value.
- If you press the Statistics button, navigate to the period-based hydration statistics screen for the currently selected cat.


### 8️⃣ Hydration Statistics
<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/ba3b9b83-9917-4e9e-9ca2-e32d9047c763" alt="16_StatisticsCalendar" width="400"/>

- You can check the weekly, monthly, and yearly statistical graphs,
You can specify a specific period by clicking the calendar icon.
- Press the bar on the graph to see the exact figures.
- Select a cat profile at the top, You can see another cat's hydration statistic.


### 9️⃣ Drawer
<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/86bfba72-cec7-4967-982e-6d6988f12f8e" alt="17_Drawer" width="200"/>

- If you press the menu icon on the top right, the drawer will bring up from the right side.
The features of the drawer are following below.
- Modify user profile
- Add, modify, or delete cat profile
(To modify or delete, the cat selection alert will appear)
- Co-manager
- Log out


### 🔟 Co-manager
<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/09f23afd-1830-4ce7-a1e4-49772ccdc0da" alt="19_CoManager" width="400"/>

- You can see a list of other users who have been added as co-manager of the current space.
- If you are the representative manager, you can click the add co-manager button to add a new manager,
or you can also delete an existing manager by clicking delete icon.


## AI

In the back-end side, AI analyzes the images that user uploaded in **Cat Profile Registration** stage and returns detected cat breed and dominant colors in JSON format via API.
![image](https://github.com/matchlessNostril/catFeeder/assets/81696717/1cae15de-b911-4d18-bd37-1af89ad017de)
