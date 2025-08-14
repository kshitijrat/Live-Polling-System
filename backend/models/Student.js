import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    socketId: {
        type: String,
        required: true,
        unique: true
    },
    isKicked: {
        type: Boolean,
        default: false
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Student", studentSchema);
