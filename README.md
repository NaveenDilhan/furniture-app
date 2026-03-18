# 3D Furniture Design & E-Commerce App (WoodLand Furnitures)

A full-stack, interactive 3D room design application that allows users to build, customize, and take virtual tours of their dream spaces. Built with the MERN stack and Three.js, this app functions as both a web application and a cross-platform desktop app via Electron.

## 🌟 Key Features

* **Interactive Design Canvas**: Switch seamlessly between a 2D top-down floor plan view and a fully immersive 3D view.
* **Smart Furniture Placement**: Drag, drop, scale, and rotate furniture with dynamic wall collision detection.
* **First-Person Virtual Tour**: Walk through your custom-designed room in a first-person perspective using WASD controls.
* **Dynamic Lighting**: Choose between Day, Golden Hour, and Night lighting modes to see how your room looks at different times.
* **Save & Load Designs**: Authenticated users can save their room configurations and load them later.
* **E-Commerce Integration**: Add furniture to your cart and checkout directly from your 3D design space.
* **Desktop App Support**: Packaged with Electron for a native desktop experience.

## 🛠️ Tech Stack

**Frontend (Client)**
* [React.js](https://reactjs.org/) & [Vite](https://vitejs.dev/)
* [Three.js](https://threejs.org/) & [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/) / [@react-three/drei](https://github.com/pmndrs/drei) (3D Rendering)
* [Electron](https://www.electronjs.org/) (Desktop Application Wrapper)

**Backend (Server)**
* [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/) & Mongoose (Database & ORM)
* JWT Authentication

## 📂 Project Structure

```text
furniture-app/
├── client/                 # React Frontend & Electron App
│   ├── electron/           # Electron main process scripts
│   ├── public/             # 3D Models (.glb) and Textures (.jpg, .hdr)
│   ├── src/                # React Components, Pages, and Three.js Canvas
│   └── package.json        
└── server/                 # Node.js + Express Backend
    ├── config/             # Database connection setup
    ├── controllers/        # Route controllers (Auth, Design, Furniture, Orders)
    ├── models/             # Mongoose Schemas (User, Design, Furniture, Order)
    ├── routes/             # API Routes
    └── package.json
