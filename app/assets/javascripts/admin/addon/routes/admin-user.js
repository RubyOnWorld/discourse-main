import AdminUser from "admin/models/admin-user";
import DiscourseRoute from "discourse/routes/discourse";
import { get } from "@ember/object";

export default DiscourseRoute.extend({
  serialize(model) {
    return {
      user_id: model.get("id"),
      username: model.get("username").toLowerCase(),
    };
  },

  model(params) {
    return AdminUser.find(get(params, "user_id"));
  },

  renderTemplate() {
    this.render({ into: "admin" });
  },

  afterModel(adminUser) {
    return adminUser.loadDetails().then(function () {
      adminUser.setOriginalTrustLevel();
      return adminUser;
    });
  },
});
