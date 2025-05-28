# Contact Us

Dartanhan Ramos:
- Discord: hidro.
- email: alessandroramosd@gmail.com
- linkedin: https://www.linkedin.com/in/dartanhan-ramos-b60157181/

Tayrine Soares:
- Discord: tayrine0096
- email: tayrinecristina@hotmail.com
- linkedin: https://www.linkedin.com/in/tayrine-soares/

# 🍽️ Byte to Bite

Byte to Bite is a React Native app built with Expo, Clerk, and Convex. It lets users log in and enter the ingredients they have on hand. Using the Spoonacular API, the app suggests recipes based on those ingredients. 🥕🍳

Users can favorite recipes ⭐ to save them for later in their personal favorites tab. They can also create posts about food they have cooked or eaten, which other users can view live and comment on 💬.

If a post is labeled as a recipe, it becomes shareable in the feed 🔄. Other users can view these shared recipes and bookmark them to save for future reference 📌.

## 🚀 Getting Started

1. Clone the repo  
2. Run `npm install` to install dependencies 📦  
3. Run `npx expo start` to start the app ▶️

You can open the app in a development build, Android emulator, iOS simulator, or Expo Go 📱💻.

## 🔑 Environment Variables

This project requires a `.env.local` file with the following variables set to your own credentials:
- SPOONACULAR_API_KEY=your_spoonacular_api_key_here
- CLERK_FRONTEND_API=your_clerk_frontend_api_here
- CLERK_API_KEY=your_clerk_api_key_here
- CONVEX_URL=your_convex_project_url_here
- CONVEX_PUBLIC_KEY=your_convex_public_key_here


### How to get these keys:

- **Spoonacular API key:** Sign up at [https://spoonacular.com/food-api](https://spoonacular.com/food-api)
- **Clerk API keys:** Available from your Clerk dashboard at [https://clerk.dev](https://clerk.dev)
- **Convex keys:** Get these from your Convex project settings at [https://convex.dev](https://convex.dev)

### Setup instructions:

1. Copy the example environment file:
    ```bash
    cp .env.example .env.local
    ```
2. Replace the placeholder values with your own API keys and URLs.
3. Restart your development server to load the new environment variables.

---

### `.env.example` file example:

```env
SPOONACULAR_API_KEY=your_spoonacular_api_key_here
CLERK_FRONTEND_API=your_clerk_frontend_api_here
CLERK_API_KEY=your_clerk_api_key_here
CONVEX_URL=your_convex_project_url_here
CONVEX_PUBLIC_KEY=your_convex_public_key_here



## ✨ Features

- 🔐 User authentication with Clerk  
- ⚡ Backend data management with Convex  
- 🍲 Recipe suggestions from Spoonacular API based on entered ingredients  
- ⭐ Favorite recipes saved per user  
- 🍽️ Food posts with live comments  
- 🔄 Shareable, bookmarkable user-created recipes  

## 🔄 Reset Project

Run `npm run reset-project` to move starter code to an example directory and start fresh.

## 📚 Learn More

- [Expo Docs](https://docs.expo.dev)  
- [Clerk Docs](https://clerk.com/docs)  
- [Convex Docs](https://docs.convex.dev)  
- [Spoonacular API](https://spoonacular.com/food-api)