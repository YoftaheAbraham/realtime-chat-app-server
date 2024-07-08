import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    ownerID: {
        type: String
    },
    groupName: {
        required: [true, "Please provide Groupname for your group "],
        type: String,
    },
    groupUsername: {
        type: String,
        required: [true, "Please provide username for your group "],
        unique: true
    },
    members: {
        type: [String],
        default: []
    },
    messages: {
        type: [String],
        default: []
    },
    groupProfilePicture: String,
    groupID: String
}, {
    timestamps: true
});

groupSchema.pre("save", function (next) {
    this.groupID = this._id
    if (!this.members.includes(this.ownerID)) {
        this.members.push(this.ownerID);
    }
    this.groupProfilePicture = `https://avatar.iran.liara.run/username?username=${this.groupName.split(" ").join("+")}`
    next()
})

const groupModel = mongoose.model("Group", groupSchema);

export default groupModel;