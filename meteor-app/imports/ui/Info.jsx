import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import Links from "../api/links/links";

import { insertLink, removeLink } from "../api/links/methods";

export const Info = () => {
  const loading = useTracker(() => {
    const handle = Meteor.subscribe("links");
    return !handle.ready();
  });

  const links = useTracker(() => {
    return Links.find().fetch();
  });

  const handleAdd = () => {
    insertLink.call({ title: "Google", url: "https://www.google.com/" });
  };

  const handleDelete = id => {
    removeLink.call(id);
  };

  return (
    <div>
      <h2>Add some links!</h2>

      <ul>
        {links.map(link => (
          <li key={link._id}>
            <a href={link.url} target="_blank">
              {link.title}
            </a>
            <button onClick={e => handleDelete(link._id)}>x</button>
          </li>
        ))}
      </ul>

      <button onClick={handleAdd}>Add Google</button>
    </div>
  );
};
