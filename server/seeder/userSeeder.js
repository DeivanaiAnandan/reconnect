import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/userModel.js";
import Region from "../models/regionModel.js";

dotenv.config();

const users = [
  {
    name: "Arun Kumar",
    age: 32,
    gender: "Male",
    phone: "9876543210",
    localLanguage: "Tamil",
    region: "Chennai",
    stateProvince: "Tamil Nadu",
    country: "India",
    email: "arun@example.com",
    skills: ["Carpentry"],
  },
  {
    name: "Meena Devi",
    age: 28,
    gender: "Female",
    phone: "9876543211",
    localLanguage: "Tamil",
    region: "Coimbatore",
    stateProvince: "Tamil Nadu",
    country: "India",
    email: "meena@example.com",
    skills: ["Tailoring", "Cooking"],
  },
  {
    name: "Ravi Kumar",
    age: 41,
    gender: "Male",
    phone: "9876543212",
    localLanguage: "Tamil",
    region: "Madurai",
    stateProvince: "Tamil Nadu",
    country: "India",
    email: "ravi@example.com",
    skills: ["Painting"],
  },
  {
    name: "Lakshmi",
    age: 35,
    gender: "Female",
    phone: "9876543213",
    localLanguage: "Tamil",
    region: "Chennai",
    stateProvince: "Tamil Nadu",
    country: "India",
    email: "lakshmi@example.com",
    skills: ["Cooking", "Tailoring"],
  },
  {
    name: "Suresh",
    age: 29,
    gender: "Male",
    phone: "9876543214",
    localLanguage: "Malayalam",
    region: "Kochi",
    stateProvince: "Kerala",
    country: "India",
    email: "suresh@example.com",
    skills: ["Farming"],
  },
  {
    name: "Anita Sharma",
    age: 38,
    gender: "Female",
    phone: "9876543215",
    localLanguage: "Nepali",
    region: "Kathmandu",
    stateProvince: "Bagmati",
    country: "Nepal",
    email: "anita@example.com",
    skills: ["Cooking"],
  },
  {
    name: "Bikash Thapa",
    age: 26,
    gender: "Male",
    phone: "9876543216",
    localLanguage: "Nepali",
    region: "Pokhara",
    stateProvince: "Gandaki",
    country: "Nepal",
    email: "bikash@example.com",
    skills: ["Carpentry", "Painting"],
  },
  {
    name: "Nimal Perera",
    age: 45,
    gender: "Male",
    phone: "9876543217",
    localLanguage: "Sinhala",
    region: "Colombo",
    stateProvince: "Western",
    country: "Sri Lanka",
    email: "nimal@example.com",
    skills: ["Farming"],
  },
  {
    name: "Kavitha",
    age: 31,
    gender: "Female",
    phone: "9876543218",
    localLanguage: "Tamil",
    region: "Jaffna",
    stateProvince: "Northern",
    country: "Sri Lanka",
    email: "kavitha@example.com",
    skills: ["Tailoring"],
  },
  {
    name: "Rahim Ahmed",
    age: 37,
    gender: "Male",
    phone: "9876543219",
    localLanguage: "Bengali",
    region: "Dhaka",
    stateProvince: "Dhaka",
    country: "Bangladesh",
    email: "rahim@example.com",
    skills: ["Farming", "Carpentry"],
  },
];
const seedUsers = async () => {
  try {
    await connectDB();

    const regions = await Region.find();

    const usersWithRegions = await Promise.all(
      users.map(async (user) => {
        const region = regions.find(
          (item) =>
            item.stateProvince === user.stateProvince &&
            item.country === user.country &&
            item.region === user.region,
        );

        if (!region) {
          throw new Error(
            `Region not found for ${user.stateProvince}, ${user.country}`,
          );
        }

        return {
          ...user,
          regionId: region._id,
          firebaseUid: `demo-${user.email}`,
          role: "beneficiary",
          accountStatus: "active",
        };
      }),
    );
    await User.deleteMany();

    await User.insertMany(usersWithRegions);

    console.log("10 users seeded successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedUsers();
