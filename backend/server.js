import app from "./src/app.js";
import "dotenv/config";
import { sequelize } from "./src/config/db.js";
import cors from "cors";
app.use(cors()); // ✅ Cho phép frontend gọi API


const PORT = process.env.PORT;
app.listen(PORT, async () => {
  console.log(`App running at: http://localhost:${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("connect success") ;
  } catch (error) {
    console.log("errorr", error) ;
  }
});