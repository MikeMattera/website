# 🏋️ Workout Tracker

A modern, mobile-first web application for tracking your workouts. Upload your workout plan as a CSV or Excel file, and the app will dynamically create forms for you to log your progress.

## ✨ Features

- **📁 File Upload**: Support for CSV and Excel files (.csv, .xlsx, .xls)
- **🎯 Dynamic Forms**: Automatically generates input fields based on your workout plan columns
- **📱 Mobile-First**: Responsive design that works perfectly on phones and tablets
- **💾 Local Storage**: All data saved in your browser - completely private
- **📊 Progress Tracking**: View your workout history and progress over time
- **📤 Data Export**: Export your workout data as CSV for backup or analysis
- **💨 Auto-Save**: Your progress is automatically saved as you type
- **🌙 Works Offline**: No internet connection required during workouts

## 🚀 Quick Start

### Option 1: Deploy to Netlify (Recommended)

1. **Download the files** from this project
2. **Go to [netlify.com](https://netlify.com)** and sign up for free
3. **Drag and drop** the project folder onto Netlify's deploy area
4. **Get your live URL** instantly!

### Option 2: Run Locally

1. Download all files to a folder
2. Open `index.html` in your web browser
3. Start tracking your workouts!

## 📋 How to Use

### 1. Prepare Your Workout Plan

Create a CSV or Excel file with your workout plan. The app works with any column structure, but here's a recommended format:

```csv
Day,Exercise,Sets,Reps,Weight,Rest
Push Day,Bench Press,4,8-10,185 lbs,2-3 min
Push Day,Overhead Press,3,8-10,135 lbs,2-3 min
Pull Day,Pull-ups,4,8-10,Bodyweight,2-3 min
```

**Column suggestions:**
- **Day/Workout**: Group exercises by workout day
- **Exercise**: Name of the exercise
- **Sets**: Number of sets
- **Reps**: Target repetitions
- **Weight**: Target weight
- **Rest**: Rest time between sets
- **Notes**: Any additional notes

### 2. Upload Your Plan

- Open the app
- Drag & drop your CSV/Excel file or click to browse
- The app will automatically read your columns

### 3. Start Working Out

- Select your workout from the dropdown
- Click "Start Workout"
- Fill in your actual values (weight used, reps completed, etc.)
- Your progress auto-saves as you type

### 4. Track Progress

- View your workout history
- Export your data for analysis
- See completion rates and workout duration

## 📱 Mobile Experience

The app is designed mobile-first:
- **Touch-friendly** buttons and inputs
- **Responsive design** that adapts to any screen size
- **Easy data entry** with large input fields
- **Swipe-friendly** interface
- **Works offline** once loaded

## 🔒 Privacy & Data

- **100% Private**: All data stored in your browser
- **No accounts required**: Start using immediately
- **No data collection**: Your workout data never leaves your device
- **Export anytime**: Download your data as CSV
- **Clear data option**: Remove all data when needed

## 🛠️ Technical Details

- **Pure JavaScript**: No frameworks, fast loading
- **Local Storage**: Persistent data without databases
- **Responsive CSS**: Modern, mobile-first design
- **File APIs**: Drag & drop file handling
- **Excel Support**: Full .xlsx/.xls file parsing

## 📊 Sample Workout Plan

A sample workout file (`sample-workout.csv`) is included to help you get started. It demonstrates a Push/Pull/Legs split routine.

## 🔧 Customization

The app automatically adapts to your CSV structure:
- **Any column names** work (Exercise, Movement, etc.)
- **Any number of columns** supported
- **Flexible workout grouping** (Day, Workout, Session, etc.)
- **Custom data fields** (RPE, Notes, Time, etc.)

## 📈 Future Enhancements

Possible additions based on user feedback:
- Cloud sync across devices
- Workout templates
- Progress charts and analytics
- Timer integration
- Photo/video attachments
- Social sharing features

## 🤝 Support

For issues or questions:
1. Check the sample CSV format
2. Ensure your file has headers in the first row
3. Try with a simple CSV file first

## 📄 License

This project is open source and free to use for personal workouts.

---

**Ready to start tracking? Upload your workout plan and get stronger! 💪**