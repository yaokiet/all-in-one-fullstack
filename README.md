# all-in-one

### Project Overview

The Work-from-Home (WFH) Tracking System is a web-based application designed to streamline the process of managing flexible work arrangements for businesses. It provides a centralized portal for staff to apply for regular or ad-hoc WFH days, and for managers, HR, and senior management to effectively track, approve, and oversee employee schedules. Built with scalability in mind, the system aims to enhance efficiency and transparency in managing flexible work environments.

### Technology Stack

- **Frontend**: [ Next.js ] for building the user interface.
- **Backend**: [ Flask ] for handling server-side logic and API requests.
- **Database**: [mySQL] for managing application data.
- **Cloud Deployment**: [Vercel(frontend) & pythonanywhere(backend) & awsrds(database) ] for scalable, cloud-based deployment.

## Running Software

### Getting Started (Frontend)

1. **Navigate to Frontend Folder**
   `cd client`

2. **Install Dependencies**:  
   `npm install`

3. **Run the Application**:  
   Start the development server by running:  
   `npm run dev`

4. **Environment Variables**:  
   Set up the necessary environment variables in the `.env` file, including database credentials, cloud configuration, etc. (not necessary)

### Backend

1. **Navigate to Backend Folder**
   `cd server`

2. **Install Dependencies**
   `pip install -r requirements.txt`

3. **Run the Application**
   `python app.py`

4. **Run Tests**
   `pytest -v`
   `pytest --cov -v`
