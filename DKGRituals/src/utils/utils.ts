import { Bytes, crypto, ethereum } from "@graphprotocol/graph-ts";
import { Coordinator__getPublicKeyFromRitualIdResultValue0Struct } from "../../generated/Coordinator/Coordinator";

/** Calculates public key the same way as the Coordinator contract.
    Function to emulate Solidity's bytes.concat for G1Point`.*/
export function calculatePublicKey(
  publicKey: Coordinator__getPublicKeyFromRitualIdResultValue0Struct,
): string | null {
  if (!publicKey) return null;
  const publicKeyBytes = g1PointToBytes(publicKey.word0, publicKey.word1);
  return crypto.keccak256(publicKeyBytes).toHexString();
}

export function g1PointToBytes(word0: Bytes, word1: Bytes): Bytes {
  const concatenatedBytes = new Uint8Array(word0.length + word1.length);
  concatenatedBytes.set(word0, 0);
  concatenatedBytes.set(word1, word0.length);
  return Bytes.fromUint8Array(concatenatedBytes);
}

export function getTransactionIDFromEvent(event: ethereum.Event): string {
  return event.transaction.hash.toHex() + "-" + event.logIndex.toString();
}
