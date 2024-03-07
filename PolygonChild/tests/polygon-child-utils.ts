import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  MessageSent,
  OwnershipTransferred
} from "../generated/PolygonChild/PolygonChild"

export function createMessageSentEvent(message: Bytes): MessageSent {
  let messageSentEvent = changetype<MessageSent>(newMockEvent())

  messageSentEvent.parameters = new Array()

  messageSentEvent.parameters.push(
    new ethereum.EventParam("message", ethereum.Value.fromBytes(message))
  )

  return messageSentEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}
