# 🚀 Resume Adaptiv — AI-Powered Resume Optimizer

**Resume Adaptiv** is a professional full-stack application designed to help job seekers bypass **ATS (Applicant Tracking Systems)** and stand out to recruiters. Using the power of a local Large Language Model (**Gemma 4**), the service analyzes resumes against specific job descriptions and transforms them into high-impact, result-oriented documents.

## ✨ Key Features

- **🎯 AI-Driven Analysis:** Calculates a match score (%) and identifies missing keywords based on the 2026 job market standards.
- **✍️ Smart Rewrite:** Automatically rewrites experience using the **"Action $\rightarrow$ Tool $\rightarrow$ Result"** formula to demonstrate real business value.
- **✉️ Cover Letter Generator:** Creates a personalized, high-conversion cover letter tailored to the specific company and role.
- **📄 Multi-format Support:** Supports uploading resumes in `.pdf`, `.docx`, and `.txt` formats.
- **🌐 Web Scraping:** Allows users to simply paste a job URL (e.g., from hh.ru) to extract requirements automatically.
- **📥 Professional Export:** Generates a perfectly formatted `.docx` file, including optional photo integration.
- **🎨 Modern UI/UX:** Responsive design with **Dark Mode**, Glassmorphism effects, and a Side-by-Side comparison view.

## 🛠 Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, React-Markdown.
- **Backend:** Python, FastAPI, Uvicorn.
- **AI Engine:** Ollama (Gemma 4:26b).
- **Parsing:** PyPDF2, python-docx, BeautifulSoup4.
- **Database:** PostgreSQL (In development).

## 🚀 Getting Started

### Prerequisites

- Install [Ollama](https://ollama.com/) and pull the model: `ollama run gemma4:26b`
- Install Python 3.10+ and Node.js

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ArtemKadkin/resume-//adaptiv.git
   cd resume-adaptiv
   🚀 Resume Adaptiv — AI-Оптимизатор Резюме
   Resume Adaptiv — это профессиональное Full-stack приложение, созданное для того, чтобы помочь соискателям проходить через ATS-системы (автоматические фильтры резюме) и привлекать внимание рекрутеров. С помощью локальной нейросети (Gemma 4) сервис анализирует резюме на соответствие конкретной вакансии и превращает его в высокоэффективный документ, ориентированный на результат.
   ```

✨ Основные возможности
🎯 AI-Анализ: Рассчитывает процент соответствия вакансии и выявляет недостающие ключевые слова согласно стандартам рынка труда 2026 года.
✍️ Умный Рерайт: Автоматически переписывает опыт работы по формуле «Действие $\rightarrow$ Инструмент $\rightarrow$ Результат», чтобы продемонстрировать реальную пользу для бизнеса.
✉️ Генератор сопроводительных писем: Создает персонализированное письмо, которое связывает достижения кандидата с конкретными задачами компании.
📄 Поддержка форматов: Работа с файлами .pdf, .docx и .txt.
🌐 Веб-скрейпинг: Возможность просто вставить ссылку на вакансию (например, с hh.ru) для автоматического извлечения требований.
📥 Профессиональный экспорт: Генерация идеально оформленного файла .docx с возможностью добавления фотографии.
🎨 Современный интерфейс: Адаптивный дизайн, темная тема, эффекты Glassmorphism и режим сравнения «До/После».
🛠 Технологический стек
Frontend: React.js, Vite, Tailwind CSS, React-Markdown.
Backend: Python, FastAPI, Uvicorn.
AI Engine: Ollama (Gemma 4:26b).
Парсинг: PyPDF2, python-docx, BeautifulSoup4.
База данных: PostgreSQL (в разработке).
🚀 Быстрый старт
Предварительные требования
Установленная Ollama и модель: ollama run gemma4:26b
Установленные Python 3.10+ и Node.js
