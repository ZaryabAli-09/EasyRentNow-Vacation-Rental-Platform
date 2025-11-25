import mongoose from "mongoose";
export interface IReservation {
  _id?: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  userId?: mongoose.Types.ObjectId;
  homeId?: mongoose.Types.ObjectId;
}
const reservationSchema = new mongoose.Schema<IReservation>(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    homeId: { type: mongoose.Schema.Types.ObjectId, ref: "Home" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

const Reservation =
  mongoose.models?.Reservation ||
  mongoose.model<IReservation>("Reservation", reservationSchema);

export { Reservation };
