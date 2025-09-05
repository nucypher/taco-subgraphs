import { Address } from "@graphprotocol/graph-ts";
import {
  afterAll,
  assert,
  beforeAll,
  clearStore,
  describe,
  test,
} from "matchstick-as/assembly/index";
import {
  handleReleased,
  handleReleaseResent,
} from "../src/taco-child-application";
import {
  createReleasedEvent,
  createReleaseResentEvent,
} from "./taco-child-application-utils";

const stakingProvider = Address.fromString(
  "0xf3b519769317f5ac8966417f22b0dfb6fd896a7b",
);

describe("TACoChildApplication", () => {
  beforeAll(() => {
    const releasedEvent = createReleasedEvent(stakingProvider);
    handleReleased(releasedEvent);
  });

  afterAll(() => {
    clearStore();
  });

  test("Released event is created and stored", () => {
    assert.entityCount("Released", 1);
    assert.fieldEquals(
      "Released",
      stakingProvider.toHexString(),
      "releaseResent",
      "false",
    );
  });

  test("ReleaseResent event modify the entity", () => {
    const releaseResentEvent = createReleaseResentEvent(stakingProvider);
    handleReleaseResent(releaseResentEvent);

    assert.entityCount("Released", 1);
    assert.fieldEquals(
      "Released",
      stakingProvider.toHexString(),
      "releaseResent",
      "true",
    );
  });

  test("ReleaseResent event for unknown staking provider", () => {
    const unknownStakingProvider = Address.fromString(
      "0x67f5cb5f947364bfa76ba8b1bee0d26d1a9f5cd0",
    );
    const releaseResentEvent = createReleaseResentEvent(unknownStakingProvider);

    // this will show an error log "Received ReleaseResent..." in the test logs
    handleReleaseResent(releaseResentEvent);

    assert.entityCount("Released", 1);
  });
});
