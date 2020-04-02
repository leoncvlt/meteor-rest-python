import { Meteor } from "meteor/meteor";

import Links from "../links";
import { insertLink } from "../methods";
import Api from "../../rest";

const buildResponse = (statusCode, status, message) => ({
  statusCode,
  body: {
    status,
    message
  }
});

Api.addRoute("links/insert/public", {
  post: {
    authRequired: false,
    action: function() {
      const link = this.queryParams;
      try {
        insertLink.call(link);
      } catch (exception) {
        return buildResponse(400, "fail", exception);
      }
      return buildResponse(200, "success", link);
    }
  }
});

Api.addRoute("links/insert/private", {
  post: {
    authRequired: true,
    // roleRequired: "admin", // doesn't seem to work with alanning:roles v3
    action: function() {
      // let's do a manual check on the user's role
      if (Roles.userIsInRole(this.userId, "admin")) {
        const link = this.queryParams;
        try {
          insertLink.call(link);
        } catch (exception) {
          return buildResponse(400, "fail", exception);
        }
        return buildResponse(200, "success", link);
      } else {
        return buildResponse(
          401,
          "fail",
          "User does not posses required privileges"
        );
      }
    }
  }
});
