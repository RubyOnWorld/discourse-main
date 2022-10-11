import DiscourseRoute from "discourse/routes/discourse";
import EmberObject from "@ember/object";
import { ajax } from "discourse/lib/ajax";

export default DiscourseRoute.extend({
  model() {
    return ajax("/admin/customize/emojis.json").then(function (emojis) {
      return emojis.map(function (emoji) {
        return EmberObject.create(emoji);
      });
    });
  },
});
