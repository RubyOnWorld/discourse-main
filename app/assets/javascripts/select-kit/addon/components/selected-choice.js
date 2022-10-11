import { guidFor } from "@ember/object/internals";
import Component from "@ember/component";
import { computed } from "@ember/object";
import layout from "select-kit/templates/components/selected-choice";
import UtilsMixin from "select-kit/mixins/utils";

export default Component.extend(UtilsMixin, {
  tagName: "",
  layout,
  item: null,
  selectKit: null,
  extraClass: null,
  id: null,

  init() {
    this._super(...arguments);

    this.set("id", guidFor(this));
  },

  itemValue: computed("item", function () {
    return this.getValue(this.item);
  }),

  itemName: computed("item", function () {
    return this.getName(this.item);
  }),
});
