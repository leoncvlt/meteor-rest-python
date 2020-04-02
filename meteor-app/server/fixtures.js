import { Meteor } from "meteor/meteor";

if (!Meteor.users.find().count()) {
  const admin = Meteor.settings.private.admin;
  const userId = Accounts.createUser({
    email: admin.email,
    username: admin.username,
    password: admin.password
    // alternatively, could set the password to Random.secret(), then call
    // Accounts.sendResetPasswordEmail(userId) to have the admin reset their password
  });

  Roles.createRole("admin", { unlessExists: true });
  Roles.addUsersToRoles(userId, ["admin"]);

  console.log("Created admin account:", Meteor.users.findOne({ _id: userId }));
}
