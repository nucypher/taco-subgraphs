import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from "matchstick-as/assembly/index";
import { Bytes } from "@graphprotocol/graph-ts";
import { handleMessageSent } from "../src/polygon-child";
import { createMessageSentEvent } from "./polygon-child-utils";

describe("Describe entity assertions", () => {
  beforeAll(() => {
    const message = Bytes.fromI32(1234567890);
    const newMessageSentEvent = createMessageSentEvent(message);
    handleMessageSent(newMessageSentEvent);
  });

  afterAll(() => {
    clearStore();
  });

  test("MessageSent created and stored", () => {
    assert.entityCount("MessageSent", 1);

    assert.fieldEquals(
      "MessageSent",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000",
      "message",
      Bytes.fromI32(1234567890).toHexString()
    );
  });
});
