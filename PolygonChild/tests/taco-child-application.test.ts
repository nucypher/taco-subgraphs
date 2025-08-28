import { Address } from "@graphprotocol/graph-ts";
import {
  afterAll,
  assert,
  clearStore,
  describe,
  test,
} from "matchstick-as/assembly/index";
import { handleReleased } from "../src/taco-child-application";
import { createReleasedEvent } from "./taco-child-application-utils";
// import { logEntity } from "matchstick-as/assembly/store"

describe("TACoChildApplication", () => {
  afterAll(() => {
    clearStore();
  });

  test("Released event is created and stored", () => {
    const stakingProvider = Address.fromString(
      "0xf3b519769317f5ac8966417f22b0dfb6fd896a7b",
    );

    const releasedEvent = createReleasedEvent(stakingProvider);
    handleReleased(releasedEvent);

    // logEntity("Released", stakingProvider.toHexString());

    assert.entityCount("Released", 1);
    assert.fieldEquals(
      "Released",
      stakingProvider.toHexString(),
      "releaseResent",
      "false",
    );
  });
});
