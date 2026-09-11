import mongoose from "mongoose";

const assistanceRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    regionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region",
      required: true,
    },

    assistanceType: {
      type: [String],
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

      status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const AssistanceRequest = mongoose.model(
  "AssistanceRequest",
  assistanceRequestSchema
);

export default AssistanceRequest;