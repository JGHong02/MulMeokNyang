# MulMeokNyang

## Demonstration Video
<img width="600" alt="스크린샷 2023-12-07 23 57 00" src="https://github.com/matchlessNostril/catFeeder/assets/77608505/01831997-75cf-4eee-b216-cefa4546c917">


https://youtu.be/w5-AoBGKgJU?si=pbF0UQpNJNiQSJvY



## Blog
<https://www.notion.so/MulMeokNyang-e732d36f5a36491f830f0d46bba45064>

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

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/92824135-bd28-4cd4-bce7-d6d5c6687e16" alt="Untitled (1)" width="200"/>

- Enter information in the email, password, and password confirmation fields.
- If the email and password are valid, proceed to the next screen.
- Verify your identity through name and phone number verification.
- Enter the 6-digit verification code sent via SMS and press the complete button to finish the registration.

### 3️⃣ Login / Find Email / Find Password
<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/c94fb203-614e-4649-a1dd-d920c5a87bc0" alt="2_SignUp" width="200"/>

- Log in with the email and password entered during registration.
- The automatic login setting is only available for users who have completed user profile registration.
Users who have not yet registered their profile will receive a notification to set up automatic login after registration.
<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/d261efcb-30d1-4d5a-9707-36bde5cecaf6" alt="Untitled (2)" width="200"/>

- If you have forgotten your email, please click on the "Find Email" button.
By entering only your name and phone number, you can find your email.
<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/14c69909-ad83-4332-9edd-e9bf33a96586" alt="5_FindPw" width="200"/>

- If you have forgotten your password, click on the "Forgot Password" button to proceed with SMS verification. After that, your password will be sent to the corresponding email.

### 4️⃣ User Profile Registration

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/e83718c3-ba9f-467d-a4c0-326166c616cb" alt="6" width="200"/>

- Type a profile picture (select), nickname, and self-introduction (select).

### 5️⃣ Go To Management Space
<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/f464655b-01d3-4d7a-a383-e068c3d0a135" alt="789" width="200"/>

- If you want to create a space to manage my cats
Press the 'Create your own management space' button,
Proceed with the water supply registration to work with the management space.

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/662b287a-b31b-4df9-8366-c4c1f3b0bbe2" alt="9_WaitCoManager" width="200"/>

- If you want to be a co-manager in an existing space,
Click 'Wait for co-administrator registration'.
- Once additional co-administrator registration is confirmed, go to the main Space screen immediately.

### 6️⃣ Cat Profile Registration

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/0c16c906-0e66-43b3-8991-4d2d47ea98d1" alt="10_CatProfile1" width="200"/>

- Profile picture of the cat (select) Enter the name, age, and weight.

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/36395b31-788d-4eaf-9117-800dd50c0100" alt="11" width="200"/>

- In order for the water supply to recognize the cat and record the amount of sound, users should conduct an AI analysis with five photos of a good-looking cat to classify the breed and extract the color of its features.
- The extracted color is extracted a little darker considering the shadow according to the position of the water supply camera.

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/ebf37b06-ee5b-4184-83f8-fcfc96c6044d" alt="12_CatFeed" width="200"/>

- Enter the periodic wet feed intake and the amount of intake.
- Taking this into account, the recommended sound quantity formula is calculated.

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/6e604299-7f03-4f32-9e8c-bad496565597" alt="13_CatHydration" width="200"/>

- Set the target daily volume of sound.
- If you want to register a new cat, click the Add Registration button to go straight to the management space to complete the registration of your cat profile.

### 7️⃣ Main

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/96165aee-ae9c-4f51-b4e1-dcde86b57183" alt="14_Main" width="200"/>

- Select a cat profile at the top to display a brief profile of that cat
You can see the daily amount of sound, the amount of sound advice message.
- You can press the View Periodic Sound Quantity Statistics button to go to the Sound Quantity Statistics screen for that cat.

### 8️⃣ Periodical Hydration Statistics

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/6decf4fd-1e79-49c2-9af5-cff86f6dc633" alt="15_StatisticsGraph" width="200"/>

- Select a cat profile at the top,
You can view the target sound quantity achievement rate statistics for that cat by period.
- You can check the daily, weekly, and monthly (yearly) statistical graphs,
You can specify a specific time by clicking the calendar icon.
- Press the bar on the graph to reveal the exact figures.

### 9️⃣ Drawer
<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/ba3b9b83-9917-4e9e-9ca2-e32d9047c763" alt="16_StatisticsCalendar" width="200"/>


- The menu icon in the upper right corner allows you to use the following detailed features.
- Modifying User Profiles
- Add, modify (profiles/wet feeds/drinks), delete cat profiles

<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/86bfba72-cec7-4967-982e-6d6988f12f8e" alt="17_Drawer" width="200"/>

- To modify and delete, the cat selection notification window appears first.
- a co-manager
- Log out
- a co-manager

### 🔟 Comanager
<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/6778a714-4397-40ed-a059-00" alt="18_CatAlert" width="200"/>
<img src="https://github.com/matchlessNostril/catFeeder/assets/77608505/09f23afd-1830-4ce7-a1e4-49772ccdc0da" alt="19_CoManager" width="200"/>



- You can view a list of other users who have been added as co-administrators of the current space.
- If you are the representative administrator, click the Add Administrator button to add a new administrator,
You can delete an existing administrator.






