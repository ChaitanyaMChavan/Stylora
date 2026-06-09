const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");
const User = require("./models/User");
const DesignerProfile = require("./models/DesignerProfile");
const Portfolio = require("./models/Portfolio");
const Appointment = require("./models/Appointment");

dotenv.config();

const PORT = process.env.PORT || 5000;

const syncModelIndexes = async () => {
  await Promise.all([
    User.syncIndexes(),
    DesignerProfile.syncIndexes(),
    Portfolio.syncIndexes(),
    Appointment.syncIndexes(),
  ]);
  console.log("Model indexes synchronized");
};

const startServer = async () => {
  try {
    await connectDB();
    if (process.env.SYNC_INDEXES === "true") {
      await syncModelIndexes();
    } else {
      console.log("Skipping model index sync (SYNC_INDEXES is not true)");
    }
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
