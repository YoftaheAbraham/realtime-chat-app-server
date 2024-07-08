import mongoose from "mongoose";
import validator from "validator"
const userSchema = new mongoose.Schema({
    full_name: {
        type: String
    },
    username: {
        type: String,
        required: [true, "Please provide username"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        select: false
    },
    userID: String,
    profile_picture: String,
    gender: String
}, {
    timestamps: true
});



const boys = [47, 24, 17, 44, 49, 26, 34, 7, 36, 14, 37, 21,
    40, 27, 5, 48, 16, 15, 4, 29, 2, 6, 1, 19, 43, 41, 9, 18,
    30, 8, 35, 39, 12, 25, 28, 38, 46, 22, 23
]
const girls = [96, 68, 63, 91, 79, 88, 57, 97, 66,
    70, 78, 71, 55, 61, 62, 64, 81, 87, 76, 83, 84, 58, 77, 99,
    82, 73, 60, 51, 53, 72, 85, 74, 90, 100, 59, 86, 64,
    75, 89, 95, 80
]
userSchema.pre("save", function (next) {
    this.username = this.username.split(" ").join("").substring(0, 10)
    this.full_name = this.full_name.substring(0, 20)
    this.userID = this._id;
    let pictureIndex;

    if (validator.isAlpha(this.username)) {
        if (!this.profile_picture) {
            if (this.gender == "girl") {
                pictureIndex = girls[Math.floor(Math.random() * (girls.length - 1))];
                this.profile_picture = `https://avatar.iran.liara.run/public/${pictureIndex}`
            } else {
                pictureIndex = boys[Math.floor(Math.random() * (boys.length - 1))];
                this.profile_picture = `https://avatar.iran.liara.run/public/${pictureIndex}`
            }
        }
    } else {
        throw Error("username can't have number or any special character")
    }

    next()
})

const userModel = mongoose.model("User", userSchema);

export default userModel