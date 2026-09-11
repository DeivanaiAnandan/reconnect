import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import Region from "../models/regionModel.js";

dotenv.config();

const regions = [
  // India
  {
    region: "Chennai",
    stateProvince: "Tamil Nadu",
    country: "India",
  },
  {
    region: "Madurai",
    stateProvince: "Tamil Nadu",
    country: "India",
  },
  {
    region: "Coimbatore",
    stateProvince: "Tamil Nadu",
    country: "India",
  },
  {
    region: "Bengaluru",
    stateProvince: "Karnataka",
    country: "India",
  },
  {
    region: "Kochi",
    stateProvince: "Kerala",
    country: "India",
  },

  // Nepal
  {
    region: "Kathmandu",
    stateProvince: "Bagmati",
    country: "Nepal",
  },
  {
    region: "Pokhara",
    stateProvince: "Gandaki",
    country: "Nepal",
  },
  {
    region: "Biratnagar",
    stateProvince: "Koshi",
    country: "Nepal",
  },
  {
    region: "Nepalgunj",
    stateProvince: "Lumbini",
    country: "Nepal",
  },

  // Sri Lanka
  {
    region: "Colombo",
    stateProvince: "Western",
    country: "Sri Lanka",
  },
  {
    region: "Kandy",
    stateProvince: "Central",
    country: "Sri Lanka",
  },
  {
    region: "Jaffna",
    stateProvince: "Northern",
    country: "Sri Lanka",
  },
  {
    region: "Galle",
    stateProvince: "Southern",
    country: "Sri Lanka",
  },

  // Bangladesh
  {
    region: "Dhaka",
    stateProvince: "Dhaka",
    country: "Bangladesh",
  },
  {
    region: "Chattogram",
    stateProvince: "Chattogram",
    country: "Bangladesh",
  },

  // Pakistan
  {
    region: "Lahore",
    stateProvince: "Punjab",
    country: "Pakistan",
  },
  {
    region: "Karachi",
    stateProvince: "Sindh",
    country: "Pakistan",
  },

  // Myanmar
  {
    region: "Yangon",
    stateProvince: "Yangon",
    country: "Myanmar",
  },
  {
    region: "Mandalay",
    stateProvince: "Mandalay",
    country: "Myanmar",
  },
];

const seedRegions = async () => {
  try {
    await connectDB();

    await Region.deleteMany();

    await Region.insertMany(regions);

    console.log("Regions seeded successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedRegions();
