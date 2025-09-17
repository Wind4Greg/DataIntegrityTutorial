/*

This file is used to generate the EdDSA private/public key pairs for signing
credentials. It produces the following files:
    1. allKeys.json: **private** and public keys in multiple formats for use with
        credential generation code. **PROTECT THIS**
    2. did.json: a DID document suitable for use with the did:web method. Place this
        on website in appropriate directory.

Inputs: did:web identifier.

*/

import { mkdir, writeFile } from 'fs/promises';
import { base58btc } from "multiformats/bases/base58";
import {ed25519} from '@noble/curves/ed25519.js';
import { bytesToHex, concatBytes } from '@noble/hashes/utils.js';

// **You need to furnish this for your club**
const DID_WEB = "did:web:bawfc.grotto-networking.com:signpubkey";

// Public Ed25519 leading bytes: ed01
// Private Ed25519 leading bytes: 8026
const PRIV_PREFIX = new Uint8Array([0x80, 0x26]);
const PUB_PREFIX = new Uint8Array([0xed, 0x01]);

// Create output directory for the results
const baseDir = "./output/keys/";
let status = await mkdir(baseDir, {recursive: true});

let allKeys = {};
let { secretKey, publicKey } = ed25519.keygen();
allKeys.privateKeyHex = bytesToHex(secretKey);
allKeys.publicKeyHex = bytesToHex(publicKey);
let privEncoded = base58btc.encode(concatBytes(PRIV_PREFIX, secretKey));
allKeys.privateKeyMultibase = privEncoded;
let pubEncoded = base58btc.encode(concatBytes(PUB_PREFIX, publicKey));
allKeys.publicKeyMultibase = pubEncoded;
allKeys.didKey = "did:key:" + pubEncoded;
console.log(allKeys);
writeFile(baseDir + 'allKeys.json', JSON.stringify(allKeys, null, 2));

let didDoc = {
  "@context": ["https://www.w3.org/ns/did/v1",
  "https://w3id.org/security/multikey/v1"],
  "id": DID_WEB,
  "assertionMethod": [{
      "id": DID_WEB + "#vm",
      "type": "Multikey",
      "controller": DID_WEB,
      "publicKeyMultibase": pubEncoded
  }]
}

console.log(didDoc);
writeFile(baseDir + 'did.json', JSON.stringify(didDoc, null, 2));


