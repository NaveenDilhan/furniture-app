# 3D Furniture Design (WoodLand Furnitures)

A full-stack, interactive 3D room design application that allows users to build, customize, and take virtual tours of their dream spaces. Built with the MERN stack and Three.js, this app functions as both a web application and a cross-platform desktop app via Electron.

## 🌟 Key Features

* **Interactive Design Canvas**: Switch seamlessly between a 2D top-down floor plan view and a fully immersive 3D view.
* **Smart Furniture Placement**: Drag, drop, scale, and rotate furniture with dynamic wall collision detection.
* **First-Person Virtual Tour**: Walk through your custom-designed room in a first-person perspective using WASD controls.
* **Dynamic Lighting**: Choose between Day, Golden Hour, and Night lighting modes to see how your room looks at different times.
* **Save & Load Designs**: Authenticated users can save their room configurations and load them later.
* **E-Commerce Integration**: Add furniture to your cart and checkout directly from your 3D design space.
* **Desktop App Support**: Packaged with Electron for a native desktop experience.

![WoodLand Furnitures App Screenshot](./cilent/src/assets/app-screenshot.png)

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
```

## 🙏 Credits & Acknowledgments

This project utilizes several open-source libraries and incredible community assets. A huge thank you to the creators who made their work available.

**3D Models & Furniture Assets**
* ["Bed"](https://sketchfab.com/3d-models/bed-b8c16d4b69f64335b46379b119b102b4) by [rickmaolly] on Sketchfab - Licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
* ["Office Sofa"](https://sketchfab.com/3d-models/office-sofa-25mb-43f927c7b2b2449ab924f4358a5e4340) by [Mehdi Shahsavan] on Sketchfab - Licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
* ["Sofa - Long Sofa"](https://sketchfab.com/3d-models/sofa-long-sofa-5c2ecc125237498fa610f928fc435db6) by [Lahcen.el] on Sketchfab - Licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
* ["Sofa"](https://sketchfab.com/3d-models/sofa-826c727451b441358e780d4651b2627e) by [Qu3st10n] on Sketchfab - Licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
* ["sofa"](https://sketchfab.com/3d-models/sofa-33a982d268d749ddb803263ea7da84b0) by [MaX3Dd] on Sketchfab - Licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
* ["Bar Stool"](https://sketchfab.com/3d-models/bar-stool-518fe01989904bf48a4a04980bc578af) by [CommonSpence] on Sketchfab - Licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
* ["Stool"](https://sketchfab.com/3d-models/stool-7dcb7f5ddefa49949f3aa9feb68130c3) by [Oldmode] on Sketchfab - Licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
* ["Cupboard"](https://sketchfab.com/3d-models/cupboard-56b25c34c5e34f2c870516ce7af494c4) by [Lucas Garnier] on Sketchfab - Licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)
* ["Cupboard"](https://sketchfab.com/3d-models/cupboard-2bad485236ba42fb8a2b195630def123) by [Viggo] on Sketchfab - Licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/)

**Textures & Lighting (HDRI)**
* Environment lighting and HDRIs sourced from [Poly Haven](https://polyhaven.com/) (CC0 License).
* Texture Images sourced from [Poly Haven](https://polyhaven.com/) (CC0 License).

**Libraries & Tools**
* 3D rendering engine powered by [Three.js](https://threejs.org/) and [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/).
* UI components and icons provided by [Lucide React / Tailwind CSS].

## 📜 License

This project is licensed under the [MIT License](LICENSE.md) - see the LICENSE file for details.
