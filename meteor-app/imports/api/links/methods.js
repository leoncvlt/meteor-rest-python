import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { ValidatedMethod } from "meteor/mdg:validated-method";
import SimpleSchema from "simpl-schema";

import Links from "./links";

const insertLink = new ValidatedMethod({
  name: "Links.create",
  validate: new SimpleSchema({
    title: {
      type: String
    },
    url: {
      type: String
    },
    created_at: {
      type: Date,
      autoValue: () => new Date()
    }
  }).validator({ clean: true }),
  run(link) {
    try {
      return Links.insert(link);
    } catch (exception) {
      throw new Meteor.Error("500", exception);
    }
  }
});

const removeLink = new ValidatedMethod({
  name: "Links.remove",
  validate: linkId => check(linkId, String),
  run(linkId) {
    try {
      return Links.remove(linkId);
    } catch (exception) {
      throw new Meteor.Error("500", exception);
    }
  }
});

export { insertLink, removeLink };
