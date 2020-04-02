import { Meteor } from "meteor/meteor";

import Links from "../links";

Meteor.publish("links", function publishLinks() {
  return Links.find();
});
