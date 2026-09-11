import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import NGO from "../models/ngoModel.js";
import Region from "../models/regionModel.js";
dotenv.config();
const ngos = [
  {
    name: "Helping Hands NGO",
    email: "helpinghands@example.com",
    country: "Nepal",
    stateProvince: "Koshi",
    localLanguage: "Nepali",
  },
  {
    name: "Community Support NGO",
    email: "community@example.com",
    country: "Sri Lanka",
    stateProvince: "Western",
    localLanguage: "Sinhala",
  },
  {
  name: "Hope Community Foundation",
  email: "hopecommunity@example.com",
  country: "India",
  stateProvince: "Tamil Nadu",
  localLanguage: "Tamil",
}
];
const seedNGOs = async () => {
  try {
    await connectDB();

    const regions = await Region.find();

    const ngosWithRegions = ngos.map((ngo) => {
      const region = regions.find(
        (item) =>
          item.stateProvince === ngo.stateProvince &&
          item.country === ngo.country
      );

      if (!region) {
        throw new Error(
          `Region not found for ${ngo.stateProvince}, ${ngo.country}`
        );
      }

      return {
        ...ngo,
        regionId: region._id,
        firebaseUid: `demo-${ngo.email}`,
        role: "ngo",
        accountStatus: "active",
      };
    });

    await NGO.insertMany(ngosWithRegions);

    console.log("NGOs seeded successfully");

    await mongoose.connection.close();
    process.exit(0); //exit with succcess
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); //exit with error
  }
};

seedNGOs();