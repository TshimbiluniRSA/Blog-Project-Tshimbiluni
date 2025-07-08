# Tshimbiluni Blog Web Application

A modern full-stack blog application built with Django REST Framework and React TypeScript, designed for sharing articles and enabling community engagement through comments.

## 📋 Table of Contents

- [🚀 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
  - [🐳 Docker Setup](#-docker-setup-recommended)
  - [💻 Local Development](#-local-development-setup)
- [📖 API Documentation](#-api-documentation)
- [🔧 Development Commands](#-development-commands)
- [🎨 Customization](#-customization)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)
- [🐛 Troubleshooting](#-troubleshooting)
- [📊 Project Status](#-project-status)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)
- [🙏 Acknowledgments](#-acknowledgments)

## 🚀 Project Overview

Tshimbiluni Blog is a comprehensive web application that allows users to create, read, update, and delete blog articles. The platform features a clean, modern interface with article tagging, search functionality, and responsive design.

### ✨ Features

- **Article Management**: Create, edit, and delete blog articles
- **Tagging System**: Organize articles with custom tags
- **Search & Filter**: Find articles by title, content, or tags
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **RESTful API**: Well-documented Django REST Framework backend
- **Type Safety**: Full TypeScript support in React frontend
- **Modern Architecture**: Separation of concerns with clean API design

### 🛠 Tech Stack

**Backend:**
- Python 3.10+
- Django 5.1.2
- Django REST Framework 3.15.2
- django-cors-headers for CORS handling
- SQLite database (development)

**Frontend:**
- React 18.3.1
- TypeScript 5.5.3
- Vite 5.4.8 (build tool)
- React Router 6.26.2
- Axios 1.7.7 (HTTP client)
- Tailwind CSS 3.4.13

**Development Tools:**
- Docker & Docker Compose
- ESLint & Prettier
- Jest (testing framework)
- Hot reload for both frontend and backend

## 📁 Project Structure

```
Blog-Project-Tshimbiluni/
├── backend/
│   └── src/
│       ├── manage.py
│       ├── requirements.txt
│       ├── db.sqlite3
│       ├── BlogProject/          # Django project settings
│       │   ├── __init__.py
│       │   ├── settings.py
│       │   ├── urls.py
│       │   └── wsgi.py
│       └── blog/                 # Blog application
│           ├── models.py         # Article and Tag models
│           ├── serializers.py    # DRF serializers
│           ├── views.py          # API viewsets
│           ├── urls.py           # API endpoints
│           └── migrations/
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── ArticleList.tsx
│   │   │   ├── ArticleDetail.tsx
│   │   │   ├── ArticleForm.tsx
│   │   │   └── SearchAndEdit.tsx
│   │   ├── api.ts               # API client configuration
│   │   ├── App.tsx              # Main application component
│   │   └── main.tsx             # Application entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── docker-compose.yml           # Multi-service orchestration
├── dockerfile                   # Backend Dockerfile
├── docker-setup.sh             # Quick Docker setup script
└── README.md                   # This file
```

## 🚀 Quick Start

![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.1.2-green?logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker&logoColor=white)

### Prerequisites

Choose one of the following setup methods:

**For Docker Setup (Recommended):**
- ✅ Docker Desktop
- ✅ Docker Compose

**For Local Development:**
- ✅ Python 3.10+
- ✅ Node.js 18+
- ✅ npm or yarn

### 🐳 Docker Setup (Recommended)

The fastest way to get started is using Docker:

```bash
# 1️⃣ Clone the repository
git clone https://github.com/TshimbiluniRSA/Blog-Project-Tshimbiluni.git
cd Blog-Project-Tshimbiluni

# 2️⃣ Quick setup with our script
chmod +x docker-setup.sh
./docker-setup.sh

# 3️⃣ Or manually with docker-compose
docker-compose up --build
```

**🎉 Access the application:**
- 🌐 Frontend: http://localhost:5173
- 🔌 Backend API: http://localhost:8000
- 👑 Django Admin: http://localhost:8000/admin

### 💻 Local Development Setup

#### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend/src
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv blogenv
   
   # On Windows
   blogenv\Scripts\activate
   
   # On macOS/Linux
   source blogenv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start development server:**
   ```bash
   python manage.py runserver
   ```

Backend will be available at: http://localhost:8000

#### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

Frontend will be available at: http://localhost:5173

## 📖 API Documentation

### 🔗 Base URLs
- **Local Development**: `http://localhost:8000/api/`
- **Docker Environment**: `http://localhost:8000/api/`

### 📊 Available Endpoints

#### 📝 Articles API
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/articles/` | List all articles | ❌ |
| `POST` | `/api/articles/` | Create new article | ❌ |
| `GET` | `/api/articles/{id}/` | Get specific article | ❌ |
| `PUT` | `/api/articles/{id}/` | Update article | ❌ |
| `DELETE` | `/api/articles/{id}/` | Delete article | ❌ |

#### 🏷️ Tags API
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/tags/` | List all tags | ❌ |
| `POST` | `/api/tags/` | Create new tag | ❌ |

### 💡 Example API Usage

**📝 Create Article:**
```json
POST /api/articles/
Content-Type: application/json

{
  "title": "Getting Started with Django & React",
  "content": "This article covers the basics of building a full-stack application...",
  "tags": [
    {"id": 1, "name": "django"},
    {"id": 2, "name": "react"},
    {"name": "tutorial"}
  ]
}
```

**✅ Response:**
```json
{
  "id": 1,
  "title": "Getting Started with Django & React",
  "content": "This article covers the basics of building a full-stack application...",
  "created_at": "2025-07-08T10:00:00Z",
  "updated_at": "2025-07-08T10:00:00Z",
  "tags": [
    {"id": 1, "name": "django"},
    {"id": 2, "name": "react"},
    {"id": 3, "name": "tutorial"}
  ]
}
```

**🔍 Search Articles:**
```bash
# Search by title or content
GET /api/articles/?search=django

# Filter by tag
GET /api/articles/?tags=react

# Combine filters
GET /api/articles/?search=tutorial&tags=django
```

## 🔧 Development Commands

### Backend Commands
```bash
# Run tests
python manage.py test

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic

# Django shell
python manage.py shell
```

### Frontend Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run tests
npm test
```

### Docker Commands
```bash
# Build and start services
docker-compose up --build

# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs

# Rebuild containers
docker-compose build --no-cache
```

## 🎨 Customization

### Styling
The application uses Tailwind CSS with custom color scheme:
- Primary: `#003366` (Sasol Blue)
- Secondary: `#0099cc` (Sasol Light Blue) 
- Tertiary: `#ff6600` (Orange accent)

Modify colors in `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: '#003366',
  secondary: '#0099cc', 
  tertiary: '#ff6600',
}
```

### Environment Variables
Create `.env` files for environment-specific configuration:

**Backend (.env):**
```env
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:8000
```

## 🧪 Testing

### Backend Tests
```bash
cd backend/src
python manage.py test blog
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository** and clone it locally
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to your branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request** with a clear description

### Code Style Guidelines
- **Python**: Follow PEP 8 guidelines and use type hints
- **TypeScript**: Use strict mode and proper interface definitions
- **Git**: Use conventional commit messages
- **Testing**: Write tests for new features and bug fixes
- **Documentation**: Update documentation for any new features

### Development Setup for Contributors
```bash
# Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/Blog-Project-Tshimbiluni.git
cd Blog-Project-Tshimbiluni

# Set up the development environment
./docker-setup.sh

# Create a new feature branch
git checkout -b feature/your-feature-name
```

## 🐛 Troubleshooting

### Common Issues & Solutions

**🔧 Port already in use:**
```bash
# Kill processes on ports 8000 or 5173
sudo lsof -t -i tcp:8000 | xargs kill -9
sudo lsof -t -i tcp:5173 | xargs kill -9
```

**🐳 Docker permission issues:**
```bash
# Fix file ownership
sudo chown -R $USER:$USER .

# Reset Docker volumes
docker-compose down -v
docker-compose up --build
```

**📦 Node modules issues:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**🗃️ Django migration issues:**
```bash
cd backend/src
python manage.py makemigrations --merge
python manage.py migrate

# If still having issues, reset migrations (development only)
rm -rf blog/migrations/
python manage.py makemigrations blog
python manage.py migrate
```

**🔗 CORS issues:**
- Ensure frontend is running on port 5173
- Check `CORS_ALLOWED_ORIGINS` in Django settings
- Verify API base URL in frontend configuration

**💾 Database issues:**
```bash
# Reset SQLite database (development only)
cd backend/src
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Need Help?
- Check the [GitHub Issues](https://github.com/TshimbiluniRSA/Blog-Project-Tshimbiluni/issues)
- Create a new issue with detailed error messages
- Include your operating system and versions

## 📊 Project Status

### Current Features ✅
- [x] Article CRUD operations
- [x] Tag management system
- [x] Search and filter functionality
- [x] Responsive UI with Tailwind CSS
- [x] Docker containerization
- [x] REST API documentation
- [x] TypeScript support

### Planned Features 🚧
- [ ] User authentication & authorization
- [ ] Comment system for articles
- [ ] Rich text editor (WYSIWYG)
- [ ] Article categories
- [ ] User profiles and avatars
- [ ] Email notifications
- [ ] Social media sharing
- [ ] SEO optimization


## 📄 License

This project is licensed under the MIT License.

**MIT License**

Copyright (c) 2025 Tshimbiluni Nedambale

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 👨‍💻 Author

**Tshimbiluni Nedambale**
- 🐙 GitHub: [@TshimbiluniRSA](https://github.com/TshimbiluniRSA)
- 📧 Email: hugetshimbi@gmail.com
-  LinkedIn: [Connect with me](https://linkedin.com/in/tshimbiluni-nedambale)
- 🌐 Portfolio: [Coming Soon]

*Full-stack developer passionate about creating modern web applications with clean architecture and user-friendly interfaces.*

## 🙏 Acknowledgments

Special thanks to:

- **🌟 Open Source Community**: Django, React, and TypeScript communities for excellent documentation and tools
- **📚 Educational Resources**: Online tutorials and courses that made this project possible
- **🛠️ Development Tools**: 
  - [Django REST Framework](https://www.django-rest-framework.org/) for robust API development
  - [Vite](https://vitejs.dev/) for lightning-fast frontend tooling
  - [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
  - [Docker](https://www.docker.com/) for containerization
- **🎨 Design Inspiration**: Modern web design principles and UI/UX best practices
- **🐛 Beta Testers**: Future contributors and testers who help improve the application

## 📈 Stats & Analytics

![GitHub repo size](https://img.shields.io/github/repo-size/TshimbiluniRSA/Blog-Project-Tshimbiluni)
![GitHub last commit](https://img.shields.io/github/last-commit/TshimbiluniRSA/Blog-Project-Tshimbiluni)
![GitHub issues](https://img.shields.io/github/issues/TshimbiluniRSA/Blog-Project-Tshimbiluni)
![GitHub pull requests](https://img.shields.io/github/issues-pr/TshimbiluniRSA/Blog-Project-Tshimbiluni)

---

## 🚀 What's Next?

1. **Star ⭐** this repository if you find it useful
2. **Fork 🍴** it to contribute or customize for your needs
3. **Share 📢** with others who might benefit from this project
4. **Contribute 🤝** by submitting issues or pull requests

---

<div align="center">

**Made with ❤️ by [Tshimbiluni Nedambale](https://github.com/TshimbiluniRSA)**

*Building the future, one commit at a time* 🚀

**Happy Blogging! 📝✨**

</div>
