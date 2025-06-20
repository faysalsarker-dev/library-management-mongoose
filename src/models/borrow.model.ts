import mongoose, { model, Schema } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";


const borrowSchema: Schema<IBorrow> = new Schema(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Borrowed book ID is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "At least one copy must be borrowed"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer",
      },
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Borrow = model<IBorrow>("Borrow", borrowSchema);
export default Borrow;