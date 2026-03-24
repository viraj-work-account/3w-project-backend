import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is learning at port ${process.env.PORT}`);
    });
  })
  .catch((error) => console.log("Mongo DB connection error :: ", error));
