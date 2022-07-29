import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { Collections } from "../static/enums";
import { SALT_WORK_FACTOR } from "../static/constants";
import { UserI } from "../static/interfaces/entity";

const UserSchema = new Schema<UserI>({
  password: {
    type: String,
    required: true
  },
  login: {
    type: String,
    required: true,
    unique: true
  },
  token: {
    type: String
  }
}, { collection: Collections.USERS });

UserSchema.set('toJSON', {
  virtuals: true
});

UserSchema.virtual('id').get(function(){
  return this._id.toHexString();
});


UserSchema.pre("save", function(next) {
  const user: any = this;

  if (user && !user.isModified("password")) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = (candidatePassword: string, cb: any) => {
  const user: any = this;
  bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

export default model<UserI>("User", UserSchema);
