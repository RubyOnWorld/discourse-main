import {
  acceptance,
  count,
  exists,
  query,
  queryAll,
  updateCurrentUser,
} from "discourse/tests/helpers/qunit-helpers";
import { click, triggerKeyEvent, visit } from "@ember/test-helpers";
import { test } from "qunit";

acceptance("Do not disturb", function (needs) {
  needs.user();
  needs.pretender((server, helper) => {
    server.post("/do-not-disturb.json", () => {
      let now = new Date();
      now.setHours(now.getHours() + 1);
      return helper.response({ ends_at: now });
    });
    server.delete("/do-not-disturb.json", () =>
      helper.response({ success: true })
    );
  });

  test("when turned off, it is turned on from modal", async function (assert) {
    updateCurrentUser({ do_not_disturb_until: null });

    await visit("/");
    await click(".header-dropdown-toggle.current-user");
    await click(".menu-links-row .user-preferences-link");

    await click(".do-not-disturb");

    assert.ok(exists(".do-not-disturb-modal"), "modal to choose time appears");

    let tiles = queryAll(".do-not-disturb-tile");
    assert.ok(tiles.length === 4, "There are 4 duration choices");

    await click(tiles[0]);

    assert.ok(query(".do-not-disturb-modal.hidden"), "modal is hidden");

    assert.ok(
      exists(".header-dropdown-toggle .do-not-disturb-background .d-icon-moon"),
      "moon icon is present in header"
    );
  });

  test("Can be invoked via keyboard", async function (assert) {
    updateCurrentUser({ do_not_disturb_until: null });

    await visit("/");
    await click(".header-dropdown-toggle.current-user");
    await click(".menu-links-row .user-preferences-link");
    await click(".do-not-disturb");

    assert.ok(exists(".do-not-disturb-modal"), "DND modal is displayed");

    assert.strictEqual(
      count(".do-not-disturb-tile"),
      4,
      "There are 4 duration choices"
    );

    await triggerKeyEvent(
      ".do-not-disturb-tile:nth-child(1)",
      "keydown",
      "Enter"
    );

    assert.ok(
      query(".do-not-disturb-modal.hidden"),
      "DND modal is hidden after making a choice"
    );

    assert.ok(
      exists(".header-dropdown-toggle .do-not-disturb-background .d-icon-moon"),
      "moon icon is shown in header avatar"
    );
  });

  test("when turned on, it can be turned off", async function (assert) {
    let now = new Date();
    now.setHours(now.getHours() + 1);
    updateCurrentUser({ do_not_disturb_until: now });

    await visit("/");
    await click(".header-dropdown-toggle.current-user");
    await click(".menu-links-row .user-preferences-link");
    assert.strictEqual(
      query(".do-not-disturb .relative-date").textContent,
      "1h"
    );

    await click(".do-not-disturb");

    assert.ok(
      !exists(".do-not-disturb-background"),
      "The active moon icons are removed"
    );
  });
});

acceptance("Do not disturb - new user menu", function (needs) {
  needs.user({ redesigned_user_menu_enabled: true });
  needs.pretender((server, helper) => {
    server.post("/do-not-disturb.json", () => {
      const now = new Date();
      now.setHours(now.getHours() + 1);
      return helper.response({ ends_at: now });
    });
    server.delete("/do-not-disturb.json", () =>
      helper.response({ success: true })
    );
  });

  test("when turned off, it is turned on from modal", async function (assert) {
    updateCurrentUser({ do_not_disturb_until: null });

    await visit("/");
    await click(".header-dropdown-toggle.current-user");
    await click("#user-menu-button-profile");
    await click("#quick-access-profile .do-not-disturb .btn");

    assert.ok(exists(".do-not-disturb-modal"), "modal to choose time appears");

    let tiles = queryAll(".do-not-disturb-tile");
    assert.ok(tiles.length === 4, "There are 4 duration choices");

    await click(tiles[0]);

    assert.ok(query(".do-not-disturb-modal.hidden"), "modal is hidden");

    assert.ok(
      exists(".header-dropdown-toggle .do-not-disturb-background .d-icon-moon"),
      "moon icon is present in header"
    );
  });

  test("Can be invoked via keyboard", async function (assert) {
    updateCurrentUser({ do_not_disturb_until: null });

    await visit("/");
    await click(".header-dropdown-toggle.current-user");
    await click("#user-menu-button-profile");
    await click("#quick-access-profile .do-not-disturb .btn");

    assert.ok(exists(".do-not-disturb-modal"), "DND modal is displayed");

    assert.strictEqual(
      count(".do-not-disturb-tile"),
      4,
      "There are 4 duration choices"
    );

    await triggerKeyEvent(
      ".do-not-disturb-tile:nth-child(1)",
      "keydown",
      "Enter"
    );

    assert.ok(
      query(".do-not-disturb-modal.hidden"),
      "DND modal is hidden after making a choice"
    );

    assert.ok(
      exists(".header-dropdown-toggle .do-not-disturb-background .d-icon-moon"),
      "moon icon is shown in header avatar"
    );
  });

  test("when turned on, it can be turned off", async function (assert) {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    updateCurrentUser({ do_not_disturb_until: now });

    await visit("/");

    assert.ok(
      exists(".do-not-disturb-background"),
      "The active moon icon is shown"
    );

    await click(".header-dropdown-toggle.current-user");
    await click("#user-menu-button-profile");
    assert.strictEqual(
      query(".do-not-disturb .relative-date").textContent.trim(),
      "1h",
      "the Do Not Disturb button shows how much time is left for DND mode"
    );
    assert.ok(
      exists(".do-not-disturb .d-icon-toggle-on"),
      "the Do Not Disturb button has the toggle-on icon"
    );

    await click("#quick-access-profile .do-not-disturb .btn");

    assert.notOk(
      exists(".do-not-disturb-background"),
      "The active moon icons are removed"
    );
    assert.notOk(
      exists(".do-not-disturb .relative-date"),
      "the text showing how much time is left for DND mode is gone"
    );
    assert.ok(
      exists(".do-not-disturb .d-icon-toggle-off"),
      "the Do Not Disturb button has the toggle-off icon"
    );
  });

  test("user menu gets closed when the DnD modal is opened", async function (assert) {
    this.siteSettings.enable_user_status = true;

    await visit("/");
    await click(".header-dropdown-toggle.current-user");
    await click("#user-menu-button-profile");
    await click("#quick-access-profile .do-not-disturb .btn");

    assert.notOk(exists(".user-menu"));
  });
});
