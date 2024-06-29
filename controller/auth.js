import { db } from "../connection.js";
import moment from "moment";

export const register = async (req, res) => {
  try {
    const { name, email, DOB, gender } = req.body;

    // Validate age before proceeding
    const age = moment().diff(moment(DOB, "YYYY-MM-DD"), "years");
    if (age < 18) {
      return res.status(400).send("You are underage!");
    }

    // Check if user already exists
    const checkQuery = "SELECT * FROM register WHERE name = ?";
    const [checkResult] = await db.promise().query(checkQuery, [name]);

    if (checkResult.length) {
      return res.status(409).send("User already exists");
    }

    // Insert new user
    const insertQuery = "INSERT INTO register (`name`, `email`, `DOB`, `gender`) VALUES (?, ?, ?, ?)";
    const values = [name, email, DOB, gender];
    await db.promise().query(insertQuery, values);

    return res.status(200).send("Registered");

  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong");
  }
};
