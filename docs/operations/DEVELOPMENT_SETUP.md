# AUTOVERSE DEVELOPMENT SETUP GUIDE
## Running the Connected Engineering Workstation Locally

**Environment:** Windows 10/11, macOS, Linux  
**Runtimes Required:** Node.js 20+ & Python 3.11+  

---

### 1. Prerequisites Installation

1. **Node.js & npm:**
   Ensure Node.js 20.x or 22.x is installed:
   ```bash
   node -v
   npm -v
   ```
2. **Python Environment:**
   Ensure Python 3.11, 3.12, 3.13, or 3.14 is active:
   ```bash
   python --version
   ```

---

### 2. Backend Startup (Authoritative FastAPI Service)

1. **Install Python Dependencies:**
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic pytest
   ```
2. **Launch the FastAPI Server on Port 8000:**
   ```bash
   # From repository root:
   python -m uvicorn services.api.main:app --host 127.0.0.1 --port 8000 --reload
   ```
3. **Verify API Health:**
   Open browser to `http://127.0.0.1:8000/api/v1/health`. Expected response:
   ```json
   {
     "status": "ONLINE",
     "service": "autoverse-api",
     "database_connected": true
   }
   ```
   Interactive Swagger API documentation is available at `http://127.0.0.1:8000/docs`.

---

### 3. Frontend Startup (Vite Dev Server)

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Start Dev Server:**
   ```bash
   npm run dev
   ```
   Default URL: `http://localhost:5173`.
3. **Verify Connected Status:**
   In the browser, observe the status pill in the Top Context Bar:
   - Green dot with **`ENGINE READY`** indicates successful live connection to FastAPI on port 8000.
   - If backend is stopped, pill gracefully displays **`OFFLINE (LOCAL)`** without crashing.

---

### 4. Running Test Suites

- **Run Frontend Vitest Tests (40 test files, 248 tests):**
  ```bash
  npm run test
  # or
  npx vitest run
  ```
- **Run Backend Pytest Tests (13 tests):**
  ```bash
  python -m pytest tests_python
  ```
- **Static TypeScript Typecheck:**
  ```bash
  npx tsc --noEmit
  ```
- **Production Build:**
  ```bash
  npm run build
  ```
