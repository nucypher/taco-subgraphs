import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, Address } from "@graphprotocol/graph-ts"
import { MessageSent } from "../generated/schema"
import { MessageSent as MessageSentEvent } from "../generated/PolygonChild/PolygonChild"
import { handleMessageSent } from "../src/polygon-child"
import { createMessageSentEvent } from "./polygon-child-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let message = Bytes.fromI32(1234567890)
    let newMessageSentEvent = createMessageSentEvent(message)
    handleMessageSent(newMessageSentEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("MessageSent created and stored", () => {
    assert.entityCount("MessageSent", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "MessageSent",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "message",
      "1234567890"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
